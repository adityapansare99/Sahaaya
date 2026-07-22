import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Navigation,
  Phone,
  Package,
  CheckCircle2,
  Truck,
} from "lucide-react";

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

  const getStatusConfig = (order) => {
    switch (order.status) {
      case "accepted":
        return {
          title: "Delivery Accepted",
          subtitle: "Head to pickup location",
          buttonText: "Mark as Picked Up",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
          statusColor: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "picked up":
        return {
          title: "Food Picked Up",
          subtitle: "Delivering to NGO",
          buttonText: "Mark as Delivered",
          buttonColor: "bg-green-500 hover:bg-green-600",
          statusColor: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "completed":
        return {
          title: "Delivery Complete",
          subtitle: "Great job! 🎉",
          buttonText: "Find New Delivery",
          buttonColor: "bg-red-500 hover:bg-red-600",
          statusColor: "text-green-600",
          bgColor: "bg-green-50",
        };
      default:
        return {};
    }
  };

  if (!activeOrder || activeOrder.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Delivery</h2>
          <p className="text-gray-600">Your current delivery status</p>
        </div>

        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Truck className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No active delivery
          </h3>
          <p className="text-gray-400 mb-6">Ready to accept a new delivery?</p>
          <button
            onClick={() => setActiveSection("deliveries")}
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors"
          >
            Browse Available Deliveries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Active Delivery</h2>
        <p className="text-gray-600">Your current delivery status</p>
      </div>

      <div className="grid gap-4">
        {activeOrder.map((order) => {
          const cfg = getStatusConfig(order);
          return (
            <div
              key={order._id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              {/* Status header — distance shown once, here */}
              <div
                className={`${cfg.bgColor} px-5 py-3 border-b flex items-center justify-between`}
              >
                <div>
                  <h3 className={`text-base font-bold ${cfg.statusColor}`}>
                    {cfg.title}
                  </h3>
                  <p className="text-xs text-gray-600">{cfg.subtitle}</p>
                </div>
                {order?.distance != null && (
                  <span className="text-sm font-medium text-gray-700">
                    {order.distance} km
                  </span>
                )}
              </div>

              <div className="p-5 space-y-4">
                {/* Donor + food */}
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 truncate">
                    {order.donor?.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.donation?.FoodType}
                    {order.donation?.weightKg > 0 && (
                      <span className="ml-1 text-purple-600 font-medium">
                        · {order.donation.weightKg} kg
                      </span>
                    )}
                  </p>
                </div>

                {/* Pickup + drop-off (phones kept — required mid-delivery) */}
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl">
                    <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-blue-800">Pickup</p>
                      <p className="text-sm text-blue-700 truncate">
                        {order.pickup}
                      </p>
                      <a
                        href={`tel:${order.donor?.phone}`}
                        className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium mt-1 hover:underline"
                      >
                        <Phone className="w-3 h-3" />
                        {order.donor?.phone}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                    <Navigation className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-green-800">
                        Drop-off
                      </p>
                      <p className="text-sm text-green-700 truncate">
                        {order.destination}
                      </p>
                      <a
                        href={`tel:${order.receiver?.phone}`}
                        className="inline-flex items-center gap-1 text-xs text-green-600 font-medium mt-1 hover:underline"
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
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                  >
                    <MapPin className="w-4 h-4" />
                    Live Location
                  </button>
                )}

                {/* Status action */}
                <button
                  onClick={() => handleStatusUpdate(order)}
                  disabled={loadingId === order._id}
                  className={`w-full ${cfg.buttonColor} text-white py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 hover:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingId === order._id ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
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
