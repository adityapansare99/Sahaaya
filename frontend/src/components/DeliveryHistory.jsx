import React, { useState } from "react";
import {
  Calendar,
  Filter,
  CheckCircle,
  XCircle,
  Search,
  Package,
} from "lucide-react";

const DeliveryHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const deliveryHistory = [
    {
      id: 1,
      date: "2025-01-15",
      time: "14:30",
      donor: "Rajesh Kumar",
      ngo: "Hope Foundation",
      foodType: "Fresh Meals",
      status: "Delivered",
      earnings: 50,
    },
    {
      id: 2,
      date: "2025-01-14",
      time: "11:15",
      donor: "Priya's Kitchen",
      ngo: "Children's Care Center",
      foodType: "Homemade Food",
      status: "Delivered",
      earnings: 40,
    },
    {
      id: 3,
      date: "2025-01-14",
      time: "16:45",
      donor: "Mumbai Darbar",
      ngo: "Elderly Care Home",
      foodType: "North Indian Cuisine",
      status: "Cancelled",
      earnings: 0,
    },
    {
      id: 4,
      date: "2025-01-13",
      time: "13:20",
      donor: "South Spice",
      ngo: "Street Children NGO",
      foodType: "South Indian Meals",
      status: "Delivered",
      earnings: 60,
    },
    {
      id: 5,
      date: "2025-01-12",
      time: "12:00",
      donor: "Healthy Bites",
      ngo: "Senior Citizen Home",
      foodType: "Healthy Salads",
      status: "Delivered",
      earnings: 35,
    },
  ];

  const filteredHistory = deliveryHistory.filter((delivery) => {
    const matchesSearch =
      delivery.donor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.ngo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      delivery.foodType.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      statusFilter === "all" || delivery.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Delivered":
        return (
          <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Delivered</span>
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center space-x-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            <XCircle className="w-4 h-4" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return (
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {status}
          </span>
        );
    }
  };

  const totalDeliveries = deliveryHistory.filter(
    (d) => d.status === "Delivered"
  ).length;
  const totalEarnings = deliveryHistory.reduce((sum, d) => sum + d.earnings, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Delivery History</h2>
          <p className="text-gray-600">Track your completed deliveries</p>
        </div>

        <div className="flex space-x-4">
          <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl">
            <span className="font-bold">{totalDeliveries}</span> Completed
          </div>
          <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-xl">
            <span className="font-bold">₹{totalEarnings}</span> Earned
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute cursor-pointer left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by donor, NGO, or food type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-10 pr-8 cursor-pointer py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-500 mb-2">
              No deliveries found
            </h3>
            <p className="text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Donor
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    NGO
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Food Type
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Earnings
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredHistory.map((delivery) => (
                  <tr
                    key={delivery.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(delivery.date).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                          <p className="text-sm text-gray-500">
                            {delivery.time}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900">
                        {delivery.donor}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-900">{delivery.ngo}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-gray-600">{delivery.foodType}</p>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(delivery.status)}
                    </td>
                    <td className="px-6 py-4">
                      <p
                        className={`font-semibold ${
                          delivery.earnings > 0
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {delivery.earnings > 0 ? `₹${delivery.earnings}` : "-"}
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
