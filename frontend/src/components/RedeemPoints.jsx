import React, { useContext, useEffect, useState } from "react";
import { Gift, Award, Tag, CheckCircle, X, Utensils, Ticket, Flame } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const placeholderLogo =
  "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png";

const RedeemPoints = () => {
  const { backendurl, token } = useContext(AppContext);
  const [loading, setLoading] = useState(true);
  const [partners, setPartners] = useState([]);
  const [topPartners, setTopPartners] = useState([]);
  const [points, setPoints] = useState(0);
  const [selected, setSelected] = useState(null); // partner being confirmed
  const [redeeming, setRedeeming] = useState(false);
  const [success, setSuccess] = useState(null); // redemption result

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [listRes, rewardsRes, topRes] = await Promise.all([
          axios.get(`${backendurl}partner/list`),
          axios.get(`${backendurl}rider/rewards`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${backendurl}partner/top`),
        ]);
        if (listRes.data.success) {
          setPartners(listRes.data.data);
        }
        if (rewardsRes.data.success) {
          setPoints(rewardsRes.data.data.points || 0);
          console.log(rewardsRes.data.data);
        }
        if (topRes.data.success) {
          setTopPartners(topRes.data.data);
        }
      } catch (error) {
        toast.error("Error loading partners");
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [backendurl, token]);

  const handleRedeem = async () => {
    if (!selected) {
      return;
    }
    setRedeeming(true);
    try {
      const response = await axios.post(
        `${backendurl}rider/redeemPoints`,
        { partnerId: selected._id },
        { headers: { Authorization: `Bearer ${token}` } }
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

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
          <div className="h-4 w-64 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 animate-pulse bg-gray-100 h-56"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Redeem Points</h2>
        <p className="text-gray-600">
          Turn your delivery points into discounts at partner restaurants
        </p>
      </div>

      {/* Points balance */}
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

      {/* Top redeemed */}
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

      {/* Partner grid */}
      {partners.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Utensils className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No partner restaurants yet
          </h3>
          <p className="text-gray-500">
            Check back soon — new restaurants are joining all the time.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p) => {
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
                    <h3 className="font-bold text-gray-900 truncate">{p.name}</h3>
                    <h3 className="font-semibold text-sm pb-2 text-gray-500 truncate">{p.address}</h3>
                    {p.description ? (
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {p.description}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">Restaurant partner</p>
                    )}
                  </div>
                </div>

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

      {/* Confirmation modal */}
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
                <span className="font-semibold text-gray-900">{points} pts</span>
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

      {/* Success modal */}
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
