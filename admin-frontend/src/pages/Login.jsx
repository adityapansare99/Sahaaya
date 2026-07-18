import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldAlert, Lock, Mail } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { backendurl, login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendurl}admin/login`, { email, password });
      if (res.data.success) {
        login(res.data.data.token);
        toast.success("Welcome, Admin!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-gray-500 mt-1">Sahaaya Management Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />Email
            </label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Lock className="w-4 h-4 inline mr-2" />Password
            </label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-red-500 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
