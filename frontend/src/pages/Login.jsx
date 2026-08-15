import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import { Mail, Lock, Users, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import FlowRibbon from "../components/flow/FlowRibbon";
import LiveChip from "../components/flow/LiveChip";
import FlowSelect from "../components/flow/FlowSelect";
import FlowLoader from "../components/flow/FlowLoader";

const Login = () => {
  const { backendurl, setToken, setRole } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginAs, setLoginAs] = useState("Donor");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const submitHandler = async () => {
    setLoading(true);
    setRole(loginAs);
    localStorage.setItem("role", loginAs);

    const routes = {
      Donor: { url: "donor/login", dest: "/DonorDashboard" },
      Receiver: { url: "ngo/login", dest: "/NgoDashboard" },
      Rider: { url: "delivery/login", dest: "/RiderDashboard" },
      Partner: { url: "partner/login", dest: "/PartnerDashboard" },
    };
    const cfg = routes[loginAs];

    try {
      const response = await axios.post(`${backendurl}${cfg.url}`, {
        email,
        password,
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Login failed");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Login successful");
      navigate(location.state?.from || cfg.dest, { replace: true });
    } catch {
      toast.error("Login failed. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const labelCls =
    "font-display text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5 mb-1.5";

  return (
    <div className="min-h-screen bg-canvas md:grid md:grid-cols-2">
      {loading && <FlowLoader fullScreen label="Signing you in…" />}
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
              <FlowSelect
                value={loginAs}
                onChange={(v) => setLoginAs(v)}
                ariaLabel="Login as"
                options={[
                  { value: "Donor", label: "Food Donor" },
                  { value: "Receiver", label: "Food Receiver" },
                  { value: "Rider", label: "Delivery Partner" },
                  { value: "Partner", label: "Restaurant Partner" },
                ]}
              />
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
            disabled={loading}
            className="fbtn fbtn-flow w-full mt-5"
          >
            {loading ? "Signing in…" : "Sign in"} {!loading && <ArrowRight className="w-4 h-4" />}
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
