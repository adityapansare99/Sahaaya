import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Package, Filter, Star, MapPin } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { formatAmount } from "../utils/formatDonation";
import FlowSelect from "./flow/FlowSelect";

// Flow status pill — same pipeline mapping used across the app:
// Completed = NGO-emerald (destination/success), Accepted = rider-teal (transport),
// Cancelled = urgent-red, default = muted.
const StatusPill = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <span
        className="text-[11px] font-semibold capitalize nums whitespace-nowrap px-2 py-0.5 rounded-full"
        style={{ background: "rgba(var(--urgent-rgb),.12)", color: "var(--color-urgent)" }}
      >
        {status}
      </span>
    );
  }
  const cls = {
    Pending: "bg-donor-soft text-donor-2",
    Accepted: "bg-rider-soft text-rider-2",
    Completed: "bg-ngo-soft text-ngo-2",
  }[status];
  return (
    <span className={`text-[11px] font-semibold capitalize nums whitespace-nowrap px-2 py-0.5 rounded-full ${cls || "bg-surface-2 text-mute"}`}>
      {status}
    </span>
  );
};

const FlowStars = ({ rating }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        className={`w-3.5 h-3.5 flow-star${s > rating ? " empty" : ""}`}
        fill={s <= rating ? "currentColor" : "none"}
      />
    ))}
  </div>
);

const StarRating = ({ rideId, onRate }) => {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  if (selected > 0) {
    return (
      <div className="flex items-center gap-1.5">
        <FlowStars rating={selected} />
        <span className="text-[11px] text-mute ml-1">Rated</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={submitting}
          onClick={() => {
            setSubmitting(true);
            setSelected(star);
            onRate(rideId, star).finally(() => setSubmitting(false));
          }}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer transition-transform hover:scale-110 disabled:opacity-50"
        >
          <Star
            className={`w-4 h-4 flow-star${star > (hovered || selected) ? " empty" : ""}`}
            fill={star <= (hovered || selected) ? "currentColor" : "none"}
          />
        </button>
      ))}
    </div>
  );
};

// Compact stat tile (Flow).
const HistStat = ({ value, label, tint }) => {
  const T = {
    ink: { bg: "var(--color-surface-2)", fg: "var(--color-ink)" },
    ngo: { bg: "var(--color-ngo-soft)", fg: "var(--color-ngo-2)" },
    rider: { bg: "var(--color-rider-soft)", fg: "var(--color-rider-2)" },
    urgent: { bg: "rgba(var(--urgent-rgb),.1)", fg: "var(--color-urgent)" },
  }[tint];
  return (
    <div className="flow-tile p-4">
      <div className="font-display text-2xl font-bold nums" style={{ color: T.fg }}>
        {value}
      </div>
      <div className="text-xs text-mute mt-0.5">{label}</div>
    </div>
  );
};

const DonationHistory = ({ acceptedOrder, filtered, setFiltered, completedDeliveries = [], onRateDelivery }) => {
  const { backendurl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(null);
  const [filter, setFilter] = useState("all");

  // In-progress donations carry no rideId here (completedDeliveries only covers
  // completed rides), so resolve the active ride on click.
  const handleTrack = async (donationId) => {
    setTrackingId(donationId);
    try {
      const { data } = await axios.get(
        `${backendurl}track/by-donation/${donationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.data?.rideId) navigate(`/track/${data.data.rideId}`);
    } catch {
      /* no active ride */
    } finally {
      setTrackingId(null);
    }
  };

  // Build a lookup: donationId → { riderName, rideId, riderRating }
  const deliveryLookup = {};
  if (completedDeliveries) {
    for (const ride of completedDeliveries) {
      if (ride.donation?._id) {
        deliveryLookup[ride.donation._id] = {
          rideId: ride._id,
          riderName: ride.rider?.name || "Unknown",
          riderRating: ride.riderRating || 0,
        };
      }
    }
  }

  useEffect(() => {
    filteredDonations();
  }, [filter]);

  const filteredDonations = () => {
    const temp = filter === "all"
      ? acceptedOrder.response
      : acceptedOrder.response?.filter((d) =>
          d.Status.toLowerCase().includes(filter)
        );

    setFiltered(temp);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Received Donations</h2>
          <p className="text-mute">Every delivery that's flowed into your care</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-mute" />
          <FlowSelect
            value={filter}
            onChange={(v) => setFilter(v)}
            ariaLabel="Filter by status"
            className="w-44"
            options={[
              { value: "all", label: "All Status" },
              { value: "completed", label: "Completed" },
              { value: "cancelled", label: "Cancelled" },
              { value: "accepted", label: "Accepted" },
            ]}
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <HistStat value={acceptedOrder.total} label="Total Received" tint="ink" />
        <HistStat value={acceptedOrder.completed} label="Completed" tint="ngo" />
        <HistStat value={acceptedOrder.pending} label="Accepted" tint="rider" />
        <HistStat value={acceptedOrder?.cancelled || 0} label="Cancelled" tint="urgent" />
      </div>

      {/* Donations Table */}
      <div className="flow-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="flow-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Donor</th>
                <th>Food Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Rider Rating</th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((donation) => {
                const delivery = deliveryLookup[donation._id];
                return (
                  <tr key={donation._id}>
                    <td>
                      <div className="flex items-center gap-2 nums">
                        <Calendar className="w-3.5 h-3.5 text-mute-2" />
                        <span>
                          {new Date(donation.updatedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="font-medium text-ink">{donation.Donor?.name}</div>
                      <div className="text-xs text-mute">{donation.typeOfDonor}</div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Package className="w-3.5 h-3.5 text-mute-2" />
                        <span>{donation.FoodType}</span>
                      </div>
                    </td>
                    <td className="font-medium text-ink nums">{formatAmount(donation)}</td>

                    <td><StatusPill status={donation.Status} /></td>

                    <td>
                      {donation.Status === "Completed" ? (
                        delivery ? (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-mute">{delivery.riderName}</span>
                            {delivery.riderRating > 0 ? (
                              <div className="flex items-center gap-1.5">
                                <FlowStars rating={delivery.riderRating} />
                                <span className="text-xs text-mute nums">{delivery.riderRating}/5</span>
                              </div>
                            ) : (
                              <StarRating rideId={delivery.rideId} onRate={onRateDelivery} />
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-mute-2">No rider data</span>
                        )
                      ) : donation.Status === "Accepted" ? (
                        <button
                          onClick={() => handleTrack(donation._id)}
                          disabled={trackingId === donation._id}
                          className="fbtn fbtn-g fbtn-sm"
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          {trackingId === donation._id ? "Loading…" : "Live Location"}
                        </button>
                      ) : (
                        <span className="text-xs text-mute-2">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
