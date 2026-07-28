import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import {
  Upload,
  User,
  MapPin,
  Phone,
  Mail,
  Lock,
  Truck,
  FileText,
  Bike,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import LocationInput from "../components/LocationInput";

const RiderRegistration = () => {
  const { backendurl, setToken } = useContext(AppContext);

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressCoords, setAddressCoords] = useState({ lat: null, lng: null });
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emergencyNumber, setEmergencyNumber] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleNumber, setVehicleNumber] = useState("");
  const [typeOfVehicle, setTypeOfVehicle] = useState("Bicycle");
  const [confirmPassword, setconfirmPassword] = useState("");
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
      address: address.address || address,
      phone,
      email,
      password,
      emergencyNumber,
      vehicleCapacity,
      licenseNumber,
      vehicleNumber,
      typeOfVehicle,
      latitude: addressCoords.lat,
      longitude: addressCoords.lng,
    };

    const formData = new FormData();
    formData.append("data", JSON.stringify(data));

    if (image) {
      formData.append("image", image);
    }

    const response = await axios.post(
      `${backendurl}delivery/register`,
      formData
    );

    if (!response.data.success) {
      toast.error(response.data.message || "Error in donor registration");
      return;
    }

    setToken(response.data.data.token);
    localStorage.setItem("token", response.data.data.token);
    toast.success("Rider registered successfully");
    navigate("/RiderDashboard");
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

        <div className="text-center mb-7">
          <h1 className="font-display font-bold text-ink text-2xl md:text-3xl tracking-tight">
            <span className="text-rider">Delivery Partner</span> registration
          </h1>
          <p className="text-mute text-sm mt-2">
            Help move surplus food to those who need it
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
                alt="Delivery Partner photo"
              />
              <div className="absolute -bottom-1 -right-1 bg-rider text-white rounded-full p-2 shadow-md transition-transform group-hover:scale-110">
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
              <User className="w-3.5 h-3.5 text-rider" /> Full Name{" "}
              <span className="text-rider">*</span>
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
              <MapPin className="w-3.5 h-3.5 text-rider" /> Address{" "}
              <span className="text-rider">*</span>
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
              <Phone className="w-3.5 h-3.5 text-rider" /> Phone Number{" "}
              <span className="text-rider">*</span>
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
              <Mail className="w-3.5 h-3.5 text-rider" /> Email Address{" "}
              <span className="text-rider">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="example@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              <Phone className="w-3.5 h-3.5 text-rider" /> Emergency Contact{" "}
              <span className="text-rider">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="+91 00000 11111"
              type="tel"
              value={emergencyNumber}
              onChange={(e) => setEmergencyNumber(e.target.value)}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-rider" /> Password{" "}
                <span className="text-rider">*</span>
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
                <Lock className="w-3.5 h-3.5 text-rider" /> Confirm Password{" "}
                <span className="text-rider">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="Re-enter your password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              <Truck className="w-3.5 h-3.5 text-rider" /> Vehicle Capacity{" "}
              <span className="text-rider">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="Number of people (food delivery capacity)"
              type="number"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              <FileText className="w-3.5 h-3.5 text-rider" /> License Number{" "}
              <span className="text-rider">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="abcd43-abcd12"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              <FileText className="w-3.5 h-3.5 text-rider" /> Vehicle Number{" "}
              <span className="text-rider">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="MH23AB1234"
              type="text"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              <Bike className="w-3.5 h-3.5 text-rider" /> Type of Vehicle{" "}
              <span className="text-rider">*</span>
            </label>
            <select
              className="flow-input"
              value={typeOfVehicle}
              onChange={(e) => setTypeOfVehicle(e.target.value)}
            >
              <option value="Bicycle">Bicycle</option>
              <option value="Motorcycle">Motorcycle / Bike</option>
              <option value="Auto">Auto Rickshaw</option>
              <option value="Car">Car</option>
              <option value="Tempo">Tempo</option>
              <option value="Truck">Truck</option>
              <option value="Other">Other</option>
            </select>
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
              (checked ? "bg-rider border-rider" : "border-line bg-surface")
            }
          >
            {checked && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <label
            htmlFor="terms"
            className="text-sm text-ink-2 leading-relaxed select-none"
          >
            I agree to the{" "}
            <span className="text-rider font-semibold">
              Terms and Conditions
            </span>{" "}
            and <span className="text-rider font-semibold">Privacy Policy</span>
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
            className="text-rider font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default RiderRegistration;
