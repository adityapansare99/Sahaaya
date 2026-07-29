import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Phone,
  CheckCircle2,
  Truck,
} from "lucide-react";

// Flow accent per status. The whole active ride is "transport" (rider-teal);
// completion flips to NGO-emerald (destination reached / success).
const STATUS_CONFIG = {
  accepted: {
    title: "Delivery Accepted",
    subtitle: "Head to pickup location",
    buttonText: "Mark as Picked Up",
    accent: "donor",
  },
  "picked up": {
    title: "Food Picked Up",
    subtitle: "Delivering to NGO",
    buttonText: "Mark as Delivered",
    accent: "rider",
  },
  completed: {
    title: "Delivery Complete",
    subtitle: "Great job! 🎉",
    buttonText: "Find New Delivery",
    accent: "ngo",
  },
};

// accent → Flow tints. The active ride walks the pipeline:
// accepted = donor-amber (origin) → picked up = rider-teal (transport) →
// completed = ngo-emerald (destination).
const ACCENT = {
  donor: { bg: "rgba(var(--donor-rgb),.08)", fg: "var(--color-donor-2)" },
  rider: { bg: "rgba(var(--rider-rgb),.08)", fg: "var(--color-rider-2)" },
  ngo: { bg: "rgba(var(--ngo-rgb),.08)", fg: "var(--color-ngo-2)" },
};

const ActiveDelivery = ({
  setActiveSection,
  activeOrder,
  handlepickup,
  handlecomplete,
}) => {
  const navigate = useNavigate();
  const [loadingId, setLoadingId] = useState(null);

  const handleStatusUpdate = async (order) => {
    setLoadingId(order._id);
    try {
      if (order.status === "accepted") {
        await handlepickup(order._id);
      } else if (order.status === "picked up") {
        await handlecomplete(order._id);
      }
    } finally {
      setLoadingId(null);
    }
  };

  if (!activeOrder || activeOrder.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Active Delivery</h2>
          <p className="text-mute">Your current delivery status</p>
        </div>

        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <div className="et">No active delivery</div>
            <div className="ed">Ready to accept a new delivery?</div>
          </div>
          <button onClick={() => setActiveSection("deliveries")} className="fbtn fbtn-flow fbtn-sm mt-4">
            Browse Available Deliveries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Active Delivery</h2>
        <p className="text-mute">Your current delivery status</p>
      </div>

      <div className="grid gap-4">
        {activeOrder.map((order) => {
          const cfg = STATUS_CONFIG[order.status] || {};
          const accent = ACCENT[cfg.accent] || ACCENT.rider;
          return (
            <div key={order._id} className="flow-panel role-rider overflow-hidden">
              {/* Status header — distance shown once, here */}
              <div
                className="px-5 py-3.5 border-b border-line flex items-center justify-between"
                style={{ background: accent.bg }}
              >
                <div>
                  <h3 className="font-display text-base font-bold" style={{ color: accent.fg }}>
                    {cfg.title}
                  </h3>
                  <p className="text-xs text-ink-2">{cfg.subtitle}</p>
                </div>
                {order?.distance != null && (
                  <span className="text-sm font-medium text-ink-2 nums">{order.distance} km</span>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Donor + food */}
                <div className="min-w-0">
                  <p className="font-bold text-ink truncate font-display">
                    {order.donor?.name}
                  </p>
                  <p className="text-sm text-mute">
                    {order.donation?.FoodType}
                    {order.donation?.weightKg > 0 && (
                      <span className="ml-1 font-medium" style={{ color: "var(--color-ngo-2)" }}>
                        · {order.donation.weightKg} kg
                      </span>
                    )}
                  </p>
                </div>

                {/* Pickup + drop-off (phones kept — required mid-delivery) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ background: "rgba(var(--donor-rgb),.07)" }}
                  >
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-donor)" }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "var(--color-donor-2)" }}>Pickup</p>
                      <p className="text-sm text-ink-2 truncate">{order.pickup}</p>
                      <a
                        href={`tel:${order.donor?.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-medium mt-1 hover:underline nums"
                        style={{ color: "var(--color-donor-2)" }}
                      >
                        <Phone className="w-3 h-3" />
                        {order.donor?.phone}
                      </a>
                    </div>
                  </div>

                  <div
                    className="flex items-start gap-2 p-3 rounded-xl"
                    style={{ background: "rgba(var(--ngo-rgb),.07)" }}
                  >
                    <Navigation className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "var(--color-ngo)" }} />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold" style={{ color: "var(--color-ngo-2)" }}>Drop-off</p>
                      <p className="text-sm text-ink-2 truncate">{order.destination}</p>
                      <a
                        href={`tel:${order.receiver?.phone}`}
                        className="inline-flex items-center gap-1 text-xs font-medium mt-1 hover:underline nums"
                        style={{ color: "var(--color-ngo-2)" }}
                      >
                        <Phone className="w-3 h-3" />
                        {order.receiver?.phone}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Live location — visible only while the ride is in progress */}
                {["accepted", "picked up"].includes(order.status) && (
                  <button
                    onClick={() => navigate(`/track/${order._id}`)}
                    className="fbtn fbtn-g w-full"
                  >
                    <MapPin className="w-4 h-4" />
                    Live Location
                  </button>
                )}

                {/* Status action — colour reflects the pipeline stage */}
                <button
                  onClick={() => handleStatusUpdate(order)}
                  disabled={loadingId === order._id}
                  className="fbtn w-full"
                  style={
                    order.status === "completed"
                      ? { background: "var(--color-ink)", color: "#fff" }
                      : order.status === "picked up"
                        ? { background: "linear-gradient(135deg, var(--color-rider), var(--color-ngo))", color: "#fff" }
                        : { background: "linear-gradient(135deg, var(--color-donor), var(--color-donor-2))", color: "#fff" }
                  }
                >
                  {loadingId === order._id ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{cfg.buttonText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActiveDelivery;
