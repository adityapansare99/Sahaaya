import React, { useContext, useState } from "react";
import {
  Mail,
  Lock,
  Users,
  Heart,
  Star,
  Sparkles,
  ArrowRight,
  LogIn,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const { backendurl, setToken } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("Donor");

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (loginAs === "Donor") {
      const response = await axios.post(`${backendurl}donor/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Error in donor registration");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Login successfully");
      navigate("/DonorDashboard");

      console.log(response.data.data);
    } else if (loginAs === "Receiver") {
      const response = await axios.post(`${backendurl}ngo/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Error in Ngo registration");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Login successfully");
      navigate("/NgoDashboard");
    } else if (loginAs === "Rider") {
      const response = await axios.post(`${backendurl}delivery/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Error in rider registration");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Login successfully");
      navigate("/RiderDashboard");
    }
  };

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 bg-linear-gradient-to-br from-red-50/20 via-white to-red-50/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-linear-gradient-to-r from-transparent via-red-200 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-linear-gradient-to-l from-transparent via-red-200 to-transparent"></div>

      {/* Floating Decorative Elements */}
      <div className="absolute top-20 left-10 opacity-10">
        <Heart className="w-8 h-8 text-red-500 animate-pulse" />
      </div>
      <div className="absolute top-40 right-20 opacity-10">
        <Star
          className="w-6 h-6 text-red-500 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </div>
      <div className="absolute bottom-40 left-20 opacity-10">
        <Sparkles
          className="w-7 h-7 text-red-500 animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="relative md:grid md:grid-cols-7 md:w-full md:min-h-screen">
        {/* Left Side - Elegant Logo Section */}
        <div className="w-full md:col-span-3 md:flex items-center justify-center min-h-[50vh] md:min-h-screen hidden bg-linear-gradient-to-br from-red-50/30 via-white to-red-50/20 relative">
          {/* Subtle Geometric Patterns */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-300 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-red-200 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/2 w-16 h-16 border border-red-400 rounded-full"></div>
          </div>

          <div className="text-center fixed top-[40vh] h-screen z-10 px-8">
            <div
              onClick={() => {
                navigate("/");
              }}
              className="relative cursor-pointer"
            >
              <img
                className="w-64 mx-auto drop-shadow-xl hover:scale-105 transition-all duration-700 ease-out filter brightness-110"
                src="https://res.cloudinary.com/dvdwjzjvf/image/upload/v1758366445/project/Sahaaya/Minimalistic_Sahaaya_Logo_Design_cxghbe_skvums.png"
                alt="Sahaaya Logo"
              />
              <div className="absolute -inset-4 bg-linear-gradient-to-r from-red-500/10 via-transparent to-red-500/10 rounded-full blur-xl opacity-0 hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            <div className="mt-8 space-y-3">
              <h2 className="text-2xl font-light text-gray-800 tracking-wide">
                Welcome back to{" "}
                <span className="font-bold text-red-500">Sahaaya</span>
              </h2>
              <p className="text-gray-600 font-light leading-relaxed max-w-sm mx-auto">
                Continue your journey of generous giving
              </p>
              <div className="flex justify-center space-x-2 mt-4">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <div
                  className="w-2 h-2 bg-red-400 rounded-full animate-pulse"
                  style={{ animationDelay: "0.5s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-red-300 rounded-full animate-pulse"
                  style={{ animationDelay: "1s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Content */}
        <div className="flex md:mx-10 md:px-10 mx-4 md:col-span-4 my-6 md:my-8 flex-col items-center justify-center relative">
          <div className="w-full bg-white/95 max-w-2xl backdrop-blur-sm md:px-15 px-6 md:py-12 py-8 shadow-2xl rounded-3xl border border-gray-100/80 relative overflow-hidden">
            {/* Elegant Header Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-linear-gradient-to-r from-red-500/80 via-red-400 to-red-500/80"></div>
            <div className="absolute top-1 left-0 right-0 h-px bg-linear-gradient-to-r from-transparent via-white/60 to-transparent"></div>

            {/* Login Header */}
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-linear-gradient-to-r from-red-50 to-red-100 rounded-2xl">
                  <LogIn className="w-12 h-12 text-red-500" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-red-500 mb-2 tracking-tight">
                Welcome Back
              </h1>
              <div className="w-20 h-1 bg-linear-gradient-to-r from-red-500 to-red-400 mx-auto rounded-full mb-3"></div>
              <p className="text-gray-700 font-light leading-relaxed">
                Sign in to continue your generous journey
              </p>
            </div>

            {/* Elegant Form Fields */}
            <div className="space-y-5 mb-6">
              <div className="group" style={{ animationDelay: `${1 * 0.1}s` }}>
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <Mail className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Email Address
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                  placeholder="example@gmail.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="group" style={{ animationDelay: `${1 * 0.1}s` }}>
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <Lock className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Password
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <input id="password"
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              {/* Login As Selection */}
              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <Users className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Login as <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <select
                  value={loginAs}
                  onChange={(e) => setLoginAs(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer font-medium"
                >
                  <option value="Donor">Food Donor</option>
                  <option value="Receiver">Food Receiver</option>
                  <option value="Rider">Delivery Partner</option>
                </select>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="text-right mb-6">
              <span className="text-red-500 cursor-pointer font-medium hover:text-red-600 hover:underline transition-all duration-200">
                Forgot Password?
              </span>
            </div>

            {/* Elegant Submit Button */}
            <button
              onClick={() => {
                submitHandler();
              }}
              className="relative w-full p-4 cursor-pointer text-lg text-center rounded-2xl bg-linear-gradient-to-r from-red-500 to-red-600 text-white font-bold mb-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 hover:from-red-600 hover:to-red-700 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-linear-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center space-x-3">
                <UserCheck className="w-6 h-6" />
                <span className="tracking-wide text-gray-800 font-bold">Sign in to Continue</span>
              </span>
            </button>

            {/* Elegant Registration Link */}
            <div className="text-center">
              <p className="text-gray-700 font-light">
                Don't have an account?{" "}
                <span
                  onClick={() => navigate("/Role")}
                  className="text-red-500 cursor-pointer font-semibold hover:text-red-600 hover:underline transition-all duration-200 inline-flex items-center group"
                >
                  Register here
                  <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                    →
                  </span>
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
