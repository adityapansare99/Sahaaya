import React from "react";
import { Package, Users, MapPin } from "lucide-react";
import DonationCard from "./DonationCard";

const FoodRequests = ({ donations, acceptOrder, rejectOrder }) => {
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
        <div className="grid gap-4">
          {donations.map((d) => {
            const distance = d.distanceKm ?? d.distance;
            return (
              <DonationCard
                key={d._id}
                title={d.Donor?.name}
                badge={d.typeOfDonor}
                foodType={d.FoodType}
                timeLeft={d.timeLeft}
                pickup={d.PickupLocation}
                description={d.FoodDescription}
                meta={[
                  Number(d.serves) > 0
                    ? {
                        icon: <Users className="w-3.5 h-3.5 text-gray-400" />,
                        text: `${d.serves} serves`,
                      }
                    : null,
                  Number(d.weightKg) > 0
                    ? {
                        icon: <Package className="w-3.5 h-3.5 text-gray-400" />,
                        text: `${d.weightKg} kg`,
                      }
                    : null,
                  distance != null
                    ? {
                        icon: <MapPin className="w-3.5 h-3.5 text-gray-400" />,
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
