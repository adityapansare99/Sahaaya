import React from "react";
import { MapPin, Clock, Navigation, Check, X } from "lucide-react";

// Compact in-flow donation card shared by the NGO (FoodRequests) and rider
// (AvailableDeliveries) accept/reject screens. Each screen passes only the
// stats relevant to its role via `meta`, so the card stays short and the two
// views can't drift apart.
//
// Flow styling: surface card + role left-bar (`tone`), tabular figures,
// Flow status time-chip (urgency = the only red), `.fbtn` actions.

// timeLeft is "H:M" (from getRemainingTime). Map to an urgency tier that
// drives the time-chip colour. Urgency is the ONLY red in Flow.
const urgencyTier = (timeLeft) => {
  if (!timeLeft || typeof timeLeft !== "string") return null;
  const h = Number(timeLeft.split(":")[0]);
  if (!Number.isFinite(h)) return null;
  if (h <= 2) return "urgent";
  if (h <= 10) return "soon";
  return "fresh";
};

// Role → left-bar class (the donor→ngo→rider pipeline identity per card).
const ROLE_CLASS = {
  donor: "role-donor",
  rider: "role-rider",
  ngo: "role-ngo",
};

// Donor-type pill colours, Flow-tinted. Model enum is "Store" (not "Grocery Store").
const toneFor = (badge) =>
  (
    {
      Restaurant: "bg-rider-soft text-rider-2",
      Event: "bg-partner-soft text-partner-2",
      Store: "bg-ngo-soft text-ngo-2",
      Individual: "bg-donor-soft text-donor-2",
    }
  )[badge] || "bg-surface-2 text-mute";

// Urgency time-chip styling. Urgent is the ONLY red.
const URGENCY_CHIP = {
  urgent: { bg: "rgba(var(--urgent-rgb),.12)", fg: "var(--color-urgent)", dot: "var(--color-urgent)" },
  soon: { bg: "rgba(var(--donor-rgb),.12)", fg: "var(--color-donor-2)", dot: "var(--color-donor)" },
  fresh: { bg: "rgba(var(--ngo-rgb),.12)", fg: "var(--color-ngo-2)", dot: "var(--color-ngo)" },
};

const MetaItem = ({ icon, text }) => (
  <span className="inline-flex items-center gap-1 text-ink-3">
    {icon}
    <span className="nums">{text}</span>
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
  tone = "donor",
}) => {
  const tier = urgencyTier(timeLeft);
  const uc = tier ? URGENCY_CHIP[tier] : null;

  return (
    <div className={`flow-card ${ROLE_CLASS[tone] || "role-donor"} p-5 pl-6`}>
      {/* Header: who + type, with time-left chip on the right */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-display text-base font-bold text-ink truncate">
              {title}
            </h3>
            {badge && (
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${toneFor(
                  badge,
                )}`}
              >
                {badge}
              </span>
            )}
          </div>
          {foodType && (
            <p className="text-sm text-mute mt-0.5">{foodType}</p>
          )}
        </div>
        {timeLeft && (
          <span
            className="inline-flex items-center gap-1.5 shrink-0 font-display text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full nums"
            style={{
              background: uc ? uc.bg : "var(--color-surface-2)",
              color: uc ? uc.fg : "var(--color-mute)",
            }}
          >
            <Clock className="w-3 h-3" />
            {timeLeft}
          </span>
        )}
      </div>

      {/* Compact stat line — role-specific */}
      {meta.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-sm">
          {meta
            .filter(Boolean)
            .map((m, i) => (
              <MetaItem key={i} icon={m.icon} text={m.text} />
            ))}
        </div>
      )}

      {/* Locations — micro pickup → destination route */}
      {(pickup || destination) && (
        <div className="mt-3 text-sm">
          {pickup && (
            <p className="flex items-center gap-1.5 text-ink-2">
              <MapPin className="w-3.5 h-3.5 text-donor shrink-0" />
              <span className="truncate">{pickup}</span>
            </p>
          )}
          {destination && (
            <p className="flex items-center gap-1.5 text-ink-2 mt-1">
              <Navigation className="w-3.5 h-3.5 text-ngo shrink-0" />
              <span className="truncate">{destination}</span>
            </p>
          )}
        </div>
      )}

      {description && (
        <p className="text-sm text-mute mt-2 line-clamp-2">
          {description}
        </p>
      )}

      {(onAccept || onReject) && (
        <div className="flex gap-2 mt-4">
          {onReject && (
            <button
              onClick={onReject}
              className="fbtn fbtn-g fbtn-sm"
            >
              <X className="w-4 h-4" />
              {rejectLabel}
            </button>
          )}
          {onAccept && (
            <button
              onClick={onAccept}
              className="fbtn fbtn-flow fbtn-sm flex-1"
            >
              <Check className="w-4 h-4" />
              {acceptLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default DonationCard;
