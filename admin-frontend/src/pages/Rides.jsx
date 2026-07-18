import React, { useContext, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";
import { toast } from "react-toastify";

const statusColor = (s) =>
  s === "completed" ? "text-green-600 bg-green-100" :
  s === "accepted" ? "text-yellow-600 bg-yellow-100" :
  s === "picked up" ? "text-blue-600 bg-blue-100" :
  s === "pending" ? "text-purple-600 bg-purple-100" : "text-gray-600 bg-gray-100";

const Rides = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendurl}admin/rides`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setData(res.data.data);
      } catch { toast.error("Error fetching rides"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Rides</h1>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No rides found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    <th className="text-left p-4 font-semibold text-gray-900">Donor</th>
                    <th className="text-left p-4 font-semibold text-gray-900">NGO</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Rider</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Pickup</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Destination</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-4 font-semibold text-gray-900">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => (
                    <tr key={item._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-4 font-medium text-gray-900">{item.donor?.name || "—"}</td>
                      <td className="p-4 text-gray-600">{item.receiver?.name || "—"}</td>
                      <td className="p-4 text-gray-600">{item.rider?.name || "—"}</td>
                      <td className="p-4 text-gray-600">{item.pickup}</td>
                      <td className="p-4 text-gray-600">{item.destination}</td>
                      <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColor(item.status)}`}>{item.status}</span></td>
                      <td className="p-4 text-gray-600">{item.distance || "—"}</td>
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

export default Rides;
