import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import { Mail, Lock, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import FlowRibbon from "../components/flow/FlowRibbon";
import LiveChip from "../components/flow/LiveChip";

const Login = () => {
  const { backendurl, setToken, setRole } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("Donor");

  const navigate = useNavigate();

  const submitHandler = async () => {
    setRole(loginAs);
    localStorage.setItem("role", loginAs);

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
    } else if (loginAs === "Partner") {
      const response = await axios.post(`${backendurl}partner/login`, {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Error in partner login");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Login successfully");
      navigate("/PartnerDashboard");
    }
  };

  const labelCls =
    "font-display text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5 mb-1.5";

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-2">
      {/* LEFT — Flow dark panel */}
      <div className="flow-hero hidden md:flex flex-col justify-center px-10 lg:px-16">
        <div className="relative z-10 max-w-md">
          <div onClick={() => navigate("/")} className="inline-flex cursor-pointer">
            <Logo light />
          </div>
          <div className="mt-8">
            <LiveChip dark>Live · food on the move</LiveChip>
          </div>
          <h2 className="fh-stmt mt-5">Welcome back.</h2>
          <p className="fh-sub mt-3">Continue your journey of generous giving.</p>
          <div className="mt-10 flow-ribbon-scroll">
            <FlowRibbon />
          </div>
        </div>
      </div>

      {/* RIGHT — form */}
      <div className="flex items-center justify-center px-5 py-12 md:py-10">
        <div className="w-full max-w-md flow-tile p-7 md:p-9">
          <div className="md:hidden mb-7 flex justify-center">
            <Logo />
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">Sign in</h1>
          <p className="text-mute text-sm mt-1">to continue your generous journey</p>

          <div className="mt-7 space-y-4">
            <div>
              <label className={labelCls}>
                <Mail className="w-3.5 h-3.5 text-ngo" /> Email
              </label>
              <input
                className="flow-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-ngo" /> Password
              </label>
              <input
                id="password"
                className="flow-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <label className={labelCls}>
                <Users className="w-3.5 h-3.5 text-ngo" /> Login as
              </label>
              <select
                className="flow-input"
                value={loginAs}
                onChange={(e) => setLoginAs(e.target.value)}
              >
                <option value="Donor">Food Donor</option>
                <option value="Receiver">Food Receiver</option>
                <option value="Rider">Delivery Partner</option>
                <option value="Partner">Restaurant Partner</option>
              </select>
            </div>
          </div>

          <div className="text-right mt-3">
            <span
              onClick={() => navigate("/ForgotPassword")}
              className="text-sm text-ngo font-semibold cursor-pointer hover:underline"
            >
              Forgot password?
            </span>
          </div>

          <button
            onClick={() => {
              submitHandler();
            }}
            className="fbtn fbtn-flow w-full mt-5"
          >
            Sign in <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-center text-sm text-mute mt-6">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/Role")}
              className="text-ngo font-semibold cursor-pointer hover:underline inline-flex items-center gap-1"
            >
              Register <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
