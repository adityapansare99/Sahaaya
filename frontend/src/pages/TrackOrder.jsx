import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import loadGoogleMaps from "../utils/loadGoogleMaps";
import {
  ArrowLeft,
  Bike,
  Clock,
  Loader2,
  MapPin,
  Navigation,
  AlertCircle,
} from "lucide-react";

const DASH_BY_ROLE = {
  donor: "/DonorDashboard",
  ngo: "/NgoDashboard",
  delivery: "/RiderDashboard",
};

const INDIA = { lat: 20.5937, lng: 78.9629 };

const TrackOrder = () => {
  const { rideId } = useParams();
  const navigate = useNavigate();
  const { backendurl, token } = useContext(AppContext);
  const { socket } = useContext(SocketContext);

  const [snap, setSnap] = useState(null);
  const [status, setStatus] = useState(null);
  const [rider, setRider] = useState(null);
  const [eta, setEta] = useState(null);
  const [routeFailed, setRouteFailed] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(true);

  const mapDivRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({ pickup: null, dest: null, rider: null });
  const directionsRef = useRef(null);
  const animRef = useRef(null);

  // ── 1. Initial snapshot (last-known positions + status) ───────────────
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axios.get(`${backendurl}track/${rideId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!alive) return;
        if (data.success) {
          setSnap(data.data);
          setStatus(data.data.status);
          if (data.data.rider && data.data.rider.lat != null)
            setRider(data.data.rider);
        } else {
          setLoadError(data.message || "Could not load this delivery");
        }
      } catch (e) {
        if (alive)
          setLoadError(
            e?.response?.data?.message || "Could not load this delivery",
          );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [backendurl, token, rideId]);

  // ── 2. Socket: join the ride room, listen for movement + status ───────
  useEffect(() => {
    if (!socket || !rideId) return;
    socket.emit("joinRide", { rideId });

    const onLoc = (d) => {
      if (d && String(d.rideId) === String(rideId)) {
        setRider({
          lat: d.latitude,
          lng: d.longitude,
          lastActiveAt: d.lastActiveAt,
        });
      }
    };
    const onStatus = (d) => {
      if (d && String(d.ride?._id) === String(rideId)) setStatus(d.status);
    };
    socket.on("riderLocation", onLoc);
    socket.on("statusUpdate", onStatus);

    return () => {
      socket.off("riderLocation", onLoc);
      socket.off("statusUpdate", onStatus);
      socket.emit("leaveRide", { rideId });
    };
  }, [socket, rideId]);

  // ── 3. Rider self-drive: when the rider views this page, this (foreground)
  //       tab is the source of movement. 8s live emit + ~32s DB persistence. ─
  useEffect(() => {
    if (!snap?.viewerIsRider || !snap?.riderId || !socket) return;

    const joinAsRider = () =>
      socket.emit("join", { userId: snap.riderId, userType: "delivery" });
    if (socket.connected) joinAsRider();
    socket.on("connect", joinAsRider);

    const getPosition = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          () => resolve(null),
          { enableHighAccuracy: true, timeout: 10000 },
        );
      });

    let tick = 0;
    const step = async () => {
      const c = await getPosition();
      if (!c) return;
      socket.emit("updateRiderLocation", {
        latitude: c.latitude,
        longitude: c.longitude,
      });
      if (tick % 4 === 0) {
        try {
          await axios.put(
            `${backendurl}rider/updateLocation`,
            { latitude: c.latitude, longitude: c.longitude },
            { headers: { Authorization: `Bearer ${token}` } },
          );
        } catch {
          /* persistence best-effort */
        }
      }
      tick++;
    };

    step();
    const id = setInterval(step, 8000);
    return () => {
      clearInterval(id);
      socket.off("connect", joinAsRider);
    };
  }, [snap, socket, backendurl, token]);

  const fitToBounds = useCallback(() => {
    const map = mapRef.current;
    if (!map || !window.google?.maps) return;
    const bounds = new window.google.maps.LatLngBounds();
    let added = false;
    Object.values(markersRef.current).forEach((m) => {
      if (m) {
        bounds.extend(m.getPosition());
        added = true;
      }
    });
    if (added) map.fitBounds(bounds, 80);
  }, []);

  // ── 4. Init map + static markers + driving route (once) ───────────────
  useEffect(() => {
    if (!snap || mapReady) return;
    let cancelled = false;

    loadGoogleMaps()
      .then(() => {
        if (cancelled || mapRef.current || !mapDivRef.current) return;
        const g = window.google.maps;

        const center =
          (snap.rider?.lat != null && {
            lat: snap.rider.lat,
            lng: snap.rider.lng,
          }) ||
          (snap.pickup?.lat != null && {
            lat: snap.pickup.lat,
            lng: snap.pickup.lng,
          }) ||
          (snap.destination?.lat != null && {
            lat: snap.destination.lat,
            lng: snap.destination.lng,
          }) ||
          INDIA;

        mapRef.current = new g.Map(mapDivRef.current, {
          zoom: 13,
          center,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });

        if (snap.pickup?.lat != null && snap.pickup?.lng != null) {
          markersRef.current.pickup = new g.Marker({
            position: { lat: snap.pickup.lat, lng: snap.pickup.lng },
            map: mapRef.current,
            label: { text: "A", color: "#fff", fontSize: "11px" },
            title: snap.pickup.label,
          });
        }
        if (snap.destination?.lat != null && snap.destination?.lng != null) {
          markersRef.current.dest = new g.Marker({
            position: {
              lat: snap.destination.lat,
              lng: snap.destination.lng,
            },
            map: mapRef.current,
            label: { text: "B", color: "#fff", fontSize: "11px" },
            title: snap.destination.label,
          });
        }

        // Driving route + ETA (billable Directions call, one per page open).
        if (snap.pickup?.lat != null && snap.destination?.lat != null) {
          directionsRef.current = new g.DirectionsRenderer({
            suppressMarkers: true,
          });
          directionsRef.current.setMap(mapRef.current);
          new g.DirectionsService().route(
            {
              origin: { lat: snap.pickup.lat, lng: snap.pickup.lng },
              destination: {
                lat: snap.destination.lat,
                lng: snap.destination.lng,
              },
              travelMode: g.TravelMode.DRIVING,
            },
            (result, st) => {
              if (st === "OK" && directionsRef.current) {
                directionsRef.current.setDirections(result);
                const leg = result.routes?.[0]?.legs?.[0];
                if (leg?.duration?.text) setEta(leg.duration.text);
              } else {
                setRouteFailed(true); // markers-only fallback
              }
            },
          );
        }

        setMapReady(true);
        fitToBounds();
      })
      .catch(() => setLoadError("Google Maps failed to load"));

    return () => {
      cancelled = true;
    };
  }, [snap, mapReady, fitToBounds]);

  // ── 5. Rider marker: create on first position, then animate (smoothing) ─
  useEffect(() => {
    if (!mapReady || !rider || rider.lat == null) return;
    const g = window.google.maps;
    const marker = markersRef.current.rider;
    const target = { lat: rider.lat, lng: rider.lng };

    if (!marker) {
      markersRef.current.rider = new g.Marker({
        position: target,
        map: mapRef.current,
        title: "Rider",
        icon: {
          path: g.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: "#ef4444",
          fillOpacity: 1,
          strokeColor: "#fff",
          strokeWeight: 2,
        },
      });
      fitToBounds();
      return;
    }

    // Ease the marker from its current spot to the new one (~7.5s) so the
    // discrete 8s samples read as continuous motion.
    const start = marker.getPosition();
    const sLat = start.lat();
    const sLng = start.lng();
    const duration = 7500;
    const t0 = performance.now();
    if (animRef.current) cancelAnimationFrame(animRef.current);
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = p * (2 - p); // easeOutQuad
      marker.setPosition({
        lat: sLat + (target.lat - sLat) * e,
        lng: sLng + (target.lng - sLng) * e,
      });
      if (p < 1) animRef.current = requestAnimationFrame(frame);
    };
    animRef.current = requestAnimationFrame(frame);
  }, [mapReady, rider, fitToBounds]);

  // ── 6. Tear down map resources on unmount ─────────────────────────────
  // markersRef.current is never reassigned (only its properties are mutated),
  // so capturing it once here is safe and keeps cleanup correct.
  useEffect(() => {
    const markers = markersRef.current;
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
      Object.values(markers).forEach((m) => m && m.setMap && m.setMap(null));
      if (directionsRef.current) directionsRef.current.setMap(null);
      mapRef.current = null;
    };
  }, []);

  const delivered = status === "completed";

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <button
            onClick={() => navigate(DASH_BY_ROLE[snap?.viewerRole] || "/")}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <div className="flex items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                delivered
                  ? "bg-green-100 text-green-700"
                  : status === "picked up"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
              }`}
            >
              {delivered ? "Delivered" : status || "Live"}
            </span>
            {eta && !routeFailed && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded-full">
                <Clock className="w-3.5 h-3.5" /> {eta}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-[70vh] text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : loadError ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-gray-100">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-3" />
            <p className="text-gray-700 font-medium">{loadError}</p>
          </div>
        ) : (
          <>
            <div
              ref={mapDivRef}
              className="w-full h-[70vh] rounded-2xl border border-gray-200 overflow-hidden bg-gray-100"
            />
            <div className="grid sm:grid-cols-3 gap-3 mt-4">
              <InfoCard
                icon={<MapPin className="w-4 h-4 text-blue-500" />}
                label="Pickup"
                value={snap?.pickup?.label}
              />
              <InfoCard
                icon={<Navigation className="w-4 h-4 text-green-600" />}
                label="Drop-off"
                value={snap?.destination?.label}
              />
              <InfoCard
                icon={<Bike className="w-4 h-4 text-red-500" />}
                label="Rider"
                value={
                  rider
                    ? snap?.rider?.name || "On the way"
                    : "Waiting for rider's GPS…"
                }
              />
            </div>
            {delivered && (
              <div className="mt-4 bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 text-sm font-medium">
                🎉 This delivery has been completed.
              </div>
            )}
            {routeFailed && !delivered && (
              <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm">
                Route details unavailable — showing pickup, drop-off, and rider
                position.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => (
  <div className="bg-white rounded-xl border border-gray-100 p-3">
    <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
      {icon}
      {label}
    </div>
    <p className="text-sm text-gray-800 line-clamp-2">{value || "—"}</p>
  </div>
);

export default TrackOrder;
