import React from "react";
import { MapPin, Clock, Navigation, Check, X } from "lucide-react";

// Compact donation card shared by the NGO (FoodRequests) and rider
// (AvailableDeliveries) accept/reject screens. Each screen passes only the
// stats relevant to its role via `meta`, so the card stays short and the two
// views can't drift apart.

// timeLeft is "H:M" (from getRemainingTime). Map to an urgency tier that
// drives the left accent bar + clock colour.
const urgencyTier = (timeLeft) => {
  if (!timeLeft || typeof timeLeft !== "string") return null;
  const h = Number(timeLeft.split(":")[0]);
  if (!Number.isFinite(h)) return null;
  if (h <= 2) return "urgent";
  if (h <= 10) return "soon";
  return "fresh";
};

const URGENCY = {
  urgent: { bar: "bg-red-500", text: "text-red-600" },
  soon: { bar: "bg-amber-500", text: "text-amber-600" },
  fresh: { bar: "bg-emerald-500", text: "text-emerald-600" },
};

// Donor-type pill colours. Note: model enum is "Store" (not "Grocery Store").
const toneFor = (badge) =>
  (
    {
      Restaurant: "bg-blue-100 text-blue-700",
      Event: "bg-purple-100 text-purple-700",
      Store: "bg-emerald-100 text-emerald-700",
      Individual: "bg-amber-100 text-amber-700",
    }
  )[badge] || "bg-gray-100 text-gray-600";

const MetaItem = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1 text-gray-700">
    {icon}
    <span>{text}</span>
  </span>
);

const DonationCard = ({
  title,
  badge,
  foodType,
  meta = [],
  timeLeft,
  pickup,
  destination,
  description,
  onAccept,
  onReject,
  acceptLabel = "Accept",
  rejectLabel = "Reject",
}) => {
  const tier = urgencyTier(timeLeft);
  const u = tier ? URGENCY[tier] : null;

  return (
    <div className="relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {u && (
        <div
          className={`absolute left-0 top-0 bottom-0 w-1.5 ${u.bar}`}
          aria-hidden="true"
        />
      )}
      <div className="p-5 pl-6">
        {/* Header: who + type, with time-left on the right */}
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-gray-900 truncate">
                {title}
              </h3>
              {badge && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${toneFor(
                    badge,
                  )}`}
                >
                  {badge}
                </span>
              )}
            </div>
            {foodType && (
              <p className="text-sm text-gray-600 mt-0.5">{foodType}</p>
            )}
          </div>
          {timeLeft && (
            <div
              className={`flex items-center gap-1 shrink-0 ${u?.text ?? "text-gray-500"}`}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-semibold">{timeLeft}</span>
            </div>
          )}
        </div>

        {/* Compact stat line — role-specific */}
        {meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
            {meta
              .filter(Boolean)
              .map((m, i) => (
                <MetaItem key={i} icon={m.icon} text={m.text} />
              ))}
          </div>
        )}

        {/* Locations */}
        {(pickup || destination) && (
          <div className="mt-3 space-y-1 text-sm">
            {pickup && (
              <p className="flex items-center gap-1.5 text-gray-600">
                <MapPin className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span className="truncate">{pickup}</span>
              </p>
            )}
            {destination && (
              <p className="flex items-center gap-1.5 text-gray-600">
                <Navigation className="w-3.5 h-3.5 text-green-600 shrink-0" />
                <span className="truncate">{destination}</span>
              </p>
            )}
          </div>
        )}

        {description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">
            {description}
          </p>
        )}

        {(onAccept || onReject) && (
          <div className="flex gap-2 mt-4">
            {onReject && (
              <button
                onClick={onReject}
                className="px-4 py-2 cursor-pointer rounded-xl text-sm font-semibold text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors inline-flex items-center gap-1.5"
              >
                <X className="w-4 h-4" />
                {rejectLabel}
              </button>
            )}
            {onAccept && (
              <button
                onClick={onAccept}
                className="flex-1 cursor-pointer py-2 rounded-xl text-sm font-semibold bg-red-500 text-white hover:bg-[#d63447] transition-colors inline-flex items-center justify-center gap-1.5 shadow-sm"
              >
                <Check className="w-4 h-4" />
                {acceptLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationCard;
