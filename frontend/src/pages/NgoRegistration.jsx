import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import FlowSelect from "../components/flow/FlowSelect";
import {
  Upload,
  Building2,
  MapPin,
  Hash,
  Phone,
  Mail,
  Lock,
  Users,
  FileText,
  Shield,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import LocationInput from "../components/LocationInput";

const NgoRegistration = () => {
  const { backendurl, setToken } = useContext(AppContext);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressCoords, setAddressCoords] = useState({ lat: null, lng: null });
  const [contactPerson, setContactPerson] = useState("");
  const [DailyCapacity, setDailyCapacity] = useState("");
  const [RegistrationNumber, setRegistrationNumber] = useState("");
  const [typeofNgo, settypeofNgo] = useState("Trust");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [checked, setChecked] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async () => {
    if (!checked) {
      toast.error("Please accept the terms and conditions");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const data = {
      name,
      email,
      phone,
      address,
      contactPerson,
      DailyCapacity,
      password,
      RegistrationNumber,
      typeofNgo,
      latitude: addressCoords.lat,
      longitude: addressCoords.lng,
    };

    const formData = new FormData();

    formData.append("data", JSON.stringify(data));

    if (image) {
      formData.append("image", image);
    }

    const response = await axios.post(`${backendurl}ngo/register`, formData);

    if (!response.data.success) {
      toast.error(response.data.message || "Error in donor registration");
      return;
    }

    setToken(response.data.data.token);
    localStorage.setItem("token", response.data.data.token);
    toast.success("NGO registered successfully");
    navigate("/NgoDashboard");
  };

  const labelCls =
    "font-display text-xs font-semibold uppercase tracking-wider text-ink-2 flex items-center gap-1.5 mb-1.5";

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-4 py-10">
      <div className="flow-tile p-6 md:p-8 w-full max-w-xl">
        <div className="flex justify-center mb-6">
          <div onClick={() => navigate("/")} className="inline-flex cursor-pointer">
            <Logo size="lg" />
          </div>
        </div>

        {/* Form Header */}
        <div className="text-center mb-7">
          <h1 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight">
            <span className="text-ngo">NGO</span> registration
          </h1>
          <p className="text-mute text-sm mt-2">
            Receive food donations from donors near you
          </p>
        </div>

        {/* Image Upload Section */}
        <div className="mb-7 flex flex-col items-center">
          <label htmlFor="image" className="cursor-pointer group block">
            <div className="relative">
              <img
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border border-line bg-surface-2 transition-transform group-hover:scale-[1.03]"
                src={
                  image
                    ? URL.createObjectURL(image)
                    : "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                }
                alt="NGO photo"
              />
              <div className="absolute -bottom-1 -right-1 bg-ngo text-white rounded-full p-2 shadow-md transition-transform group-hover:scale-110">
                <Upload className="w-3.5 h-3.5" />
              </div>
            </div>
            <input
              type="file"
              id="image"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
          <p className="font-display text-xs font-semibold uppercase tracking-wider text-ink-2 mt-3">
            {!image ? "Upload photo" : "Your photo"}
          </p>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <label className={labelCls}>
              <Building2 className="w-3.5 h-3.5 text-ngo" /> NGO Name{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="Sahaaya Foundation"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <MapPin className="w-3.5 h-3.5 text-ngo" /> Address{" "}
              <span className="text-ngo">*</span>
            </label>
            <LocationInput
              value={address}
              onChange={setAddress}
              onSelect={setAddressCoords}
              placeholder="Sector 15, Phase 2, Gurgaon, Haryana - 122001"
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <Hash className="w-3.5 h-3.5 text-ngo" /> Contact Person{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="Mrs. Priya Sharma"
              type="text"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <Phone className="w-3.5 h-3.5 text-ngo" /> Phone Number{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="+91 98765 43210"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <Mail className="w-3.5 h-3.5 text-ngo" /> Email{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="contact@sahaayafoundation.org"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-ngo" /> Password{" "}
                <span className="text-ngo">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="Create a strong password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-ngo" /> Confirm Password{" "}
                <span className="text-ngo">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              <Users className="w-3.5 h-3.5 text-ngo" /> Daily Capacity{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="500"
              type="number"
              value={DailyCapacity}
              onChange={(e) => setDailyCapacity(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <FileText className="w-3.5 h-3.5 text-ngo" /> Registration Number{" "}
              <span className="text-ngo">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="NGO/2018/0045789"
              type="text"
              value={RegistrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
              required
            />
          </div>

          <div>
            <label className={labelCls}>
              <Shield className="w-3.5 h-3.5 text-ngo" /> Type of NGO{" "}
              <span className="text-ngo">*</span>
            </label>
            <FlowSelect
              value={typeofNgo}
              onChange={(v) => settypeofNgo(v)}
              ariaLabel="Type of NGO"
              placeholder="Select NGO type"
              options={[
                { value: "trust", label: "Trust (Registered under the Indian Trusts Act)" },
                { value: "society", label: "Society (Registered under the Societies Registration Act, 1860)" },
                { value: "company", label: "Section 8 Company (Non-Profit Company) (Under Companies Act, 2013)" },
                { value: "shg", label: "Co-operative Society / Self-Help Group (SHG) (if applicable)" },
                { value: "charitable", label: "Charitable Foundation" },
                { value: "community", label: "Religious / Community Organization" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
        </div>

        {/* Terms and Conditions */}
        <div
          onClick={() => setChecked(!checked)}
          className="flex items-start gap-2.5 mt-6 cursor-pointer"
        >
          <div
            className={
              "mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors " +
              (checked ? "bg-ngo border-ngo" : "border-line bg-surface")
            }
          >
            {checked && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <label
            htmlFor="terms"
            className="text-sm text-ink-2 leading-relaxed select-none"
          >
            I agree to the{" "}
            <span className="text-ngo font-semibold">Terms and Conditions</span>{" "}
            and <span className="text-ngo font-semibold">Privacy Policy</span>
          </label>
        </div>

        {/* Submit Button */}
        <button
          onClick={() => submitHandler()}
          className="fbtn fbtn-flow w-full mt-6"
        >
          Register <ArrowRight className="w-4 h-4" />
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-mute mt-5">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/Login")}
            className="text-ngo font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default NgoRegistration;
