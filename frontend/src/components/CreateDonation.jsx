import React, { useState } from "react";
import { Plus, MapPin, Clock, Package } from "lucide-react";

const CreateDonation = ({ onDonationCreate }) => {
  const [formData, setFormData] = useState({
    foodType: "",
    quantity: "",
    pickupLocation: "",
    expiryDate: "",
    expiryTime: "",
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Object.values(formData).every((value) => value.trim())) {
      onDonationCreate(formData);
      setFormData({
        foodType: "",
        quantity: "",
        pickupLocation: "",
        expiryDate: "",
        expiryTime: "",
      });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto md:mt-15">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Create Donation
        </h2>
        <p className="text-gray-600">Share your food to help those in need</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Food Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Package className="w-4 h-4 inline mr-2" />
              Food Type
            </label>
            <select
              value={formData.foodType}
              onChange={(e) => handleInputChange("foodType", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            >
              <option value="">Select food type</option>
              {foodTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              type="text"
              value={formData.quantity}
              onChange={(e) => handleInputChange("quantity", e.target.value)}
              placeholder="e.g., 50 meals, 10 kg, 20 packets"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Pickup Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-2" />
              Pickup Location
            </label>
            <input
              type="text"
              value={formData.pickupLocation}
              onChange={(e) =>
                handleInputChange("pickupLocation", e.target.value)
              }
              placeholder="Enter complete address"
              className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required
            />
          </div>

          {/* Expiry Date & Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) =>
                  handleInputChange("expiryDate", e.target.value)
                }
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expiry Time
              </label>
              <input
                type="time"
                value={formData.expiryTime}
                onChange={(e) =>
                  handleInputChange("expiryTime", e.target.value)
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-red-500 text-white py-4 rounded-2xl font-semibold hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Donate Now</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDonation;
