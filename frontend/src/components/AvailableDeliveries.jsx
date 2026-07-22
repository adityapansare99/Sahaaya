import React from "react";
import { Package, Navigation } from "lucide-react";
import DonationCard from "./DonationCard";

const AvailableDeliveries = ({
  deliveries,
  handleAcceptDelivery,
  setDeliveries,
}) => {
  // Reject is local-only: just hides the card from this rider's list.
  const handleRejectDelivery = (id) => {
    setDeliveries(deliveries.filter((delivery) => delivery._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Available Deliveries
          </h2>
          <p className="text-gray-600">
            Choose from nearby donation requests
          </p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl font-medium">
          {deliveries.length} Available
        </div>
      </div>

      {deliveries.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-gray-500 mb-2">
            No deliveries available
          </h3>
          <p className="text-gray-400">Check back soon for new requests!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <DonationCard
              key={delivery._id}
              title={delivery.donor?.name}
              foodType={delivery.donation?.FoodType}
              timeLeft={delivery.timeLeft}
              pickup={delivery.pickup}
              destination={delivery.destination}
              meta={[
                Number(delivery.donation?.weightKg) > 0
                  ? {
                      icon: <Package className="w-3.5 h-3.5 text-gray-400" />,
                      text: `${delivery.donation.weightKg} kg`,
                    }
                  : null,
                delivery.distanceKm != null
                  ? {
                      icon: (
                        <Navigation className="w-3.5 h-3.5 text-gray-400" />
                      ),
                      text: `${delivery.distanceKm} km`,
                    }
                  : null,
              ].filter(Boolean)}
              acceptLabel="Accept Delivery"
              onAccept={() => handleAcceptDelivery(delivery._id)}
              onReject={() => handleRejectDelivery(delivery._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AvailableDeliveries;
