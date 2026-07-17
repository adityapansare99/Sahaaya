import React from "react";
import {
  Ticket,
  Users,
  Award,
  Tag,
  TrendingUp,
  Receipt,
} from "lucide-react";

const PartnerOverview = ({ profile, redemptions }) => {
  const totalRedemptions = redemptions.length;
  const ridersServed = new Set(
    redemptions.map((r) => r.rider?._id).filter(Boolean)
  ).size;
  const pointsRedeemed = redemptions.reduce(
    (sum, r) => sum + (r.pointsUsed || 0),
    0
  );

  const stats = [
    {
      label: "Total Redemptions",
      value: totalRedemptions,
      icon: Ticket,
      tint: "bg-blue-100 text-blue-600",
      sub: "Discounts claimed at your restaurant",
    },
    {
      label: "Riders Served",
      value: ridersServed,
      icon: Users,
      tint: "bg-purple-100 text-purple-600",
      sub: "Unique riders who redeemed",
    },
    {
      label: "Points Redeemed",
      value: pointsRedeemed.toLocaleString(),
      icon: Award,
      tint: "bg-amber-100 text-amber-600",
      sub: "Total rider points spent here",
    },
    {
      label: "Your Offer",
      value: `${profile?.discountPercentage ?? 0}% off`,
      icon: Tag,
      tint: "bg-green-100 text-green-600",
      sub: `${profile?.pointsRequired ?? 0} points per redemption`,
    },
  ];

  const recent = redemptions.slice(0, 5);

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Overview</h2>
        <p className="text-gray-600">
          How riders are redeeming points at your restaurant
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
            >
              <div className={`p-3 rounded-2xl w-fit mb-4 ${card.tint}`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {card.value}
              </div>
              <p className="text-sm font-medium text-gray-700">{card.label}</p>
              <p className="text-xs text-gray-500 mt-1">{card.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Recent redemptions */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-800">
            Recent Redemptions
          </h3>
        </div>

        {recent.length === 0 ? (
          <div className="text-center py-10">
            <Receipt className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No redemptions yet. They'll appear here once riders start
              redeeming.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recent.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold">
                    {(r.rider?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">
                      {r.rider?.name || "Unknown rider"}
                    </h4>
                    <p className="text-gray-500 text-sm">
                      {new Date(r.createdAt).toLocaleDateString()} ·{" "}
                      <span className="font-mono">{r.bookingCode}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {r.pointsUsed} pts
                  </p>
                  <p className="text-green-600 text-sm font-medium">
                    {r.discountPercentage}% off
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerOverview;
