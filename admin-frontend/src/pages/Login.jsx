import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { ShieldCheck, Lock, Mail, ArrowRight } from "lucide-react";
import Logo from "../components/flow/Logo.jsx";
import FlowButton from "../components/flow/FlowButton.jsx";
import FlowRibbon from "../components/flow/FlowRibbon.jsx";

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
      const res = await axios.post(`${backendurl}admin/login`, {
        email,
        password,
      });
      if (res.data.success) {
        login(res.data.data.token);
        toast.success("Welcome, Admin!");
        navigate("/home");
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
    <div className="flow-hero login-hero">
      <div className="login-grid">
        <div className="login-stmt-col">
          <Logo size="md" light subtitle={false} />
          <div className="login-eyebrow">Operations Console</div>
          <h1 className="login-stmt">
            Oversight of the entire{" "}
            <span className="flow-grad-text">surplus-to-plate</span> pipeline.
          </h1>
          <p className="login-sub">
            Approve partners, track every donation from donor to NGO to rider,
            and keep the city&apos;s food moving — all from one console.
          </p>
          <div className="login-ribbon">
            <FlowRibbon />
          </div>
        </div>

        <div className="login-card-col">
          <form className="flow-panel login-card" onSubmit={handleSubmit}>
            <div className="login-card-head">
              <div className="login-badge">
                <ShieldCheck />
              </div>
              <div>
                <div className="login-card-title">Admin sign in</div>
                <div className="login-card-sub">Sahaaya management panel</div>
              </div>
            </div>

            <label className="login-field">
              <span className="login-label">
                <Mail /> Email
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@sahaaya.org"
                className="flow-input"
              />
            </label>

            <label className="login-field">
              <span className="login-label">
                <Lock /> Password
              </span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="flow-input"
              />
            </label>

            <FlowButton
              variant="flow"
              type="submit"
              disabled={loading}
              className="login-submit"
            >
              {loading ? (
                "Signing in…"
              ) : (
                <>
                  Sign in <ArrowRight />
                </>
              )}
            </FlowButton>

            <p className="login-foot">
              Authorized personnel only · access is audited
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
