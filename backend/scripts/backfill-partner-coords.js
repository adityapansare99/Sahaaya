/**
 * One-time backfill: geocodes Partner documents that have a null
 * latitude/longitude using their stored `address`.
 *
 * Why: partners registered before geo-capture (or who typed an address
 * without picking an autocomplete suggestion) have no coordinates, so they
 * never surface in a rider's "Near Me" filter. This repairs that data.
 *
 * Safe by design:
 *   - Dry-run by default — prints what it WOULD do. Pass --write to persist.
 *   - Idempotent — only touches partners whose latitude OR longitude is null.
 *   - Throttled to ~1 req/s when using Nominatim (their usage policy).
 *
 * Geocoder:
 *   - Default: Nominatim (OpenStreetMap) — keyless, runs immediately.
 *   - Optional: Google Geocoding API — set GOOGLE_MAPS_API_KEY in backend/.env
 *     (and enable Geocoding API on that key). Used automatically when present,
 *     and is noticeably more accurate for Indian addresses.
 *
 * Usage:
 *   npm run backfill:partners               # dry-run (no writes)
 *   npm run backfill:partners -- --write    # persist results
 */
import "dotenv/config";
import mongoose from "mongoose";
import axios from "axios";
import { dbname } from "../src/constant.js";
import Partner from "../src/model/partner.model.js";

const shouldWrite = process.argv.includes("--write");
const GOOGLE_KEY = process.env.GOOGLE_MAPS_API_KEY; // optional server key
const SLEEP_MS = 1100; // respect Nominatim's ~1 req/sec policy

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const geocodeNominatim = async (address) => {
  const { data } = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: { q: address, format: "json", limit: 1, countrycodes: "in" },
      headers: { "User-Agent": "Sahaaya-backfill/1.0 (dev migration)" },
      timeout: 10000,
    },
  );
  if (!Array.isArray(data) || data.length === 0) return null;
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
};

const geocodeGoogle = async (address) => {
  const { data } = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: { address, components: "country:IN", key: GOOGLE_KEY },
      timeout: 10000,
    },
  );
  if (data.status !== "OK" || !data.results?.length) return null;
  const loc = data.results[0].geometry.location;
  return { lat: loc.lat, lng: loc.lng };
};

const geocode = GOOGLE_KEY ? geocodeGoogle : geocodeNominatim;

const run = async () => {
  if (!process.env.dblink) {
    console.error(
      "[backfill] dblink env var is missing. Set it in backend/.env",
    );
    process.exit(1);
  }

  await mongoose.connect(`${process.env.dblink}${dbname}`);

  const partners = await Partner.find({
    $or: [{ latitude: null }, { longitude: null }],
  }).select("name address latitude longitude");

  console.log(
    `[backfill] found ${partners.length} partner(s) missing coordinates`,
  );
  console.log(`[backfill] geocoder: ${GOOGLE_KEY ? "google" : "nominatim"}`);
  console.log(
    `[backfill] mode: ${shouldWrite ? "WRITE (will persist)" : "DRY-RUN (no writes)"}`,
  );

  let updated = 0;
  let failed = 0;

  for (const p of partners) {
    if (!p.address || !p.address.trim()) {
      console.log(`  ! skip ${p._id} (${p.name || "?"}): no address on file`);
      failed++;
      continue;
    }
    try {
      const coords = await geocode(p.address);
      if (!coords) {
        console.log(`  x ${p.name} — no geocode result for "${p.address}"`);
        failed++;
      } else if (shouldWrite) {
        await Partner.updateOne(
          { _id: p._id },
          { latitude: coords.lat, longitude: coords.lng },
        );
        console.log(`  + wrote ${p.name} -> ${coords.lat}, ${coords.lng}`);
        updated++;
      } else {
        console.log(`  . would write ${p.name} -> ${coords.lat}, ${coords.lng}`);
        updated++;
      }
    } catch (err) {
      console.log(`  x ${p.name} — error: ${err.message}`);
      failed++;
    }
    if (!GOOGLE_KEY) await sleep(SLEEP_MS); // throttle Nominatim only
  }

  console.log(`\n[backfill] done. ${updated} processed, ${failed} failed.`);
  if (!shouldWrite) {
    console.log(
      "[backfill] this was a DRY-RUN. Re-run with --write to persist.",
    );
  }

  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("[backfill] fatal:", err);
  process.exit(1);
});
