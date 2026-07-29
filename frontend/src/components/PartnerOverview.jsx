import React from "react";
import { Ticket, Users, Award, Tag, TrendingUp, Receipt } from "lucide-react";

// Role-tinted stat tile (Flow).
const TINT = {
  partner: { bg: "var(--color-partner-soft)", fg: "var(--color-partner-2)" },
  rider: { bg: "var(--color-rider-soft)", fg: "var(--color-rider-2)" },
  donor: { bg: "var(--color-donor-soft)", fg: "var(--color-donor-2)" },
  ngo: { bg: "var(--color-ngo-soft)", fg: "var(--color-ngo-2)" },
};

const StatTile = ({ icon: Icon, tint, value, label, sub }) => {
  const t = TINT[tint];
  return (
    <div className="flow-tile p-5">
      <div
        className="inline-grid place-items-center w-10 h-10 rounded-xl mb-3"
        style={{ background: t.bg, color: t.fg }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <div className="font-display text-3xl font-bold text-ink nums">{value}</div>
      <div className="text-sm font-semibold text-ink-2 mt-0.5">{label}</div>
      {sub && <div className="text-xs text-mute mt-1">{sub}</div>}
    </div>
  );
};

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
      tint: "partner",
      sub: "Discounts claimed at your restaurant",
    },
    {
      label: "Riders Served",
      value: ridersServed,
      icon: Users,
      tint: "rider",
      sub: "Unique riders who redeemed",
    },
    {
      label: "Points Redeemed",
      value: pointsRedeemed.toLocaleString(),
      icon: Award,
      tint: "donor",
      sub: "Total rider points spent here",
    },
    {
      label: "Your Offer",
      value: `${profile?.discountPercentage ?? 0}% off`,
      icon: Tag,
      tint: "ngo",
      sub: `${profile?.pointsRequired ?? 0} points per redemption`,
    },
  ];

  const recent = redemptions.slice(0, 5);

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Overview</h2>
        <p className="text-mute">How riders are redeeming points at your restaurant</p>
      </div>

      {/* Stat tiles */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {stats.map((card) => {
          const Icon = card.icon;
          return (
            <StatTile
              key={card.label}
              icon={Icon}
              tint={card.tint}
              value={card.value}
              label={card.label}
              sub={card.sub}
            />
          );
        })}
      </div>

      {/* Recent redemptions */}
      <div className="flow-panel p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="w-4 h-4 text-mute" />
          <h3 className="font-display text-base font-semibold text-ink">Recent Redemptions</h3>
        </div>

        {recent.length === 0 ? (
          <div className="flow-empty flex-col items-center text-center py-10">
            <div className="ei"><Receipt className="w-6 h-6" /></div>
            <div>
              <div className="et">No redemptions yet</div>
              <div className="ed">They'll appear here once riders start redeeming.</div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {recent.map((r) => (
              <div
                key={r._id}
                className="flex items-center justify-between p-4 rounded-xl bg-surface-2"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 nums"
                    style={{ background: "var(--color-partner-soft)", color: "var(--color-partner-2)" }}
                  >
                    {(r.rider?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-semibold text-ink truncate">
                      {r.rider?.name || "Unknown rider"}
                    </h4>
                    <p className="text-mute text-xs mt-0.5">
                      {new Date(r.createdAt).toLocaleDateString()} ·{" "}
                      <span className="font-display text-ink-2 nums tracking-wide">{r.bookingCode}</span>
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <p className="font-display font-bold text-ink nums">{r.pointsUsed} pts</p>
                  <p className="text-xs font-medium nums" style={{ color: "var(--color-ngo-2)" }}>
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
