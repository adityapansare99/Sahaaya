import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import Logo from "../components/flow/Logo";
import FlowSelect from "../components/flow/FlowSelect";

const ForgotPassword = () => {
  const { backendurl } = useContext(AppContext);
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [userType, setUserType] = useState("donor");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const userTypes = [
    { value: "donor", label: "Food Donor" },
    { value: "ngo", label: "NGO (Food Receiver)" },
    { value: "delivery", label: "Delivery Partner" },
    { value: "partner", label: "Restaurant Partner" },
  ];

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendurl}forgot/send-otp`, { email, userType });
      if (res.data.success) {
        toast.success("OTP sent to your email");
        setStep(2);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${backendurl}forgot/verify-otp`, { email, otp });
      if (res.data.success) {
        setResetToken(res.data.data.resetToken);
        toast.success("OTP verified");
        setStep(3);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResending(true);
    try {
      const res = await axios.post(`${backendurl}forgot/send-otp`, { email, userType });
      if (res.data.success) toast.success("OTP resent");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${backendurl}forgot/reset-password`, { resetToken, newPassword });
      if (res.data.success) {
        toast.success("Password reset successfully");
        navigate("/Login");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  const labelCls =
    "font-display text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5 mb-1.5";

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md flow-tile p-7 md:p-8">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        <button
          onClick={() => (step === 1 ? navigate("/Login") : setStep(step - 1))}
          className="flex items-center gap-1.5 text-mute hover:text-ink mb-5 cursor-pointer text-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-7">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-display " +
                  (step >= s
                    ? "bg-ngo text-white"
                    : "bg-surface-2 text-mute-2 border border-line")
                }
              >
                {s}
              </div>
              {s < 3 && (
                <div
                  className={"w-8 h-1 rounded-full " + (step > s ? "bg-ngo" : "bg-line")}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <h2 className="font-display text-xl font-bold text-ink">Reset password</h2>
          <p className="text-sm text-mute mt-1">
            {step === 1 && "Enter your email and account type"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {/* Step 1: Email + User Type */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className={labelCls}>
                <Mail className="w-3.5 h-3.5 text-ngo" /> Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="flow-input"
              />
            </div>
            <div>
              <label className={labelCls}>Account type</label>
              <FlowSelect
                value={userType}
                onChange={(v) => setUserType(v)}
                ariaLabel="Account type"
                options={userTypes}
              />
            </div>
            <button type="submit" disabled={loading} className="fbtn fbtn-flow w-full">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-mute text-center">
              OTP sent to <span className="font-semibold text-ink nums">{email}</span>
            </p>
            <div>
              <label className={labelCls}>
                <ShieldCheck className="w-3.5 h-3.5 text-ngo" /> Enter OTP
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                placeholder="6-digit OTP"
                maxLength={6}
                className="flow-input nums"
                style={{ textAlign: "center", fontSize: "1.6rem", letterSpacing: ".4em" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="fbtn fbtn-flow w-full"
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resending}
                className="text-ngo cursor-pointer text-sm font-semibold hover:underline inline-flex items-center gap-1.5"
              >
                <RefreshCw className={"w-3.5 h-3.5 " + (resending ? "animate-spin" : "")} />
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-ngo" /> New password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Min 6 characters"
                className="flow-input"
              />
            </div>
            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-ngo" /> Confirm password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                className="flow-input"
              />
            </div>
            <button type="submit" disabled={loading} className="fbtn fbtn-flow w-full">
              {loading ? "Resetting..." : "Reset password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
