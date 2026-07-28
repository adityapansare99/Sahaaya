import React, { useContext, useState } from "react";
import Logo from "../components/flow/Logo";
import {
  Upload,
  Store,
  MapPin,
  Phone,
  Mail,
  Lock,
  Tag,
  Award,
  FileText,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import LocationInput from "../components/LocationInput";

const PartnerRegistration = () => {
  const { backendurl, setToken } = useContext(AppContext);

  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [addressCoords, setAddressCoords] = useState({ lat: null, lng: null });
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [pointsRequired, setPointsRequired] = useState("");
  const [description, setDescription] = useState("");
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

    if (addressCoords.lat == null || addressCoords.lng == null) {
      toast.error("Please select your address from the dropdown suggestions");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    if (addressCoords.lat != null) formData.append("latitude", addressCoords.lat);
    if (addressCoords.lng != null) formData.append("longitude", addressCoords.lng);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("discountPercentage", discountPercentage);
    formData.append("pointsRequired", pointsRequired);
    formData.append("description", description);

    if (image) {
      formData.append("image", image);
    }

    try {
      const response = await axios.post(
        `${backendurl}partner/register`,
        formData
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Error in partner registration");
        return;
      }

      setToken(response.data.data.token);
      localStorage.setItem("token", response.data.data.token);
      toast.success("Restaurant registered successfully");
      navigate("/PartnerDashboard");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Error in partner registration"
      );
    }
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
            <span className="text-partner">Restaurant Partner</span> registration
          </h1>
          <p className="text-mute text-sm mt-2">
            Offer discounts to riders for their earned points
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
                alt="Restaurant photo"
              />
              <div className="absolute -bottom-1 -right-1 bg-partner text-white rounded-full p-2 shadow-md transition-transform group-hover:scale-110">
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
              <Store className="w-3.5 h-3.5 text-partner" /> Restaurant Name{" "}
              <span className="text-partner">*</span>
            </label>
            <input
              className="flow-input"
              placeholder="e.g. Spice Garden Restaurant"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className={labelCls}>
              <MapPin className="w-3.5 h-3.5 text-partner" /> Address{" "}
              <span className="text-partner">*</span>
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
              <Phone className="w-3.5 h-3.5 text-partner" /> Phone Number{" "}
              <span className="text-partner">*</span>
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
              <Mail className="w-3.5 h-3.5 text-partner" /> Email Address{" "}
              <span className="text-partner">*</span>
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
                <Lock className="w-3.5 h-3.5 text-partner" /> Password{" "}
                <span className="text-partner">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="Min 6 characters"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                <Lock className="w-3.5 h-3.5 text-partner" /> Confirm Password{" "}
                <span className="text-partner">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="Re-enter password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setconfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>
                <Tag className="w-3.5 h-3.5 text-partner" /> Discount on Bill (%){" "}
                <span className="text-partner">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="e.g. 10"
                type="number"
                min="0"
                max="100"
                value={discountPercentage}
                onChange={(e) => setDiscountPercentage(e.target.value)}
              />
            </div>

            <div>
              <label className={labelCls}>
                <Award className="w-3.5 h-3.5 text-partner" /> Points Required{" "}
                <span className="text-partner">*</span>
              </label>
              <input
                className="flow-input"
                placeholder="e.g. 50"
                type="number"
                min="0"
                value={pointsRequired}
                onChange={(e) => setPointsRequired(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className={labelCls}>
              <FileText className="w-3.5 h-3.5 text-partner" /> Description{" "}
              <span className="text-mute font-normal normal-case tracking-normal">
                (optional)
              </span>
            </label>
            <textarea
              className="flow-input resize-none"
              placeholder="Tell riders about your restaurant and cuisine"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Terms */}
        <div
          onClick={() => setChecked(!checked)}
          className="flex items-start gap-2.5 mt-6 cursor-pointer"
        >
          <div
            className={
              "mt-0.5 w-5 h-5 flex-shrink-0 rounded-md border-2 flex items-center justify-center transition-colors " +
              (checked ? "bg-partner border-partner" : "border-line bg-surface")
            }
          >
            {checked && <CheckCircle className="w-4 h-4 text-white" />}
          </div>
          <label
            htmlFor="terms"
            className="text-sm text-ink-2 leading-relaxed select-none"
          >
            I agree to the{" "}
            <span className="text-partner font-semibold">
              Terms and Conditions
            </span>{" "}
            and <span className="text-partner font-semibold">Privacy Policy</span>
          </label>
        </div>

        {/* Submit */}
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
            className="text-partner font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
};

export default PartnerRegistration;
