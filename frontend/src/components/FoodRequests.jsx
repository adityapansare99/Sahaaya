import React, { useEffect, useState } from "react";
import { MapPin, Clock, Package, Check, X } from "lucide-react";
import { formatAmount } from "../utils/formatDonation";

const FoodRequests = ({ donations,acceptOrder,rejectOrder }) => {

  useEffect(() => {}, [donations]);

  const getDonorTypeColor = (type) => {
    switch (type) {
      case "Restaurant":
        return "bg-blue-100 text-blue-800";
      case "Event":
        return "bg-purple-100 text-purple-800";
      case "Grocery Store":
        return "bg-green-100 text-green-800";
      case "Individual":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getUrgencyColor = (time) => {
    let temp=time.split(":");
    if (temp[0]<=2) return "text-red-600";
    if (temp[0]<=10) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          Incoming Food Donations
        </h2>
        <div className="text-sm text-gray-500">
          {donations.length} donations available nearby
        </div>
      </div>

      {donations.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No donations available
          </h3>
          <p className="text-gray-500">
            Check back later for new food donation opportunities.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {donations.map((request) => (
            <div
              key={request._id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {request.Donor.name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getDonorTypeColor(
                        request.typeOfDonor
                      )}`}
                    >
                      {request.typeOfDonor}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {request.FoodType}
                      </span>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatAmount(request)}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {request.PickupLocation} <br/> ({(request.distanceKm ?? request.distance) ? `${request.distanceKm ?? request.distance} km` : "—"})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock
                        className={`w-4 h-4 ${getUrgencyColor(
                          request.timeLeft
                        )}`}
                      />
                      <span
                        className={`text-sm font-medium ${getUrgencyColor(
                          request.timeLeft
                        )}`}
                      >
                        {request.timeLeft} left
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm mb-4">
                    {request.FoodDescription}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => rejectOrder(request._id)}
                    className="px-4 cursor-pointer py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button
                    onClick={() => acceptOrder(request._id)}
                    className="px-6 cursor-pointer py-2 bg-red-500 text-white rounded-xl hover:bg-[#d63447] transition-colors duration-200 flex items-center gap-2 shadow-lg"
                  >
                    <Check className="w-4 h-4" />
                    Accept
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FoodRequests;
