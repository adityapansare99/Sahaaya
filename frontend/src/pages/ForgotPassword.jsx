import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, ArrowLeft, RefreshCw } from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

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

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
        {/* Back button */}
        <button onClick={() => step === 1 ? navigate("/Login") : setStep(step - 1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= s ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"
              }`}>{s}</div>
              {s < 3 && <div className={`w-8 h-1 ${step > s ? "bg-red-500" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-7 h-7 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">
            {step === 1 && "Enter your email and account type"}
            {step === 2 && "Enter the OTP sent to your email"}
            {step === 3 && "Create a new password"}
          </p>
        </div>

        {/* Step 1: Email + User Type */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Mail className="w-4 h-4 inline mr-1" /> Email
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Account Type</label>
              <select value={userType} onChange={(e) => setUserType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 cursor-pointer">
                {userTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-500 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {/* Step 2: Enter OTP */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <p className="text-sm text-gray-600 text-center">OTP sent to <span className="font-medium">{email}</span></p>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <ShieldCheck className="w-4 h-4 inline mr-1" /> Enter OTP
              </label>
              <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))} required
                placeholder="6-digit OTP" maxLength={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500 text-center text-2xl tracking-widest" />
            </div>
            <button type="submit" disabled={loading || otp.length !== 6}
              className="w-full bg-red-500 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <div className="text-center">
              <button type="button" onClick={handleResendOtp} disabled={resending}
                className="text-red-500 cursor-pointer text-sm font-medium hover:text-red-600 inline-flex items-center gap-1">
                <RefreshCw className={`w-3 h-3 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Resending..." : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Lock className="w-4 h-4 inline mr-1" /> New Password
              </label>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required
                placeholder="Min 6 characters"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Lock className="w-4 h-4 inline mr-1" /> Confirm Password
              </label>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-red-500" />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-red-500 cursor-pointer text-white py-3 rounded-xl font-semibold hover:bg-red-600 transition disabled:opacity-50">
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
