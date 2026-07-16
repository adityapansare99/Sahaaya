import React, { useEffect, useState } from "react";
import { Calendar, User, Package, Filter } from "lucide-react";
import { formatAmount } from "../utils/formatDonation";

const DonationHistory = ({acceptedOrder,filtered,setFiltered }) => {
  const [filter, setFilter] = useState("all");

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "accepted":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    filteredDonations();
  }, [filter]);

  useEffect(() => {}, [acceptedOrder.response]);

  const filteredDonations = () => {
    const temp= filter === "all"
      ? acceptedOrder.response
      : acceptedOrder.response.filter((d) =>
          d.Status.toLowerCase().includes(filter)
        );

    setFiltered(temp);
  };

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Received Donations</h2>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border cursor-pointer border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="accepted">Accepted</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-gray-900">
            {acceptedOrder.total}
          </div>
          <div className="text-sm text-gray-500">Total Received</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {acceptedOrder.completed}
          </div>
          <div className="text-sm text-gray-500">Successfully Completed</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-yellow-600">
            {acceptedOrder.pending}
          </div>
          <div className="text-sm text-gray-500">Successfully Accepted</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="text-2xl font-bold text-red-600">
            {acceptedOrder?.cancelled || 0}
          </div>
          <div className="text-sm text-gray-500">Cancelled Donations</div>
        </div>
      </div>

      {/* Donations Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Date
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Donor
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Food Type
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Amount
                </th>
                <th className="text-left p-4 font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered?.map((donation, index) => (
                <tr
                  key={donation._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-25"}
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {new Date(donation.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">
                        {donation.Donor.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {donation.typeOfDonor}
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">
                        {donation.FoodType}
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-900">
                      {formatAmount(donation)}
                    </span>
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        donation.Status
                      )}`}
                    >
                      {donation.Status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DonationHistory;
