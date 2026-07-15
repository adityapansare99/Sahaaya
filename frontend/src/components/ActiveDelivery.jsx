import React, { useState } from "react";
import {
  MapPin,
  Navigation,
  Phone,
  Clock,
  Package,
  CheckCircle2,
  Truck,
} from "lucide-react";

const ActiveDelivery = ({ setActiveSection, activeOrder, handlepickup,handlecomplete }) => {
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
          bgColor: "bg-blue-50"
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

  if (!activeOrder || activeOrder.length===0) {
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
            onClick={() => {
              setActiveSection("deliveries");
            }}
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

      <div className="grid gap-10">
        {activeOrder.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className={`${getStatusConfig(order).bgColor} p-6 border-b`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3
                    className={`text-xl font-bold ${getStatusConfig(order).statusColor}`}
                  >
                    {getStatusConfig(order).title}
                  </h3>
                  <p className="text-gray-600 mt-1">{getStatusConfig(order).subtitle}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">
                    Est. {order?.estimatedTime||"--"}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Delivery Details
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Donor
                        </p>
                        <p className="text-gray-900 font-medium">
                          {order.donor.name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Food Type
                        </p>
                        <p className="text-gray-900">
                          {order.donation.FoodType}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-1">
                          Distance
                        </p>
                        <p className="text-gray-900">
                          {order?.distance || "0.0 km"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900 mb-4">
                      Locations
                    </h4>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
                        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-blue-800 mb-1">
                            Pickup
                          </p>
                          <p className="text-blue-700">
                            {order.pickup}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Phone className="w-4 h-4 text-blue-600" />
                            <a
                              href={`tel:${order.donor.phone}`}
                              className="text-blue-600 font-medium hover:underline"
                            >
                              {order.donor.phone}
                            </a>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-xl">
                        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Navigation className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-green-800 mb-1">
                            Drop-off
                          </p>
                          <p className="text-green-700">
                            {order.destination}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <Phone className="w-4 h-4 text-green-600" />
                            <a
                              href={`tel:${order.receiver.phone}`}
                              className="text-green-600 font-medium hover:underline"
                            >
                              {order.receiver.phone}
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t">
                <button
                  onClick={() => handleStatusUpdate(order)}
                  disabled={loadingId === order._id}
                  className={`w-full ${getStatusConfig(order).buttonColor} text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {loadingId === order._id ? (
                    <span className="flex items-center space-x-2">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      <span>Processing...</span>
                    </span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      <span>{getStatusConfig(order).buttonText}</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActiveDelivery;
