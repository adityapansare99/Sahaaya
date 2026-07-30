import React, { useState } from "react";
import { Plus, MapPin, Clock, Package } from "lucide-react";
import LocationInput from "./LocationInput";
import FlowSelect from "./flow/FlowSelect";

const CreateDonation = ({ onDonationCreate }) => {
  const [donorType, setDonorType] = useState("");
  const [foodType, setFoodType] = useState("");
  const [description, setDescription] = useState("");
  const [weightKg, setWeightKg] = useState("");
  const [serves, setServes] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [pickupCoords, setPickupCoords] = useState({ lat: null, lng: null });
  const [expiryDate, setExpiryDate] = useState("");
  const [expiryTime, setExpiryTime] = useState("");
  const [formError, setFormError] = useState("");

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

  const donorTypes = ["Restaurant", "Individual", "Store", "Event"];

  const handleSubmit = (e) => {
    e.preventDefault();

    // FlowSelect renders a button (not a native form control), so the
    // donorType/foodType selects can't use native `required`. Guard here to
    // preserve the validation the native <select required> previously gave.
    if (!donorType || !foodType) {
      setFormError(
        !donorType && !foodType
          ? "Please select a donor type and food type."
          : !donorType
            ? "Please select a donor type."
            : "Please select a food type."
      );
      return;
    }
    setFormError("");

    const data = {
      donorType,
      foodType,
      description,
      weightKg: Number(weightKg) || 0,
      serves: Number(serves) || 0,
      pickup: pickupAddress,
      pickupLatitude: pickupCoords.lat,
      pickupLongitude: pickupCoords.lng,
      expiryDate,
      expiryTime,
    };

    onDonationCreate(data);

    setDonorType("");
    setFoodType("");
    setDescription("");
    setWeightKg("");
    setServes("");
    setPickupAddress("");
    setPickupCoords({ lat: null, lng: null });
    setExpiryDate("");
    setExpiryTime("");
  };

  const labelCls = "block text-sm font-medium text-ink-2 mb-2";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">
          Create Donation
        </h2>
        <p className="text-mute">Share your food to help those in need</p>
      </div>

      <div className="flow-panel p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Donor Type — amber accent (donor = origin of the pipeline) */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-ink-2 mb-2">
              <span className="inline-grid place-items-center w-6 h-6 rounded-lg bg-donor-soft text-donor-2">
                <Package className="w-3.5 h-3.5" />
              </span>
              Donor Type
            </label>
            <FlowSelect
              value={donorType}
              onChange={(v) => setDonorType(v)}
              ariaLabel="Donor type"
              placeholder="Select donor type"
              options={donorTypes.map((type) => ({ value: type, label: type }))}
            />
          </div>

          {/* Food Type */}
          <div>
            <label className={labelCls}>
              <Package className="w-4 h-4 inline mr-2 text-mute" />
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

          {/* description */}
          <div>
            <label className={labelCls}>Food Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Fresh prepared rice, dal, vegetables, and roti"
              className="flow-input"
              required
            />
          </div>

          {/* Approximate Weight & Serves */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Package className="w-4 h-4 inline mr-2 text-mute" />
                Approximate Weight (kg)
              </label>
              <input
                type="number"
                min="0"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g., 10"
                className="flow-input nums"
                required
              />
            </div>
            <div>
              <label className={labelCls}>
                <Package className="w-4 h-4 inline mr-2 text-mute" />
                Serves (people)
              </label>
              <input
                type="number"
                min="0"
                step="1"
                value={serves}
                onChange={(e) => setServes(e.target.value)}
                placeholder="e.g., 50"
                className="flow-input nums"
                required
              />
            </div>
          </div>

          {/* Pickup Location */}
          <div>
            <label className={labelCls}>
              <MapPin className="w-4 h-4 inline mr-2 text-mute" />
              Pickup Location
            </label>
            <LocationInput
              value={pickupAddress}
              onChange={setPickupAddress}
              onSelect={setPickupCoords}
              placeholder="Enter complete address"
              required
            />
            {pickupCoords.lat && pickupCoords.lng && (
              <p className="mt-1 text-xs text-mute nums">
                Coordinates: {pickupCoords.lat.toFixed(6)},{" "}
                {pickupCoords.lng.toFixed(6)}
              </p>
            )}
          </div>

          {/* Expiry Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Clock className="w-4 h-4 inline mr-2 text-mute" />
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
              <label className={labelCls}>Expiry Time</label>
              <input
                type="time"
                value={expiryTime}
                onChange={(e) => setExpiryTime(e.target.value)}
                className="flow-input"
                required
              />
            </div>
          </div>

          {formError && (
            <p
              className="text-sm flex items-center gap-2"
              style={{ color: "var(--color-urgent)" }}
            >
              {formError}
            </p>
          )}

          {/* Submit Button */}
          <button type="submit" className="fbtn fbtn-flow w-full text-base">
            <Plus className="w-5 h-5" />
            <span>Donate Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
