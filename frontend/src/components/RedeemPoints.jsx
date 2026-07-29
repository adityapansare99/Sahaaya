import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Gift,
  Award,
  Tag,
  CheckCircle,
  X,
  Utensils,
  Ticket,
  Flame,
  History,
  MapPin,
  Search,
  Navigation,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { haversineDistance } from "../utils/haversine";
import CountUp from "./flow/CountUp";

const placeholderLogo =
  "https://cdn-icons-png.flaticon.com/512/149/149071.png";

const RedeemPoints = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [topPartners, setTopPartners] = useState([]);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState(null);
  const [redeeming, setRedeeming] = useState(false);
  const [success, setSuccess] = useState(null);
  const [history, setHistory] = useState([]);

  // Rider profile — home coords for near-me
  const [profile, setProfile] = useState(null);

  // View toggle & search
  const [view, setView] = useState("all"); // "all" | "nearme"
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [listRes, rewardsRes, topRes, historyRes, profileRes] =
          await Promise.all([
            axios.get(`${backendurl}partner/list`),
            axios.get(`${backendurl}rider/rewards`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${backendurl}partner/top`),
            axios.get(`${backendurl}rider/myRedemptions`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get(`${backendurl}delivery/profile`, {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        if (listRes.data.success) {
          setPartners(listRes.data.data);
        }
        if (rewardsRes.data.success) {
          setPoints(rewardsRes.data.data.points || 0);
        }
        if (topRes.data.success) {
          setTopPartners(topRes.data.data);
        }
        if (historyRes.data.success) {
          setHistory(historyRes.data.data);
        }
        if (profileRes.data.success) {
          setProfile(profileRes.data.data);
        }
      } catch (error) {
        toast.error("Error loading partners");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [backendurl, token]);

  // ── Derived: near-me partners ──────────────────────────────
  const homeLat = profile?.homeLatitude ?? profile?.latitude ?? null;
  const homeLng = profile?.homeLongitude ?? profile?.longitude ?? null;
  const hasHome = homeLat != null && homeLng != null;

  const partnersWithDistance = useMemo(
    () =>
      partners.map((p) => {
        let dist = null;
        if (hasHome && p.latitude != null && p.longitude != null) {
          const d = haversineDistance(homeLat, homeLng, p.latitude, p.longitude);
          dist = d !== null ? Math.round(d * 10) / 10 : null;
        }
        return { ...p, distanceKm: dist };
      }),
    [partners, homeLat, homeLng, hasHome],
  );

  const nearMePartners = useMemo(
    () =>
      partnersWithDistance
        .filter((p) => p.distanceKm !== null && p.distanceKm <= 20)
        .sort((a, b) => a.distanceKm - b.distanceKm),
    [partnersWithDistance],
  );

  // ── Search filtering (city/address/name — case-insensitive) ─
  const searchLower = search.toLowerCase().trim();
  const filteredPartners = useMemo(
    () =>
      partners.filter(
        (p) =>
          !searchLower ||
          p.name?.toLowerCase().includes(searchLower) ||
          p.address?.toLowerCase().includes(searchLower),
      ),
    [partners, searchLower],
  );

  const displayPartners =
    view === "nearme" && hasHome ? nearMePartners : filteredPartners;

  // ── Handlers ───────────────────────────────────────────────
  const handleRedeem = async () => {
    if (!selected) return;
    setRedeeming(true);
    try {
      const response = await axios.post(
        `${backendurl}rider/redeemPoints`,
        { partnerId: selected._id },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (response.data.success) {
        setPoints(response.data.data.remainingPoints);
        setSuccess(response.data.data);
        setSelected(null);
        toast.success("Points redeemed successfully");
      } else {
        toast.error(response.data.message || "Redemption failed");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Redemption failed");
    } finally {
      setRedeeming(false);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="mb-2">
          <div className="flow-skel skel-line w-48 mb-2" style={{ height: 30 }} />
          <div className="flow-skel skel-line w-64" />
        </div>
        <div className="flow-panel" style={{ height: 180 }} />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flow-panel p-6" style={{ height: 224 }} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Redeem Points</h2>
        <p className="text-mute">Turn your delivery points into discounts at partner restaurants</p>
      </div>

      {/* ── Points balance (Flow dark hero) ──────────────────── */}
      <div
        className="relative overflow-hidden rounded-[var(--r-xl)]"
        style={{ background: "linear-gradient(162deg,#0e1f1a 0%,#122821 55%,#0b1a15 100%)", color: "#eaf3ee" }}
      >
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.04) 1px,transparent 1px)",
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)",
            WebkitMaskImage: "radial-gradient(120% 120% at 30% 0%,#000,transparent 75%)",
          }}
        />
        <div className="relative p-6 md:p-8 flex items-center justify-between gap-6">
          <div className="flex-1">
            <div className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-white/55 mb-2">
              Available Points
            </div>
            <div
              className="font-display font-bold nums"
              style={{ fontSize: "clamp(40px,6vw,64px)", lineHeight: 0.9, letterSpacing: "-2px", color: "#fff" }}
            >
              <CountUp value={points} />
            </div>
            <p className="text-white/55 text-sm mt-3">Redeem at any restaurant below</p>
          </div>
          <div className="shrink-0 grid place-items-center w-16 h-16 rounded-2xl" style={{ background: "rgba(255,255,255,.08)" }}>
            <Gift className="w-7 h-7 text-white" />
          </div>
        </div>
      </div>

      {/* ── Top redeemed ─────────────────────────────────────── */}
      {topPartners.length > 0 && (
        <div className="flow-panel p-6">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-4 h-4" style={{ color: "var(--color-donor)" }} />
            <h3 className="font-display text-base font-semibold text-ink">Top Redeemed</h3>
            <span className="text-xs text-mute-2">Where riders redeem most</span>
          </div>

          <div className="space-y-2">
            {topPartners.map((p, idx) => {
              const cost = p.pointsRequired || 0;
              const affordable = points >= cost;
              return (
                <div key={p._id} className="flex items-center gap-4 p-3 rounded-xl bg-surface-2">
                  <div
                    className="w-7 h-7 flex-shrink-0 rounded-full grid place-items-center font-display font-bold text-xs nums"
                    style={idx === 0 ? { background: "var(--color-donor)", color: "#fff" } : { background: "var(--color-surface)", color: "var(--color-mute)", border: "1px solid var(--color-line)" }}
                  >
                    {idx + 1}
                  </div>
                  <img src={p.logo || placeholderLogo} alt={p.name} className="w-10 h-10 rounded-xl object-cover" style={{ border: "1px solid var(--color-line)" }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-ink truncate">{p.name}</h4>
                      <span className="text-xs text-mute-2 whitespace-nowrap hidden sm:inline">· {p.address}</span>
                      <span className="text-xs text-mute-2 whitespace-nowrap">· {p.redemptionCount} redeemed</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full nums" style={{ background: "rgba(var(--ngo-rgb),.12)", color: "var(--color-ngo-2)" }}>
                        {p.discountPercentage}% off
                      </span>
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full nums" style={{ background: "var(--color-donor-soft)", color: "var(--color-donor-2)" }}>
                        {cost} pts
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => affordable && setSelected(p)}
                    disabled={!affordable}
                    className={affordable ? "fbtn fbtn-flow fbtn-sm shrink-0" : "fbtn fbtn-g fbtn-sm shrink-0"}
                  >
                    {affordable ? "Redeem" : `${cost - points} pts`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Redemption History ───────────────────────────────── */}
      {history.length > 0 && (
        <div className="flow-panel overflow-hidden">
          <div className="flex items-center gap-2 p-6 pb-4">
            <History className="w-4 h-4 text-mute" />
            <h3 className="font-display text-base font-semibold text-ink">Recent Redemptions</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="flow-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Restaurant</th>
                  <th>Location</th>
                  <th>Discount</th>
                  <th>Points</th>
                  <th>Code</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r._id}>
                    <td className="text-mute nums whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="font-medium text-ink">{r.partner?.name || "—"}</td>
                    <td className="text-ink-2">{r.partner?.address || "—"}</td>
                    <td className="font-medium nums" style={{ color: "var(--color-ngo-2)" }}>{r.discountPercentage}%</td>
                    <td className="text-ink nums">{r.pointsUsed}</td>
                    <td className="font-mono text-xs text-ink-2">{r.bookingCode}</td>
                    <td>
                      <span
                        className="px-2 py-0.5 rounded-full text-[11px] font-medium capitalize nums"
                        style={
                          r.status === "active"
                            ? { background: "rgba(var(--ngo-rgb),.12)", color: "var(--color-ngo-2)" }
                            : r.status === "used"
                              ? { background: "var(--color-surface-2)", color: "var(--color-mute)" }
                              : { background: "rgba(var(--urgent-rgb),.12)", color: "var(--color-urgent)" }
                        }
                      >
                        {r.status || "active"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Toggle + Search bar ─────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* View toggle (Flow segmented) */}
        <div className="flex rounded-xl p-1" style={{ background: "var(--color-surface-2)" }}>
          <button
            onClick={() => { setView("all"); setSearch(""); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${view === "all" ? "bg-surface text-ink" : "text-mute hover:text-ink"}`}
            style={view === "all" ? { boxShadow: "var(--sh-sm)" } : undefined}
          >
            All Partners
          </button>
          <button
            onClick={() => { setView("nearme"); setSearch(""); }}
            disabled={!hasHome}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${view === "nearme" ? "bg-surface text-ink" : !hasHome ? "text-mute-2 cursor-not-allowed" : "text-mute hover:text-ink"}`}
            style={view === "nearme" ? { boxShadow: "var(--sh-sm)" } : undefined}
          >
            <Navigation className="w-3.5 h-3.5" />
            Near Me
          </button>
        </div>

        {/* Search — only in All mode */}
        {view === "all" && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant or city..."
              className="flow-input has-icon"
            />
          </div>
        )}

        {/* Near-me count */}
        {view === "nearme" && hasHome && (
          <span className="text-sm text-mute">
            {nearMePartners.length} partner{nearMePartners.length !== 1 ? "s" : ""} within 20 km
            <span className="mx-1 text-mute-2">·</span>
            <button onClick={() => setView("all")} className="font-medium hover:underline" style={{ color: "var(--color-ngo-2)" }}>
              Show all
            </button>
          </span>
        )}

        {view === "nearme" && !hasHome && (
          <span className="text-sm" style={{ color: "var(--color-donor-2)" }}>
            Set your home address in Profile to use Near Me
          </span>
        )}
      </div>

      {/* ── Partner grid ────────────────────────────────────── */}
      {displayPartners.length === 0 ? (
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei"><Utensils className="w-6 h-6" /></div>
          <div>
            <div className="et">
              {view === "nearme" ? "No partners near you" : search ? "No matching partners" : "No partner restaurants yet"}
            </div>
            <div className="ed">
              {view === "nearme"
                ? "Try switching to All Partners to browse all available restaurants."
                : search
                  ? "Try a different city or restaurant name."
                  : "Check back soon — new restaurants are joining all the time."}
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayPartners.map((p) => {
            const cost = p.pointsRequired || 0;
            const affordable = points >= cost;
            return (
              <div key={p._id} className="flow-tile p-5 flex flex-col" style={{ opacity: affordable ? 1 : 0.7 }}>
                <div className="flex items-start gap-3.5 mb-4">
                  <img src={p.logo || placeholderLogo} alt={p.name} className="w-14 h-14 rounded-xl object-cover shrink-0" style={{ border: "1px solid var(--color-line)" }} />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display font-bold text-ink truncate">{p.name}</h3>
                    <p className="text-xs text-mute truncate">{p.address}</p>
                    {p.description ? (
                      <p className="text-xs text-mute line-clamp-2 mt-1">{p.description}</p>
                    ) : (
                      <p className="text-xs text-mute-2 mt-1">Restaurant partner</p>
                    )}
                  </div>
                </div>

                {/* Distance badge (only in near-me view) */}
                {view === "nearme" && p.distanceKm != null && (
                  <div className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full mb-3 self-start nums" style={{ background: "rgba(var(--rider-rgb),.1)", color: "var(--color-rider-2)" }}>
                    <MapPin className="w-3 h-3" />
                    {p.distanceKm} km
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium nums" style={{ background: "rgba(var(--ngo-rgb),.12)", color: "var(--color-ngo-2)" }}>
                    <Tag className="w-3.5 h-3.5" />
                    {p.discountPercentage || 0}% off bill
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium nums" style={{ background: "var(--color-donor-soft)", color: "var(--color-donor-2)" }}>
                    <Award className="w-3.5 h-3.5" />
                    {cost} pts
                  </span>
                </div>

                <button
                  onClick={() => affordable && setSelected(p)}
                  disabled={!affordable}
                  className={affordable ? "fbtn fbtn-flow mt-auto w-full" : "fbtn fbtn-g mt-auto w-full"}
                >
                  {affordable ? "Redeem Discount" : `Need ${cost - points} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Confirmation modal ──────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-[var(--r-xl)] shadow-2xl max-w-md w-full p-6 relative" style={{ border: "1px solid var(--color-line)" }}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-mute hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 rounded-2xl mb-3" style={{ background: "var(--color-donor-soft)" }}>
                <Gift className="w-8 h-8" style={{ color: "var(--color-donor)" }} />
              </div>
              <h3 className="font-display text-xl font-bold text-ink">Redeem at {selected.name}?</h3>
              <p className="text-mute mt-1">
                You'll get <span className="font-semibold" style={{ color: "var(--color-ngo-2)" }}>{selected.discountPercentage || 0}% off your total bill</span>
              </p>
            </div>

            <div className="rounded-xl p-4 mb-6 space-y-2 text-sm bg-surface-2">
              <div className="flex justify-between">
                <span className="text-mute">Points required</span>
                <span className="font-semibold text-ink nums">{selected.pointsRequired || 0} pts</span>
              </div>
              <div className="flex justify-between">
                <span className="text-mute">Your balance</span>
                <span className="font-semibold text-ink nums">{points} pts</span>
              </div>
              <div className="flex justify-between border-t pt-2" style={{ borderColor: "var(--color-line)" }}>
                <span className="text-mute">After redeem</span>
                <span className="font-semibold text-ink nums">{points - (selected.pointsRequired || 0)} pts</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSelected(null)} disabled={redeeming} className="fbtn fbtn-g flex-1">
                Cancel
              </button>
              <button onClick={handleRedeem} disabled={redeeming} className="fbtn fbtn-flow flex-1">
                {redeeming ? "Redeeming…" : "Confirm Redeem"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ───────────────────────────────────── */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-surface rounded-[var(--r-xl)] shadow-2xl max-w-md w-full p-6 text-center relative" style={{ border: "1px solid var(--color-line)" }}>
            <button onClick={() => setSuccess(null)} className="absolute top-4 right-4 text-mute hover:text-ink cursor-pointer">
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex p-3 rounded-2xl mb-4" style={{ background: "rgba(var(--ngo-rgb),.12)" }}>
              <CheckCircle className="w-10 h-10" style={{ color: "var(--color-ngo)" }} />
            </div>
            <h3 className="font-display text-xl font-bold text-ink mb-1">Discount Unlocked!</h3>
            <p className="text-mute mb-5">
              Show this code at {success.partner} to claim your {success.discountPercentage}% discount.
            </p>

            <div className="rounded-xl py-4 mb-4" style={{ border: "2px dashed rgba(var(--donor-rgb),.4)", background: "var(--color-donor-soft)" }}>
              <div className="flex items-center justify-center gap-2 mb-1" style={{ color: "var(--color-donor-2)" }}>
                <Ticket className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">Booking Code</span>
              </div>
              <div className="text-2xl font-bold tracking-widest text-ink nums">{success.bookingCode}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-mute">Points used</p>
                <p className="font-semibold text-ink nums">{success.pointsUsed}</p>
              </div>
              <div className="rounded-xl p-3 bg-surface-2">
                <p className="text-mute">Remaining</p>
                <p className="font-semibold text-ink nums">{success.remainingPoints} pts</p>
              </div>
            </div>

            <p className="text-xs text-mute mb-5">
              {success.receiptSent
                ? "A receipt has been emailed to you and the restaurant."
                : "Email receipt skipped (not configured). Keep this code safe."}
            </p>

            <button onClick={() => setSuccess(null)} className="fbtn fbtn-flow w-full">
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemPoints;
