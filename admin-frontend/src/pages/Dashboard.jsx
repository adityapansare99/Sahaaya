import React, { useContext, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Heart, Users, Bike, Store, Package, Truck, TrendingUp } from "lucide-react";

const StatCard = ({ title, icon: Icon, data, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <TrendingUp className="w-5 h-5 text-gray-400" />
    </div>
    <div className="text-3xl font-bold text-gray-900 mb-1">{data?.total || 0}</div>
    <div className="text-sm font-medium text-gray-700 mb-2">{title}</div>
    <div className="flex items-center gap-3 text-xs">
      <span className="text-green-600 font-medium">{data?.approved || 0} approved</span>
      <span className="text-gray-300">|</span>
      <span className="text-yellow-600 font-medium">{data?.pending || 0} pending</span>
    </div>
  </div>
);

const Dashboard = () => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get(`${backendurl}admin/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data.success) setData(res.data.data);
        else toast.error("Failed to load dashboard");
      } catch { toast.error("Error loading dashboard"); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm animate-pulse">
              <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
              <div className="h-8 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const cards = [
    { title: "NGOs", icon: Heart, data: data?.ngos, color: "bg-red-500" },
    { title: "Donors", icon: Users, data: data?.donors, color: "bg-blue-500" },
    { title: "Delivery Partners", icon: Bike, data: data?.delivery, color: "bg-green-500" },
    { title: "Restaurant Partners", icon: Store, data: data?.partners, color: "bg-purple-500" },
    { title: "Donations", icon: Package, data: data?.donations, color: "bg-orange-500" },
    { title: "Rides", icon: Truck, data: { total: data?.rides?.total || 0 }, color: "bg-teal-500" },
  ];

  const statusColor = (s) =>
    s === "Completed" ? "text-green-600 bg-green-100" :
    s === "Accepted" ? "text-yellow-600 bg-yellow-100" :
    s === "Pending" ? "text-blue-600 bg-blue-100" :
    s === "Cancelled" ? "text-red-600 bg-red-100" : "text-gray-600 bg-gray-100";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {cards.map((c) => <StatCard key={c.title} {...c} />)}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Donations</h3>
          {data?.recentDonations?.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left p-3 font-semibold text-gray-900">Donor</th>
                    <th className="text-left p-3 font-semibold text-gray-900">NGO</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Food Type</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Status</th>
                    <th className="text-left p-3 font-semibold text-gray-900">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {data.recentDonations.map((d) => (
                    <tr key={d._id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="p-3 text-gray-900">{d.Donor?.name || "—"}</td>
                      <td className="p-3 text-gray-600">{d.Ngo?.name || "—"}</td>
                      <td className="p-3 text-gray-900">{d.FoodType}</td>
                      <td className="p-3"><span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColor(d.Status)}`}>{d.Status}</span></td>
                      <td className="p-3 text-gray-500">{new Date(d.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">No donations yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
