import React from "react";
import { Package, Navigation } from "lucide-react";
import DonationCard from "./DonationCard";

const AvailableDeliveries = ({
  deliveries,
  handleAcceptDelivery,
  setDeliveries,
}) => {
  const handleRejectDelivery = (id) => {
    setDeliveries(deliveries.filter((delivery) => delivery._id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">
            Available Deliveries
          </h2>
          <p className="text-mute">Choose from nearby donation requests</p>
        </div>
        <span className="livechip">
          {deliveries.length} available
        </span>
      </div>

      {deliveries.length === 0 ? (
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="et">No deliveries available</div>
            <div className="ed">Check back soon for new requests!</div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {deliveries.map((delivery) => (
            <DonationCard
              key={delivery._id}
              tone="rider"
              title={delivery.donor?.name}
              foodType={delivery.donation?.FoodType}
              timeLeft={delivery.timeLeft}
              pickup={delivery.pickup}
              destination={delivery.destination}
              meta={[
                Number(delivery.donation?.weightKg) > 0
                  ? {
                      icon: <Package className="w-3.5 h-3.5 text-mute" />,
                      text: `${delivery.donation.weightKg} kg`,
                    }
                  : null,
                delivery.distanceKm != null
                  ? {
                      icon: (
                        <Navigation className="w-3.5 h-3.5 text-mute" />
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
