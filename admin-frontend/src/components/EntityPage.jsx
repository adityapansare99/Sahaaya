import React, { useContext, useEffect, useState } from "react";
import { useAdmin } from "../context/AdminContext.jsx";
import Sidebar from "../components/Sidebar.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, CheckCircle, XCircle, Trash2 } from "lucide-react";

const EntityPage = ({ title, apiPath, columns, renderRow }) => {
  const { backendurl, token } = useAdmin();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetch = async (q) => {
    try {
      const res = await axios.get(`${backendurl}admin/${apiPath}${q ? `?search=${q}` : ""}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) setData(res.data.data);
      else toast.error("Failed to fetch data");
    } catch {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id) => {
    try {
      const res = await axios.put(`${backendurl}admin/${apiPath}/${id}/approve`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) { toast.success(res.data.message); fetch(); }
    } catch {
      toast.error("Error toggling approval");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const res = await axios.delete(`${backendurl}admin/${apiPath}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) { toast.success("Deleted successfully"); fetch(); }
    } catch {
      toast.error("Error deleting");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={(e) => { setSearch(e.target.value); fetch(e.target.value); }}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent w-72" />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="p-8 space-y-4">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : data.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No {title.toLowerCase()} found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {columns.map((c) => <th key={c} className="text-left p-4 font-semibold text-gray-900">{c}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {data.map((item) => renderRow(item, () => handleApprove(item._id), () => handleDelete(item._id)))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Badge = ({ condition, trueLabel = "Approved", falseLabel = "Pending", trueColor = "text-green-600 bg-green-100", falseColor = "text-yellow-600 bg-yellow-100" }) =>
  <span className={`px-2 py-1 rounded-full text-xs font-medium ${condition ? trueColor : falseColor}`}>
    {condition ? trueLabel : falseLabel}
  </span>;

const ActionButtons = ({ approved, onApprove, onDelete }) => (
  <div className="flex items-center gap-2">
    <button onClick={onApprove} title={approved ? "Disapprove" : "Approve"}
      className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
      {approved ? <XCircle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />}
    </button>
    <button onClick={onDelete} title="Delete"
      className="p-2 rounded-lg hover:bg-red-50 cursor-pointer transition-colors">
      <Trash2 className="w-5 h-5 text-gray-500" />
    </button>
  </div>
);

export { EntityPage, Badge, ActionButtons };
