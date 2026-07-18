import React, { useContext, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Filter } from "lucide-react";

const statusColor = (s) =>
  s === "Completed" ? "text-green-600 bg-green-100" :
  s === "Accepted" ? "text-yellow-600 bg-yellow-100" :
  s === "Pending" ? "text-blue-600 bg-blue-100" :
  s === "Cancelled" ? "text-red-600 bg-red-100" : "text-gray-600 bg-gray-100";

const Donations = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");

  const fetch = async (s) => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendurl}admin/donations${s && s !== "all" ? `?status=${s}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data.data);
    } catch { toast.error("Error fetching donations"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select value={status} onChange={(e) => { setStatus(e.target.value); fetch(e.target.value); }}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 cursor-pointer">
              <option value="all">All</option>
              <option value="Pending">Pending</option>
              <option value="Accepted">Accepted</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No donations found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Donor</th>
                    <th className="text-left p-4 font-semibold text-gray-900">NGO</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Food Type</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Quantity</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Weight</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Serves</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Expiry</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{item.Donor?.name || "—"}</td>
                      <td className="p-4 text-gray-600">{item.Ngo?.name || "—"}</td>
                      <td className="p-4 text-gray-900">{item.FoodType}</td>
                      <td className="p-4 text-gray-600">{item.Quantity}</td>
                      <td className="p-4 text-gray-600">{item.weightKg || 0} kg</td>
                      <td className="p-4 text-gray-600">{item.serves || 0}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(item.Status)}`}>{item.Status}</span></td>
                      <td className="p-4 text-gray-500">{new Date(item.ExpiryDate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Donations;
