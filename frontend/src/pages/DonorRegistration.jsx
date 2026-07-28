import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import {
  Upload,
  Building2,
  User,
  MapPin,
  Hash,
  Phone,
  Mail,
  Lock,
  CheckCircle,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import LocationInput from "../components/LocationInput";

const DonorRegistration = () => {
  const { backendurl, setToken } = useContext(AppContext);
  const [typeOfDonor, setTypeOfDonor] = useState("");
  const [image, setImage] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [addressCoords, setAddressCoords] = useState({ lat: null, lng: null });
  const [pincode, setPincode] = useState("");
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
      address,
      pincode,
      phone,
      email,
      password,
      latitude: addressCoords.lat,
      longitude: addressCoords.lng,
    };

    // console.log(data);

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (image) {
      formData.append("image", image);
    }

    const response = await axios.post(`${backendurl}donor/register`, formData);

    if (!response.data.success) {
      toast.error(response.data.message || "Error in donor registration");
      return;
    }

    setToken(response.data.data.token);
    localStorage.setItem("token", response.data.data.token);
    toast.success("Donor registered successfully");
    navigate("/DonorDashboard");
    // console.log(response.data.data.token);
    // console.log(response.data);
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

        {!typeOfDonor ? (
          /* Donor Type Selection */
          <div>
            <div className="text-center mb-7">
              <h1 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight">
                Become a <span className="text-donor">donor</span>
              </h1>
              <p className="text-mute text-sm mt-2">
                Choose how you'd like to contribute
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className={labelCls}>
                  <Users className="w-3.5 h-3.5 text-donor" /> Register as{" "}
                  <span className="text-donor">*</span>
                </label>
                <select
                  onChange={(e) => setTypeOfDonor(e.target.value)}
                  value={typeOfDonor}
                  className="flow-input"
                >
                  <option value="">Select donor type</option>
                  <option value="Organization">Organization</option>
                  <option value="Individual">Individual</option>
                </select>
              </div>
            </div>

            <p className="text-center text-sm text-mute mt-5">
              Already have an account?{" "}
              <span
                onClick={() => navigate("/Login")}
                className="text-donor font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <button
              onClick={() => setTypeOfDonor("")}
              className="flex items-center gap-1.5 text-mute hover:text-ink mb-5 cursor-pointer text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Back to selection
            </button>

            <div className="text-center mb-7">
              <h1 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight">
                <span className="text-donor">Donor</span> registration
              </h1>
              <p className="text-mute text-sm mt-2">
                Join our community of generous donors
              </p>
            </div>

            {/* Image Upload */}
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
                    alt={typeOfDonor === "Organization" ? "Organization logo" : "Donor photo"}
                  />
                  <div className="absolute -bottom-1 -right-1 bg-donor text-white rounded-full p-2 shadow-md transition-transform group-hover:scale-110">
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
                {!image
                  ? typeOfDonor === "Organization"
                    ? "Upload logo"
                    : "Upload photo"
                  : typeOfDonor === "Organization"
                  ? "Your logo"
                  : "Your photo"}
              </p>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {typeOfDonor === "Organization" ? (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      <Building2 className="w-3.5 h-3.5 text-donor" /> Organization
                      Name <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="Enter your organization name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <MapPin className="w-3.5 h-3.5 text-donor" /> Organization
                      Address <span className="text-donor">*</span>
                    </label>
                    <LocationInput
                      value={address}
                      onChange={setAddress}
                      onSelect={setAddressCoords}
                      placeholder="Complete address with city and state"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Hash className="w-3.5 h-3.5 text-donor" /> Organization
                      Pincode <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="000000"
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Phone className="w-3.5 h-3.5 text-donor" /> Phone Number{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="+91 00000 00000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Mail className="w-3.5 h-3.5 text-donor" /> Email Address{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="organization@example.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        <Lock className="w-3.5 h-3.5 text-donor" /> Password{" "}
                        <span className="text-donor">*</span>
                      </label>
                      <input
                        className="flow-input"
                        placeholder="Create a strong password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        <Lock className="w-3.5 h-3.5 text-donor" /> Confirm
                        Password <span className="text-donor">*</span>
                      </label>
                      <input
                        className="flow-input"
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>
                      <User className="w-3.5 h-3.5 text-donor" /> Full Name{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="Enter your full name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <MapPin className="w-3.5 h-3.5 text-donor" /> Your Address{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <LocationInput
                      value={address}
                      onChange={setAddress}
                      onSelect={setAddressCoords}
                      placeholder="Complete address with city and state"
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Hash className="w-3.5 h-3.5 text-donor" /> Your Pincode{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="000000"
                      type="text"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Phone className="w-3.5 h-3.5 text-donor" /> Phone Number{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="+91 00000 00000"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div>
                    <label className={labelCls}>
                      <Mail className="w-3.5 h-3.5 text-donor" /> Email Address{" "}
                      <span className="text-donor">*</span>
                    </label>
                    <input
                      className="flow-input"
                      placeholder="example@gmail.com"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>
                        <Lock className="w-3.5 h-3.5 text-donor" /> Password{" "}
                        <span className="text-donor">*</span>
                      </label>
                      <input
                        className="flow-input"
                        placeholder="Create a strong password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <div>
                      <label className={labelCls}>
                        <Lock className="w-3.5 h-3.5 text-donor" /> Confirm
                        Password <span className="text-donor">*</span>
                      </label>
                      <input
                        className="flow-input"
                        placeholder="Re-enter your password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Terms and Conditions */}
            <div
              onClick={() => setChecked(!checked)}
              className="flex items-start gap-2.5 mt-6 cursor-pointer"
            >
              <div
                className={
                  "mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors " +
                  (checked ? "bg-donor border-donor" : "border-line bg-surface")
                }
              >
                {checked && <CheckCircle className="w-4 h-4 text-white" />}
              </div>
              <label
                htmlFor="terms"
                className="text-sm text-ink-2 leading-relaxed select-none"
              >
                I agree to the{" "}
                <span className="text-donor font-semibold">
                  Terms and Conditions
                </span>{" "}
                and <span className="text-donor font-semibold">Privacy Policy</span>
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
                className="text-donor font-semibold cursor-pointer hover:underline"
              >
                Sign in
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonorRegistration;
