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

const ActiveDelivery = (props) => {
  const [activeDelivery, setActiveDelivery] = useState({
    id: 1,
    donorName: "Rajesh Kumar",
    donorPhone: "+91 9876543210",
    pickupLocation: "Green Valley Restaurant, MG Road",
    dropLocation: "Hope Foundation NGO, Sector 12",
    ngoContact: "+91 9876543211",
    foodType: "Fresh Meals (Rice, Dal, Sabzi)",
    estimatedTime: "25 minutes",
    distance: "3.2 km",
    status: "accepted", // accepted, picked_up, delivered
  });

  const handleStatusUpdate = () => {
    if (activeDelivery.status === "accepted") {
      setActiveDelivery({ ...activeDelivery, status: "picked_up" });
    } else if (activeDelivery.status === "picked_up") {
      setActiveDelivery({ ...activeDelivery, status: "delivered" });
    }
  };

  const getStatusConfig = () => {
    switch (activeDelivery.status) {
      case "accepted":
        return {
          title: "Delivery Accepted",
          subtitle: "Head to pickup location",
          buttonText: "Mark as Picked Up",
          buttonColor: "bg-blue-500 hover:bg-blue-600",
          statusColor: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "picked_up":
        return {
          title: "Food Picked Up",
          subtitle: "Delivering to NGO",
          buttonText: "Mark as Delivered",
          buttonColor: "bg-green-500 hover:bg-green-600",
          statusColor: "text-green-600",
          bgColor: "bg-green-50",
        };
      case "delivered":
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

  if (!activeDelivery || activeDelivery.status === "delivered") {
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
          <button onClick={()=>{
            props.setActiveSection('deliveries');
          }} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-colors">
            Browse Available Deliveries
          </button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Active Delivery</h2>
        <p className="text-gray-600">Your current delivery status</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className={`${statusConfig.bgColor} p-6 border-b`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className={`text-xl font-bold ${statusConfig.statusColor}`}>
                {statusConfig.title}
              </h3>
              <p className="text-gray-600 mt-1">{statusConfig.subtitle}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-gray-500" />
              <span className="font-medium text-gray-700">
                Est. {activeDelivery.estimatedTime}
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
                      {activeDelivery.donorName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Food Type
                    </p>
                    <p className="text-gray-900">{activeDelivery.foodType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Distance
                    </p>
                    <p className="text-gray-900">{activeDelivery.distance}</p>
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
                        {activeDelivery.pickupLocation}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="w-4 h-4 text-blue-600" />
                        <a
                          href={`tel:${activeDelivery.donorPhone}`}
                          className="text-blue-600 font-medium hover:underline"
                        >
                          {activeDelivery.donorPhone}
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
                        {activeDelivery.dropLocation}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <Phone className="w-4 h-4 text-green-600" />
                        <a
                          href={`tel:${activeDelivery.ngoContact}`}
                          className="text-green-600 font-medium hover:underline"
                        >
                          {activeDelivery.ngoContact}
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
              onClick={handleStatusUpdate}
              className={`w-full ${statusConfig.buttonColor} text-white cursor-pointer px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-200 flex items-center justify-center space-x-3 hover:shadow-lg`}
            >
              <CheckCircle2 className="w-6 h-6" />
              <span>{statusConfig.buttonText}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActiveDelivery;
