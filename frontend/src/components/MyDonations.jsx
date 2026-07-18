import React, { useState } from "react";
import { Edit3, X, MapPin, Calendar, Package, Clock } from "lucide-react";
import { useEffect } from "react";
import { formatAmount } from "../utils/formatDonation";

const MyDonations = ({ donations, onEdit, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Accepted":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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

  const editHandler=()=>{
    const data={
      donationId:editId,
      foodType:foodType || donationData.FoodType,
      description:description || donationData.FoodDescription,
      weightKg: weightKg !== "" ? weightKg : donationData.weightKg,
      serves: serves !== "" ? serves : donationData.serves,
      pickup:pickup || donationData.PickupLocation,
      expiryDate:expiryDate || donationData.ExpiryDate,
      expiryTime:expiryTime || donationData.ExpiryTime,
    }
    onEdit(data);
    setEditId(null)
  }

  // Latest donations first (newest createdAt on top); never mutate the prop.
  const sortedDonations = [...donations].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Donations</h2>
        <p className="text-gray-600">Track and manage your food donations</p>
      </div>

      {sortedDonations.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            No donations yet
          </h3>
          <p className="text-gray-600">
            Create your first donation to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedDonations.map((donation) =>
            donation._id !== editId ? (
              <div
                key={donation._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {donation.FoodType}
                        </h3>
                        <p className="text-lg text-gray-600 mt-1">
                          {formatAmount(donation)}
                        </p>
                        <p className="text-lg text-gray-600 mt-1">
                          {donation.FoodDescription}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                          donation.Status
                        )}`}
                      >
                        {donation.Status}
                      </span>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">
                          {donation.PickupLocation}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>
                          Expires: {formatDate(donation.ExpiryDate)}{" "}
                          {donation.ExpiryTime}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {formatDate(donation.createdAt)}</span>
                      </div>
                    </div>

                    {donation.Ngo?.name && (
                      <div className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 inline-block">
                        Accepted by: {donation.Ngo.name}
                      </div>
                    )}
                  </div>

                  {donation.Status === "Pending" && (
                    <div className="flex space-x-3 lg:ml-6">
                      <button
                        onClick={() => {
                          setEditId(donation._id);
                          setDonationData(donation);
                        }}
                        className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-2xl hover:bg-blue-50 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onCancel(donation._id)}
                        className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-2xl hover:bg-red-50 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {}
                </div>
              </div>
            ) : (
              <div
                key={donation._id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-500 mx-2 my-2 mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Package className="w-4 h-4 inline mr-2" />
                            Food Type
                          </label>
                          <select
                            value={foodType}
                            onChange={(e) => setFoodType(e.target.value)}
                            className="w-full px-4 py-1 border border-gray-300 text-lg font-medium rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            required
                          >
                            <option value="">Select food type</option>
                            {foodTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </select>
                        </h3>
                        <p className="text-lg text-gray-500 mx-2 my-2 mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Weight (kg) · Serves (people)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              min="0"
                              step="0.1"
                              value={weightKg}
                              onChange={(e) => setWeightKg(e.target.value)}
                              placeholder={donation.weightKg || "Weight"}
                              className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={serves}
                              onChange={(e) => setServes(e.target.value)}
                              placeholder={donation.serves || "Serves"}
                              className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                              required
                            />
                          </div>
                        </p>
                        <p className="text-lg text-gray-500 mx-2 my-2 mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Food Description
                          </label>
                          <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={donation.FoodDescription}
                            className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 w-[50vw] text-sm text-gray-500 mx-2 my-2 mb-4">
                      <div className="flex items-center space-x-2">
                        <span className="truncate">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <MapPin className="w-4 h-4 inline mr-2" />
                            Pickup Location
                          </label>
                          <input
                            type="text"
                            value={pickup}
                            onChange={(e) => setPickup(e.target.value)}
                            placeholder={donation.PickupLocation}
                            className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            <Clock className="w-4 h-4 inline mr-2" />
                            Expiry Date
                          </label>
                          <input
                            type="date"
                            value={expiryDate}
                            onChange={(e) => setExpiryDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Expiry Time
                          </label>
                          <input
                            type="time"
                            value={expiryTime}
                            onChange={(e) => setExpiryTime(e.target.value)}
                            className="w-full px-4 py-1 text-lg font-medium border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {donation.Status === "Pending" && (
                    <div className="flex space-x-3 lg:ml-6">
                      <button
                        onClick={() => editHandler()}
                        className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-2xl hover:bg-blue-50 transition-all duration-200"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span>Save</span>
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="flex cursor-pointer items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-2xl hover:bg-red-50 transition-all duration-200"
                      >
                        <X className="w-4 h-4" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  )}

                  {}
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
