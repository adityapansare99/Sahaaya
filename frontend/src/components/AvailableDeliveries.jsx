import React, { useState } from "react";
import {
  MapPin,
  Clock,
  Package,
  Navigation,
  CheckCircle,
  XCircle,
} from "lucide-react";

const AvailableDeliveries = () => {
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      donorName: "Rajesh Kumar",
      pickupLocation: "Green Valley Restaurant, MG Road",
      dropLocation: "Hope Foundation NGO, Sector 12",
      foodType: "Fresh Meals (Rice, Dal, Sabzi)",
      expiryTime: "2 hours",
      distance: "3.2 km",
      status: "available",
    },
    {
      id: 2,
      donorName: "Priya's Kitchen",
      pickupLocation: "Priya's Home Kitchen, Jubilee Hills",
      dropLocation: "Children's Care Center, Banjara Hills",
      foodType: "Homemade Food (Chapati, Curry)",
      expiryTime: "1.5 hours",
      distance: "2.8 km",
      status: "available",
    },
    {
      id: 3,
      donorName: "Mumbai Darbar",
      pickupLocation: "Mumbai Darbar Restaurant, Tank Bund",
      dropLocation: "Elderly Care Home, Secunderabad",
      foodType: "North Indian Cuisine",
      expiryTime: "45 minutes",
      distance: "4.1 km",
      status: "available",
    },
  ]);

  const handleAcceptDelivery = (id) => {
    setDeliveries(
      deliveries.map((delivery) =>
        delivery.id === id ? { ...delivery, status: "accepted" } : delivery
      )
    );
  };

  const handleRejectDelivery = (id) => {
    setDeliveries(deliveries.filter((delivery) => delivery.id !== id));
  };

  const availableDeliveries = deliveries.filter(
    (d) => d.status === "available"
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Available Deliveries
          </h2>
          <p className="text-gray-600">Choose from nearby donation requests</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium">
          {availableDeliveries.length} Available
        </div>
      </div>

      {availableDeliveries.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No deliveries available
          </h3>
          <p className="text-gray-400">Check back soon for new requests!</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {availableDeliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        {delivery.donorName}
                      </h3>
                      <p className="text-gray-600 font-medium">
                        {delivery.foodType}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <MapPin className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Pickup
                          </p>
                          <p className="text-gray-600">
                            {delivery.pickupLocation}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                          <Navigation className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Drop-off
                          </p>
                          <p className="text-gray-600">
                            {delivery.dropLocation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-5 h-5 text-orange-500" />
                        <span className="text-orange-600 font-medium">
                          {delivery.expiryTime} left
                        </span>
                      </div>
                      <div className="bg-gray-100 px-3 py-1 rounded-lg">
                        <span className="text-gray-700 font-medium">
                          {delivery.distance}
                        </span>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleAcceptDelivery(delivery.id)}
                        className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 hover:shadow-lg"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>Accept Delivery</span>
                      </button>

                      <button
                        onClick={() => handleRejectDelivery(delivery.id)}
                        className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center space-x-2 text-gray-600 hover:text-red-500 hover:bg-red-50 border border-gray-200 hover:border-red-200"
                      >
                        <XCircle className="w-5 h-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableDeliveries;
