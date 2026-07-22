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
  Calendar,
  MapPin,
  Search,
  Navigation,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import { haversineDistance } from "../utils/haversine";

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
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2" />
          <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="rounded-2xl p-6 animate-pulse bg-gray-100 h-56" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Redeem Points
        </h2>
        <p className="text-gray-600">
          Turn your delivery points into discounts at partner restaurants
        </p>
      </div>

      {/* ── Points balance ─────────────────────────────────── */}
      <div className="bg-gradient-to-br from-amber-500 via-orange-500 to-red-500 rounded-2xl p-6 md:p-8 text-white mb-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-amber-100 text-sm font-medium mb-1">
              Available Points
            </p>
            <div className="text-4xl md:text-5xl font-bold mb-2">
              {points.toLocaleString()}
            </div>
            <p className="text-amber-100 text-sm">
              Redeem at any restaurant below
            </p>
          </div>
          <div className="bg-white/20 rounded-2xl p-4">
            <Gift className="w-8 h-8" />
          </div>
        </div>
      </div>

      {/* ── Top redeemed ───────────────────────────────────── */}
      {topPartners.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Top Redeemed
            </h3>
            <span className="text-sm text-gray-400">
              Where riders redeem most
            </span>
          </div>

          <div className="space-y-3">
            {topPartners.map((p, idx) => {
              const cost = p.pointsRequired || 0;
              const affordable = points >= cost;
              return (
                <div
                  key={p._id}
                  className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100"
                >
                  <div
                    className={`w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-bold text-sm ${
                      idx === 0
                        ? "bg-amber-100 text-amber-600"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <img
                    src={p.logo || placeholderLogo}
                    alt={p.name}
                    className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {p.name}
                      </h4>
                      <span className="text-sm text-gray-400 whitespace-nowrap">
                        · {p.address}
                      </span>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        · {p.redemptionCount} redeemed
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-medium">
                        {p.discountPercentage}% off
                      </span>
                      <span className="text-xs bg-amber-50 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                        {cost} pts
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => affordable && setSelected(p)}
                    disabled={!affordable}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                      affordable
                        ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                        : "bg-gray-100 text-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {affordable ? "Redeem" : `${cost - points} pts`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Redemption History ──────────────────────────────── */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <History className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Redemptions
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Restaurant
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Discount
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Points
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Code
                  </th>
                  <th className="text-left p-3 font-semibold text-gray-900">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr
                    key={r._id}
                    className="border-b border-gray-50 hover:bg-gray-50"
                  >
                    <td className="p-3 text-gray-500 whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="p-3 font-medium text-gray-900">
                      {r.partner?.name || "—"}
                    </td>
                    <td className="p-3 text-gray-600">
                      {r.partner?.address || "—"}
                    </td>
                    <td className="p-3 text-green-600 font-medium">
                      {r.discountPercentage}%
                    </td>
                    <td className="p-3 text-gray-900">{r.pointsUsed}</td>
                    <td className="p-3 font-mono text-xs text-gray-700">
                      {r.bookingCode}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          r.status === "active"
                            ? "bg-green-100 text-green-700"
                            : r.status === "used"
                              ? "bg-gray-100 text-gray-600"
                              : "bg-red-100 text-red-600"
                        }`}
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        {/* View toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => {
              setView("all");
              setSearch("");
            }}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
              view === "all"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            All Partners
          </button>
          <button
            onClick={() => {
              setView("nearme");
              setSearch("");
            }}
            disabled={!hasHome}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
              view === "nearme"
                ? "bg-white text-gray-900 shadow-sm"
                : !hasHome
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Navigation className="w-3.5 h-3.5" />
            Near Me
          </button>
        </div>

        {/* Search — only in All mode */}
        {view === "all" && (
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by restaurant or city..."
              className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        )}

        {/* Near-me count */}
        {view === "nearme" && hasHome && (
          <span className="text-sm text-gray-500">
            {nearMePartners.length} partner
            {nearMePartners.length !== 1 ? "s" : ""} within 20 km
            <span className="text-gray-300 mx-1">·</span>
            <button
              onClick={() => setView("all")}
              className="text-red-500 hover:text-red-600 font-medium cursor-pointer"
            >
              Show all
            </button>
          </span>
        )}

        {view === "nearme" && !hasHome && (
          <span className="text-sm text-amber-600">
            Set your home address in Profile to use Near Me
          </span>
        )}
      </div>

      {/* ── Partner grid ───────────────────────────────────── */}
      {displayPartners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {view === "nearme"
              ? "No partners near you"
              : search
                ? "No matching partners"
                : "No partner restaurants yet"}
          </h3>
          <p className="text-gray-500">
            {view === "nearme"
              ? "Try switching to All Partners to browse all available restaurants."
              : search
                ? "Try a different city or restaurant name."
                : "Check back soon — new restaurants are joining all the time."}
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayPartners.map((p) => {
            const cost = p.pointsRequired || 0;
            const affordable = points >= cost;
            return (
              <div
                key={p._id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col transition-all ${
                  affordable
                    ? "hover:shadow-md hover:-translate-y-0.5"
                    : "opacity-70"
                }`}
              >
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={p.logo || placeholderLogo}
                    alt={p.name}
                    className="w-16 h-16 rounded-2xl object-cover border border-gray-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 truncate">
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500 truncate">
                      {p.address}
                    </p>
                    {p.description ? (
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {p.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400 mt-1">
                        Restaurant partner
                      </p>
                    )}
                  </div>
                </div>

                {/* Distance badge (only in near-me view) */}
                {view === "nearme" && p.distanceKm != null && (
                  <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-3 self-start">
                    <MapPin className="w-3 h-3" />
                    {p.distanceKm} km
                  </div>
                )}

                <div className="flex items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Tag className="w-3.5 h-3.5" />
                    {p.discountPercentage || 0}% off bill
                  </span>
                  <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-sm font-medium">
                    <Award className="w-3.5 h-3.5" />
                    {cost} pts
                  </span>
                </div>

                <button
                  onClick={() => affordable && setSelected(p)}
                  disabled={!affordable}
                  className={`mt-auto w-full py-3 rounded-xl font-medium transition-colors cursor-pointer ${
                    affordable
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {affordable
                    ? "Redeem Discount"
                    : `Need ${cost - points} more pts`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Confirmation modal ──────────────────────────────── */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="inline-flex p-3 bg-amber-50 rounded-2xl mb-3">
                <Gift className="w-8 h-8 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Redeem at {selected.name}?
              </h3>
              <p className="text-gray-600 mt-1">
                You'll get{" "}
                <span className="font-semibold text-green-600">
                  {selected.discountPercentage || 0}% off your total bill
                </span>
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Points required</span>
                <span className="font-semibold text-gray-900">
                  {selected.pointsRequired || 0} pts
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Your balance</span>
                <span className="font-semibold text-gray-900">
                  {points} pts
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-2">
                <span className="text-gray-500">After redeem</span>
                <span className="font-semibold text-gray-900">
                  {points - (selected.pointsRequired || 0)} pts
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setSelected(null)}
                disabled={redeeming}
                className="flex-1 py-3 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-1 py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer disabled:opacity-60"
              >
                {redeeming ? "Redeeming…" : "Confirm Redeem"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success modal ───────────────────────────────────── */}
      {success && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center relative">
            <button
              onClick={() => setSuccess(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex p-3 bg-green-50 rounded-2xl mb-4">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Discount Unlocked!
            </h3>
            <p className="text-gray-600 mb-5">
              Show this code at {success.partner} to claim your{" "}
              {success.discountPercentage}% discount.
            </p>

            <div className="border-2 border-dashed border-amber-300 bg-amber-50 rounded-xl py-4 mb-4">
              <div className="flex items-center justify-center gap-2 text-amber-700 mb-1">
                <Ticket className="w-4 h-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Booking Code
                </span>
              </div>
              <div className="text-2xl font-bold tracking-widest text-gray-900">
                {success.bookingCode}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm mb-5">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500">Points used</p>
                <p className="font-semibold text-gray-900">
                  {success.pointsUsed}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-gray-500">Remaining</p>
                <p className="font-semibold text-gray-900">
                  {success.remainingPoints} pts
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-500 mb-5">
              {success.receiptSent
                ? "A receipt has been emailed to you and the restaurant."
                : "Email receipt skipped (not configured). Keep this code safe."}
            </p>

            <button
              onClick={() => setSuccess(null)}
              className="w-full py-3 rounded-xl font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemPoints;
