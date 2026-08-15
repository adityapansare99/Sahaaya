import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit3, X, MapPin, Calendar, Package } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { formatAmount } from "../utils/formatDonation";
import FlowSelect from "./flow/FlowSelect";

const StatusPill = ({ status }) => {
  if (status === "Cancelled") {
    return (
      <span
        className="px-3 py-1 rounded-full text-xs font-semibold capitalize nums whitespace-nowrap"
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
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize nums whitespace-nowrap ${cls || "bg-surface-2 text-mute"}`}>
      {status}
    </span>
  );
};

const MyDonations = ({ donations, onEdit }) => {
  const { backendurl, token } = useContext(AppContext);
  const navigate = useNavigate();
  const [trackingId, setTrackingId] = useState(null);
  const [cancelledIds, setCancelledIds] = useState(() => new Set());

  const handleTrack = async (donationId) => {
    setTrackingId(donationId);
    try {
      const { data } = await axios.get(
        `${backendurl}track/by-donation/${donationId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data?.data?.rideId) navigate(`/track/${data.data.rideId}`);
    } catch {
    } finally {
      setTrackingId(null);
    }
  };

  const handleCancel = async (donation) => {
    if (!window.confirm("Cancel this donation? This cannot be undone.")) return;
    try {
      const { data } = await axios.post(
        `${backendurl}donation/cancelDonation`,
        { donationId: donation._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!data?.success) {
        window.alert(data?.message || "Could not cancel donation");
        return;
      }
      setCancelledIds((prev) => {
        const next = new Set(prev);
        next.add(donation._id);
        return next;
      });
    } catch (e) {
      const msg =
        e?.response?.status === 409
          ? e?.response?.data?.message ||
            "This donation can no longer be cancelled."
          : "Could not cancel donation. Please try again.";
      window.alert(msg);
    }
  };

  const foodTypes = [
    "Cooked Meals",
    "Fresh Vegetables",
    "Fruits",
    "Packaged Food",
    "Dairy Products",
    "Bakery Items",
    "Beverages",
    "Other",
  ];

  useEffect(() => {}, [donations]);

  const [donationData, setDonationData] = useState({});
  const [foodType, setFoodType] = useState(donationData.FoodType || "");
  const [description, setDescription] = useState(
    donationData.FoodDescription || ""
  );
  const [weightKg, setWeightKg] = useState(donationData.weightKg || "");
  const [serves, setServes] = useState(donationData.serves || "");
  const [pickup, setPickup] = useState(donationData.PickupLocation || "");
  const [expiryDate, setExpiryDate] = useState(donationData.ExpiryDate || "");
  const [expiryTime, setExpiryTime] = useState(donationData.ExpiryTime || "");

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const [editId, setEditId] = useState(null);

  const editHandler = () => {
    const data = {
      donationId: editId,
      foodType: foodType || donationData.FoodType,
      description: description || donationData.FoodDescription,
      weightKg: weightKg !== "" ? weightKg : donationData.weightKg,
      serves: serves !== "" ? serves : donationData.serves,
      pickup: pickup || donationData.PickupLocation,
      expiryDate: expiryDate || donationData.ExpiryDate,
      expiryTime: expiryTime || donationData.ExpiryTime,
    };
    onEdit(data);
    setEditId(null);
  };

  const sortedDonations = [...donations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">
          My Donations
        </h2>
        <p className="text-mute">Track and manage your food donations</p>
      </div>

      {sortedDonations.length === 0 ? (
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="et">No donations yet</div>
            <div className="ed">Create your first donation to get started!</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDonations.map((donation) => {
            const effectiveStatus = cancelledIds.has(donation._id)
              ? "Cancelled"
              : donation.Status;
            return donation._id !== editId ? (
              <div
                key={donation._id}
                className="flow-card role-donor p-5 md:p-6"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  {/* info */}
                  <div className="flex-1 min-w-0 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="font-display text-lg font-bold text-ink truncate">
                          {donation.FoodType}
                        </h3>
                        {formatAmount(donation) ? (
                          <p className="text-sm text-mute mt-0.5">
                            {formatAmount(donation)}
                          </p>
                        ) : null}
                        {donation.FoodDescription ? (
                          <p className="text-sm text-mute mt-0.5">
                            {donation.FoodDescription}
                          </p>
                        ) : null}
                      </div>
                      <StatusPill status={effectiveStatus} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-xs text-mute">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-donor shrink-0" />
                        <span className="truncate max-w-[220px]">
                          {donation.PickupLocation}
                        </span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 nums">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Expires {formatDate(donation.ExpiryDate)}{" "}
                        {donation.ExpiryTime}
                      </span>
                      <span className="inline-flex items-center gap-1.5 nums">
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Created {formatDate(donation.createdAt)}
                      </span>
                    </div>

                    {donation.Ngo?.name && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-ngo-2 bg-ngo-soft rounded-full px-2.5 py-1">
                        Accepted by {donation.Ngo.name}
                      </span>
                    )}

                    {/* micro route: pickup -> NGO (hover-advances on fine pointers) */}
                    {donation.Ngo?.name &&
                      (effectiveStatus === "Accepted" ||
                        effectiveStatus === "Completed") && (
                        <div className="flow-route-mini pt-1">
                          <span className="pt a">
                            A · {donation.PickupLocation?.split(",")[0] || "Pickup"}
                          </span>
                          <span className="lane">
                            <span className="flow" />
                            <span className="bead" />
                          </span>
                          <span className="pt b">B · {donation.Ngo.name}</span>
                        </div>
                      )}
                  </div>

                  {/* actions */}
                  {effectiveStatus === "Pending" && (
                    <div className="flex shrink-0 gap-2">
                      <button
                        onClick={() => {
                          setEditId(donation._id);
                          setDonationData(donation);
                        }}
                        className="fbtn fbtn-g fbtn-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleCancel(donation)}
                        className="fbtn fbtn-g fbtn-sm"
                        style={{
                          color: "var(--color-urgent)",
                          borderColor: "rgba(var(--urgent-rgb),.35)",
                        }}
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {effectiveStatus === "Accepted" && (
                    <div className="flex shrink-0">
                      <button
                        onClick={() => handleTrack(donation._id)}
                        disabled={trackingId === donation._id}
                        className="fbtn fbtn-g fbtn-sm"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>
                          {trackingId === donation._id ? "Loading…" : "Live Location"}
                        </span>
                      </button>
                    </div>
                  )}

                  {}
                </div>
              </div>
            ) : (
              <div key={donation._id} className="flow-card role-donor p-5 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-display text-lg font-bold text-ink">
                    Edit donation
                  </h3>
                  <StatusPill status={donation.Status} />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Food Type
                    </label>
                    <FlowSelect
                      value={foodType}
                      onChange={(v) => setFoodType(v)}
                      ariaLabel="Food type"
                      placeholder="Select food type"
                      options={foodTypes.map((type) => ({ value: type, label: type }))}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={weightKg}
                      onChange={(e) => setWeightKg(e.target.value)}
                      placeholder={donation.weightKg || "Weight"}
                      className="flow-input nums"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Serves (people)
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={serves}
                      onChange={(e) => setServes(e.target.value)}
                      placeholder={donation.serves || "Serves"}
                      className="flow-input nums"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Food Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={donation.FoodDescription}
                      className="flow-input"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Pickup Location
                    </label>
                    <input
                      type="text"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                      placeholder={donation.PickupLocation}
                      className="flow-input"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="flow-input"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-ink-2 mb-2">
                      Expiry Time
                    </label>
                    <input
                      type="time"
                      value={expiryTime}
                      onChange={(e) => setExpiryTime(e.target.value)}
                      className="flow-input"
                      required
                    />
                  </div>
                </div>

                {donation.Status === "Pending" && (
                  <div className="flex gap-2 mt-5 justify-end">
                    <button
                      onClick={() => setEditId(null)}
                      className="fbtn fbtn-g fbtn-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                    <button
                      onClick={() => editHandler()}
                      className="fbtn fbtn-flow fbtn-sm"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                )}

                {}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
