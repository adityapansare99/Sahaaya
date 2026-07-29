import React, { useState } from "react";
import {
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Search,
  Package,
} from "lucide-react";

// Flow status badge for the rider history.
const getStatusBadge = (status) => {
  if (status === "completed") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold nums"
        style={{ background: "rgba(var(--ngo-rgb),.12)", color: "var(--color-ngo-2)" }}
      >
        <CheckCircle className="w-3 h-3" />
        Delivered
      </span>
    );
  }
  if (status === "Cancelled") {
    return (
      <span
        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold nums"
        style={{ background: "rgba(var(--urgent-rgb),.12)", color: "var(--color-urgent)" }}
      >
        <XCircle className="w-3 h-3" />
        Cancelled
      </span>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-surface-2 text-mute capitalize">
      {status}
    </span>
  );
};

const DeliveryHistory = ({ history }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredHistory = history.filter((delivery) => {
    const matchesSearch =
      delivery.donor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.receiver?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.donation.FoodType.toLowerCase().includes(
        searchTerm.toLowerCase()
      );

    const matchesFilter =
      statusFilter === "all" || delivery.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const totalDeliveries = history.filter(
    (d) => d.status === "completed"
  ).length;

  const totalPoints = history
    .filter((d) => d.status === "completed")
    .reduce((sum, d) => sum + (d.points || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h2 className="font-display text-3xl font-bold text-ink mb-2">Delivery History</h2>
          <p className="text-mute">Track your completed deliveries</p>
        </div>
        <div className="flex gap-3">
          <div className="flow-tile px-4 py-2.5">
            <span className="font-display font-bold text-lg text-ngo-2 nums">{totalDeliveries}</span>
            <span className="text-xs text-mute ml-1.5">Completed</span>
          </div>
          <div className="flow-tile px-4 py-2.5">
            <span className="font-display font-bold text-lg text-rider-2 nums">{totalPoints}</span>
            <span className="text-xs text-mute ml-1.5">Points</span>
          </div>
        </div>
      </div>

      <div className="flow-panel overflow-hidden">
        <div className="p-5 border-b border-line">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute cursor-pointer left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute" />
              <input
                type="text"
                placeholder="Search by donor, NGO, or food type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flow-input has-icon"
              />
            </div>

            <div className="relative sm:w-44">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flow-input has-icon cursor-pointer"
              >
                <option value="all">All Status</option>
                <option value="completed">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="flow-empty flex-col items-center text-center py-14 mx-5 my-5">
            <div className="ei"><Package className="w-6 h-6" /></div>
            <div>
              <div className="et">No deliveries found</div>
              <div className="ed">Try adjusting your search or filter criteria</div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="flow-table">
              <thead>
                <tr>
                  <th>Date &amp; Time</th>
                  <th>Donor</th>
                  <th>NGO</th>
                  <th>Food Type</th>
                  <th>Status</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                {filteredHistory.map((delivery) => (
                  <tr key={delivery._id}>
                    <td>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-mute-2 shrink-0" />
                        <div>
                          <p className="font-medium text-ink nums">
                            {new Date(delivery.donation.updatedAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          <p className="text-xs text-mute nums">
                            {new Date(delivery.donation.updatedAt).toLocaleTimeString("en-IN", {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: false,
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="font-medium text-ink">{delivery.donor?.name}</td>
                    <td className="text-ink-2">{delivery.receiver?.name}</td>
                    <td className="text-ink-2">{delivery.donation.FoodType}</td>
                    <td>{getStatusBadge(delivery.status)}</td>
                    <td>
                      <p
                        className="font-semibold nums"
                        style={delivery?.points > 0 ? { color: "var(--color-ngo-2)" } : { color: "var(--color-mute-2)" }}
                      >
                        {delivery?.points > 0 ? `+${delivery?.points}` : "—"}
                      </p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
