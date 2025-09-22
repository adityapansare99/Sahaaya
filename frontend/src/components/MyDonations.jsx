import React from "react";
import { Edit3, X, MapPin, Calendar, Package } from "lucide-react";

const MyDonations = ({ donations, onEdit, onCancel }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Donations</h2>
        <p className="text-gray-600">Track and manage your food donations</p>
      </div>

      {donations.length === 0 ? (
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
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {donation.foodType}
                      </h3>
                      <p className="text-lg text-gray-600 mt-1">
                        {donation.quantity}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
                        donation.status
                      )}`}
                    >
                      {donation.status}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">
                        {donation.pickupLocation}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Expires: {formatDate(donation.expiryDate)}{" "}
                        {donation.expiryTime}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Created: {formatDate(donation.createdAt)}</span>
                    </div>
                  </div>

                  {donation.acceptedBy && (
                    <div className="text-sm text-green-600 bg-green-50 rounded-lg px-3 py-2 inline-block">
                      Accepted by: {donation.acceptedBy}
                    </div>
                  )}
                </div>

                {donation.status === "pending" && (
                  <div className="flex space-x-3 lg:ml-6">
                    <button
                      onClick={() => onEdit(donation)}
                      className="flex items-center space-x-2 px-4 py-2 text-blue-600 border border-blue-300 rounded-2xl hover:bg-blue-50 transition-all duration-200"
                    >
                      <Edit3 className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onCancel(donation.id)}
                      className="flex items-center space-x-2 px-4 py-2 text-red-600 border border-red-300 rounded-2xl hover:bg-red-50 transition-all duration-200"
                    >
                      <X className="w-4 h-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
