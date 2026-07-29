import React from "react";
import { Package, Users, MapPin } from "lucide-react";
import DonationCard from "./DonationCard";

const FoodRequests = ({ donations, acceptOrder, rejectOrder }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">
            Incoming Food Donations
          </h2>
          <p className="text-mute">Fresh surplus nearby, waiting to be received</p>
        </div>
        <span className="livechip">
          {donations.length} available
        </span>
      </div>

      {donations.length === 0 ? (
        <div className="flow-empty flex-col items-center text-center py-14">
          <div className="ei">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="et">No donations available</div>
            <div className="ed">Check back later for new food donation opportunities.</div>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {donations.map((d) => {
            const distance = d.distanceKm ?? d.distance;
            return (
              <DonationCard
                key={d._id}
                tone="donor"
                title={d.Donor?.name}
                badge={d.typeOfDonor}
                foodType={d.FoodType}
                timeLeft={d.timeLeft}
                pickup={d.PickupLocation}
                description={d.FoodDescription}
                meta={[
                  Number(d.serves) > 0
                    ? {
                        icon: <Users className="w-3.5 h-3.5 text-mute" />,
                        text: `${d.serves} serves`,
                      }
                    : null,
                  Number(d.weightKg) > 0
                    ? {
                        icon: <Package className="w-3.5 h-3.5 text-mute" />,
                        text: `${d.weightKg} kg`,
                      }
                    : null,
                  distance != null
                    ? {
                        icon: <MapPin className="w-3.5 h-3.5 text-mute" />,
                        text: `${distance} km`,
                      }
                    : null,
                ].filter(Boolean)}
                onAccept={() => acceptOrder(d._id)}
                onReject={() => rejectOrder(d._id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FoodRequests;
