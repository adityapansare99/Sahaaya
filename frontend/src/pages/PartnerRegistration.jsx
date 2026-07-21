import React, { useContext, useState } from "react";
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
  Heart,
  Star,
  Sparkles,
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("latitude", addressCoords.lat);
    formData.append("longitude", addressCoords.lng);
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

  return (
    <div className="bg-white min-h-screen relative overflow-hidden">
      {/* Elegant Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-50/20 via-white to-red-50/10"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-red-200 to-transparent"></div>
      <div className="absolute bottom-0 right-0 w-full h-px bg-gradient-to-l from-transparent via-red-200 to-transparent"></div>

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
        <div className="w-full md:col-span-3 md:flex items-center justify-center min-h-[50vh] md:min-h-screen hidden bg-gradient-to-br from-red-50/30 via-white to-red-50/20 relative">
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-red-300 rounded-full"></div>
            <div className="absolute top-1/2 right-1/3 w-24 h-24 border border-red-200 rounded-full"></div>
            <div className="absolute bottom-1/3 left-1/2 w-16 h-16 border border-red-400 rounded-full"></div>
          </div>

          <div className="text-center fixed top-[40vh] h-screen z-1 px-8">
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
            </div>
            <div className="mt-8 space-y-3">
              <h2 className="text-2xl font-light text-gray-800 tracking-wide">
                Join <span className="font-bold text-red-500">Sahaaya</span>
              </h2>
              <p className="text-gray-600 font-light leading-relaxed max-w-sm mx-auto">
                Reward delivery heroes with discounts at your restaurant
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

        {/* Right Side - Registration Form */}
        <div className="flex md:mx-10 md:px-10 mx-4 md:col-span-4 my-6 md:my-8 flex-col items-center relative">
          <div className="w-full bg-white/95 backdrop-blur-sm md:px-15 px-6 md:py-12 py-8 shadow-2xl rounded-3xl border border-gray-100/80 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500/80 via-red-400 to-red-500/80"></div>

            {/* Form Header */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-red-500 mb-2 tracking-tight">
                Restaurant Partner Registration
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-red-400 mx-auto rounded-full mb-3"></div>
              <p className="text-gray-700 font-light leading-relaxed">
                Offer discounts to riders in exchange for their earned points
              </p>
            </div>

            {/* Logo Upload */}
            <div className="mb-8">
              <div className="flex items-center justify-center mb-4">
                <div className="flex items-center space-x-3">
                  <Upload className="w-6 h-6 text-red-500" />
                  <p className="text-lg font-semibold text-red-500 tracking-wide">
                    {!image ? "Upload Restaurant Logo" : "Your Logo"}
                  </p>
                </div>
              </div>

              <label htmlFor="image" className="block">
                <div className="flex justify-center">
                  <div className="relative cursor-pointer group">
                    <div className="relative overflow-hidden rounded-3xl border-3 border-dashed border-gray-300 group-hover:border-red-400 transition-all duration-500 p-4 bg-gradient-to-br from-gray-50 to-white group-hover:from-red-50 group-hover:to-white">
                      <img
                        className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover shadow-lg group-hover:shadow-xl transition-all duration-500 border-2 border-gray-200 group-hover:border-red-300 group-hover:scale-105"
                        src={
                          image
                            ? URL.createObjectURL(image)
                            : "https://www.transparentpng.com/download/user/gray-user-profile-icon-png-fP8Q1P.png"
                        }
                        alt="Restaurant Logo"
                      />
                      {!image && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500">
                          <div className="text-center">
                            <Upload className="w-8 h-8 text-red-500 mx-auto mb-1" />
                            <p className="text-sm text-red-600 font-medium">
                              Click to upload
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    {!image && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full p-2 shadow-lg group-hover:scale-110 transition-all duration-300">
                        <Upload className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>

                <input
                  onChange={(e) => {
                    setImage(e.target.files[0]);
                  }}
                  type="file"
                  id="image"
                  accept="image/*"
                  hidden
                />
              </label>
            </div>

            {/* Form Fields */}
            <div className="space-y-5">
              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <Store className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Restaurant Name
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                  placeholder="e.g. Spice Garden Restaurant"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <MapPin className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Address
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <LocationInput
                  value={address}
                  onChange={setAddress}
                  onSelect={setAddressCoords}
                  placeholder="Complete address with city and state"
                />
              </div>

              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <Phone className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Phone Number
                      <span className="text-red-500 ml-1">*</span>
                    </label>
                  </div>
                </div>
                <input
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                  placeholder="+91 00000 00000"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <div className="group">
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

              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
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
                  <input
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                    placeholder="Min 6 characters"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                        <Lock className="w-4 h-4 text-red-500" />
                      </div>
                      <label className="font-semibold text-gray-700 tracking-wide">
                        Confirm Password
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                    placeholder="Re-enter password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setconfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                        <Tag className="w-4 h-4 text-red-500" />
                      </div>
                      <label className="font-semibold text-gray-700 tracking-wide">
                        Discount on Bill (%)
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                    placeholder="e.g. 10"
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercentage}
                    onChange={(e) => setDiscountPercentage(e.target.value)}
                  />
                </div>

                <div className="group">
                  <div className="flex items-center mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                        <Award className="w-4 h-4 text-red-500" />
                      </div>
                      <label className="font-semibold text-gray-700 tracking-wide">
                        Points Required
                        <span className="text-red-500 ml-1">*</span>
                      </label>
                    </div>
                  </div>
                  <input
                    className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500"
                    placeholder="e.g. 50"
                    type="number"
                    min="0"
                    value={pointsRequired}
                    onChange={(e) => setPointsRequired(e.target.value)}
                  />
                </div>
              </div>

              <div className="group">
                <div className="flex items-center mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="p-1.5 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors duration-300">
                      <FileText className="w-4 h-4 text-red-500" />
                    </div>
                    <label className="font-semibold text-gray-700 tracking-wide">
                      Description{" "}
                      <span className="text-gray-400 font-normal">(optional)</span>
                    </label>
                  </div>
                </div>
                <textarea
                  className="w-full px-4 py-3 bg-gray-100 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-300 hover:bg-gray-50 hover:border-gray-400 placeholder-gray-500 resize-none"
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
              className="flex items-start mt-8 p-6 bg-gradient-to-r from-gray-50/80 to-red-50/30 rounded-2xl border border-gray-200/60 group hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              <div className="relative mt-1">
                <input
                  type="checkbox"
                  id="terms"
                  checked={checked}
                  readOnly
                  className="w-6 h-6 cursor-pointer accent-red-500 focus:ring-2 focus:ring-red-500 rounded-lg transition-all duration-200 opacity-0"
                />
                <div className="absolute top-0 left-0 w-6 h-6 border-2 border-gray-300 rounded-lg bg-white transition-all duration-200 group-hover:border-red-400">
                  {checked && (
                    <CheckCircle className="w-6 h-6 text-red-500 absolute -top-0.5 -left-0.5" />
                  )}
                </div>
              </div>

              <label
                htmlFor="terms"
                className="ml-4 text-gray-700 font-medium leading-relaxed select-none"
              >
                I agree to the{" "}
                <span className="text-red-500 hover:text-red-600 underline font-semibold transition-colors duration-200">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="text-red-500 hover:text-red-600 underline font-semibold transition-colors duration-200">
                  Privacy Policy
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              onClick={() => {
                submitHandler();
              }}
              className="relative w-full p-4 cursor-pointer text-lg text-center rounded-2xl bg-gradient-to-r from-red-500 to-red-600 text-white font-bold mt-8 mb-6 shadow-xl hover:shadow-2xl hover:scale-[1.02] transform transition-all duration-300 hover:from-red-600 hover:to-red-700 group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              <span className="relative flex items-center justify-center space-x-3">
                <Store className="w-6 h-6" />
                <span className="tracking-wide">Register Restaurant</span>
              </span>
            </button>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-gray-700 font-light">
                Already have an account?{" "}
                <span
                  onClick={() => {
                    navigate("/Login");
                  }}
                  className="text-red-500 cursor-pointer font-semibold hover:text-red-600 hover:underline transition-all duration-200 inline-flex items-center group"
                >
                  Login here
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

export default PartnerRegistration;
