import React from "react";
import { Ticket, Receipt } from "lucide-react";

const statusStyles = {
  active: { bg: "rgba(var(--ngo-rgb),.12)", fg: "var(--color-ngo-2)" },
  used: { bg: "var(--color-surface-2)", fg: "var(--color-mute)" },
  expired: { bg: "rgba(var(--urgent-rgb),.12)", fg: "var(--color-urgent)" },
};

const PartnerRedemptions = ({ redemptions }) => {
  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Redemptions</h2>
        <p className="text-mute">Every rider who has redeemed points at your restaurant</p>
      </div>

      {redemptions.length === 0 ? (
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei"><Receipt className="w-6 h-6" /></div>
          <div>
            <div className="et">No redemptions yet</div>
            <div className="ed">When riders redeem points for a discount here, their bookings will show up in this list.</div>
          </div>
        </div>
      ) : (
        <div className="flow-panel overflow-hidden">
          {/* Table header (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-surface-2 border-b border-line text-[11px] font-display font-bold uppercase tracking-wider text-mute-2">
            <div className="col-span-3">Rider</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Booking Code</div>
            <div className="col-span-1">Points</div>
            <div className="col-span-1">Discount</div>
            <div className="col-span-2">Date / Status</div>
          </div>

          <div className="divide-y divide-line-2">
            {redemptions.map((r) => {
              const s = statusStyles[r.status] || statusStyles.active;
              return (
                <div
                  key={r._id}
                  className="md:grid md:grid-cols-12 md:gap-4 px-6 py-4 items-center hover:bg-surface-2 transition-colors"
                >
                  {/* Rider */}
                  <div className="col-span-3 flex items-center gap-3 mb-2 md:mb-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm shrink-0 nums"
                      style={{ background: "var(--color-partner-soft)", color: "var(--color-partner-2)" }}
                    >
                      {(r.rider?.name || "?").charAt(0).toUpperCase()}
                    </div>
                    <span className="font-medium text-ink truncate">
                      {r.rider?.name || "Unknown rider"}
                    </span>
                  </div>

                  {/* Contact */}
                  <div className="col-span-3 text-sm text-ink-2 mb-1 md:mb-0">
                    <p>{r.rider?.email || "—"}</p>
                    <p className="text-mute">{r.rider?.phone || ""}</p>
                  </div>

                  {/* Booking code */}
                  <div className="col-span-2 mb-1 md:mb-0">
                    <span
                      className="inline-flex items-center gap-1 font-mono text-sm text-ink-2 px-2 py-1 rounded nums"
                      style={{ background: "var(--color-surface-2)" }}
                    >
                      <Ticket className="w-3.5 h-3.5 text-mute" />
                      {r.bookingCode}
                    </span>
                  </div>

                  {/* Points */}
                  <div className="col-span-1 font-semibold text-ink nums mb-1 md:mb-0">
                    {r.pointsUsed}
                  </div>

                  {/* Discount */}
                  <div className="col-span-1 font-medium nums mb-1 md:mb-0" style={{ color: "var(--color-ngo-2)" }}>
                    {r.discountPercentage}%
                  </div>

                  {/* Date / Status */}
                  <div className="col-span-2 flex flex-col gap-1">
                    <span className="text-sm text-mute nums">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                    <span
                      className="inline-block w-fit text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize nums"
                      style={{ background: s.bg, color: s.fg }}
                    >
                      {r.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerRedemptions;
