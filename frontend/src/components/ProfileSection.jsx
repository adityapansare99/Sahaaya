import React, { useContext, useState, useRef, useEffect } from "react";
import { User, Phone, MapPin, Car, Edit3, Shield, Camera, Lock, Trash2 } from "lucide-react";
import LocationInput from "./LocationInput";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ProfileSection = ({ profile, handleChangeProfile }) => {
  const { backendurl, token } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (profile.address) setAddress(profile.address);
  }, [profile.address]);
  const [addressCoords, setAddressCoords] = useState({ lat: profile.homeLatitude ?? null, lng: profile.homeLongitude ?? null });
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyNumber || "");
  const [vehicleType, setVehicleType] = useState(profile.typeOfVehicle || "");
  const [licenseNumber, setLicenseNumber] = useState(profile.licenseNumber || "");
  const [vehicleNumber, setVehicleNumber] = useState(profile.vehicleNumber || "");
  const [vehicleCapacity, setVehicleCapacity] = useState(profile.vehicleCapacity || "");

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const vehicleOptions = [
    { value: "bicycle", label: "Bicycle", icon: "🚲" },
    { value: "motorcycle", label: "Motorcycle", icon: "🏍️" },
    { value: "car", label: "Car", icon: "🚗" },
    { value: "auto", label: "Auto Rickshaw", icon: "🛺" },
    { value: "tempo", label: "Tempo", icon: "🚛" },
    { value: "truck", label: "Truck", icon: "🚚" },
  ];

  const handleSave = () => {
    setIsEditing(false);
    handleChangeProfile({ name, address, phone, emergencyNumber: emergencyContact, vehicleCapacity, licenseNumber, vehicleNumber, typeOfVehicle: vehicleType, latitude: addressCoords.lat, longitude: addressCoords.lng });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newpassword !== confirmNewPassword) return toast.error("New passwords do not match");
    try {
      const res = await axios.post(`${backendurl}delivery/updatepassword`, { oldpassword, newpassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Password changed successfully");
        setOldPassword(""); setNewPassword(""); setConfirmNewPassword("");
      }
    } catch { toast.error("Error changing password"); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try {
      await axios.delete(`${backendurl}delivery/deleteaccount`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted");
      window.location.href = "/";
    } catch { toast.error("Error deleting account"); }
  };

  const getVehicleLabel = (v) => {
    const opt = vehicleOptions.find((o) => o.value === v);
    return opt ? `${opt.icon} ${opt.label}` : v;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveTab("profile")}
          className={`cursor-pointer px-4 py-2 font-medium transition-colors ${activeTab === "profile" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}>
          <User className="w-4 h-4 inline mr-2" />Profile
        </button>
        <button onClick={() => setActiveTab("password")}
          className={`cursor-pointer px-4 py-2 font-medium transition-colors ${activeTab === "password" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}>
          <Lock className="w-4 h-4 inline mr-2" />Change Password
        </button>
        <button onClick={() => setActiveTab("danger")}
          className={`cursor-pointer px-4 py-2 font-medium transition-colors ${activeTab === "danger" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}>
          <Trash2 className="w-4 h-4 inline mr-2" />Delete Account
        </button>
      </div>

      {activeTab === "profile" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl overflow-hidden">
                  {profile.image ? <img src={profile.image} className="w-full h-full object-cover" alt="" /> : "👨‍🍳"}
                </div>
                <input type="file" accept="image/*" ref={fileInputRef} className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("data", JSON.stringify({ name, phone, address, emergencyNumber: emergencyContact, vehicleCapacity, licenseNumber, vehicleNumber, typeOfVehicle: vehicleType }));
                    formData.append("image", file);
                    try {
                      await axios.post(`${backendurl}delivery/updateprofile`, formData, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      toast.success("Photo updated");
                      window.location.reload();
                    } catch { toast.error("Failed to upload photo"); }
                  }} />
                <button onClick={() => fileInputRef.current?.click()}
                  className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{name}</h3>
                <p className="text-red-100 mb-2">Delivery Partner</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span>⭐ {profile?.rating || "-"} Rating</span>
                  <span>{profile?.totalDeliveries || "-"} Deliveries</span>
                </div>
              </div>
              <button onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer px-4 py-2 rounded-xl font-medium transition-colors">
                <Edit3 className="w-4 h-4 text-red-500 inline mr-1" />
                <span className="text-red-500">{isEditing ? "Cancel" : "Edit"}</span>
              </button>
            </div>
          </div>
          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Personal Information</h4>
                {[
                  { label: "Full Name", value: name, set: setName, icon: User },
                  { label: "Phone", value: phone, set: setPhone, icon: Phone },
                  { label: "Emergency Contact", value: emergencyContact, set: setEmergencyContact, icon: Phone },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{f.label}</label>
                    {isEditing ? (
                      <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <f.icon className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{f.value || "—"}</span>
                      </div>
                    )}
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                  {isEditing ? (
                    <LocationInput
                      value={address}
                      onChange={(val) => setAddress(val)}
                      onSelect={(coords) => setAddressCoords(coords)}
                      placeholder="Enter complete address"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{address || "—"}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Vehicle Information</h4>
                {[
                  { label: "Vehicle Type", value: vehicleType, set: setVehicleType, comp: "select", options: vehicleOptions, display: getVehicleLabel(vehicleType) },
                  { label: "License Number", value: licenseNumber, set: setLicenseNumber },
                  { label: "Vehicle Number", value: vehicleNumber, set: setVehicleNumber },
                  { label: "Vehicle Capacity", value: vehicleCapacity, set: setVehicleCapacity },
                ].map((f) => (
                  <div key={f.label}>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">{f.label}</label>
                    {isEditing ? (
                      f.comp === "select" ? (
                        <select value={f.value} onChange={(e) => f.set(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500">
                          {f.options.map((o) => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
                        </select>
                      ) : (
                        <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500" />
                      )
                    ) : (
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                        <Shield className="w-5 h-5 text-gray-400" />
                        <span className="text-gray-900">{f.display || f.value || "—"}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            {isEditing && (
              <div className="mt-8 pt-6 border-t flex space-x-4">
                <button onClick={handleSave}
                  className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold">Save Changes</button>
                <button onClick={() => setIsEditing(false)}
                  className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold">Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "password" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <Lock className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Current Password</label>
              <input type="password" value={oldpassword} onChange={(e) => setOldPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
              <input type="password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500" />
            </div>
            <button type="submit"
              className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Update Password</button>
          </form>
        </div>
      )}

      {activeTab === "danger" && (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
          </div>
          <p className="text-gray-600 mb-6">This action is permanent. All your data, delivery history, and earned points will be removed.</p>
          <button onClick={handleDeleteAccount}
            className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors">Delete My Account</button>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;
