import React from "react";
import { Ticket, Receipt } from "lucide-react";

const statusStyles = {
  active: "bg-green-50 text-green-700",
  used: "bg-gray-100 text-gray-600",
  expired: "bg-red-50 text-red-600",
};

const PartnerRedemptions = ({ redemptions }) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Redemptions</h2>
        <p className="text-gray-600">
          Every rider who has redeemed points at your restaurant
        </p>
      </div>

      {redemptions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-100">
          <Receipt className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No redemptions yet
          </h3>
          <p className="text-gray-500">
            When riders redeem points for a discount here, their bookings will
            show up in this list.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Table header (desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
            <div className="col-span-3">Rider</div>
            <div className="col-span-3">Contact</div>
            <div className="col-span-2">Booking Code</div>
            <div className="col-span-1">Points</div>
            <div className="col-span-1">Discount</div>
            <div className="col-span-2">Date / Status</div>
          </div>

          <div className="divide-y divide-gray-100">
            {redemptions.map((r) => (
              <div
                key={r._id}
                className="md:grid md:grid-cols-12 md:gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors"
              >
                {/* Rider */}
                <div className="col-span-3 flex items-center gap-3 mb-2 md:mb-0">
                  <div className="w-9 h-9 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-semibold text-sm">
                    {(r.rider?.name || "?").charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-gray-900">
                    {r.rider?.name || "Unknown rider"}
                  </span>
                </div>

                {/* Contact */}
                <div className="col-span-3 text-sm text-gray-600 mb-1 md:mb-0">
                  <p>{r.rider?.email || "—"}</p>
                  <p className="text-gray-400">{r.rider?.phone || ""}</p>
                </div>

                {/* Booking code */}
                <div className="col-span-2 mb-1 md:mb-0">
                  <span className="inline-flex items-center gap-1 font-mono text-sm text-gray-800 bg-gray-100 px-2 py-1 rounded">
                    <Ticket className="w-3.5 h-3.5 text-gray-400" />
                    {r.bookingCode}
                  </span>
                </div>

                {/* Points */}
                <div className="col-span-1 font-semibold text-gray-900 mb-1 md:mb-0">
                  {r.pointsUsed}
                </div>

                {/* Discount */}
                <div className="col-span-1 text-green-600 font-medium mb-1 md:mb-0">
                  {r.discountPercentage}%
                </div>

                {/* Date / status */}
                <div className="col-span-2 flex flex-col gap-1">
                  <span className="text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </span>
                  <span
                    className={`inline-block w-fit text-xs px-2 py-0.5 rounded-full font-medium ${
                      statusStyles[r.status] || statusStyles.active
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnerRedemptions;
