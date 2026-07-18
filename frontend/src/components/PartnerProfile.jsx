import React, { useContext, useState, useRef } from "react";
import {
  Store,
  Phone,
  MapPin,
  Edit3,
  Tag,
  Award,
  FileText,
  Camera,
  Lock,
  Trash2,
} from "lucide-react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const PartnerProfile = ({ profile, handleChangeProfile }) => {
  const { backendurl, token } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
  const [discountPercentage, setDiscountPercentage] = useState(profile.discountPercentage ?? "");
  const [pointsRequired, setPointsRequired] = useState(profile.pointsRequired ?? "");
  const [description, setDescription] = useState(profile.description || "");

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const inputClass = "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent";

  const handleSave = () => {
    setIsEditing(false);
    handleChangeProfile({ name, phone, address, discountPercentage, pointsRequired, description });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newpassword !== confirmNewPassword) return toast.error("New passwords do not match");
    try {
      const res = await axios.post(`${backendurl}partner/updatepassword`, { oldpassword, newpassword }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.success) {
        toast.success("Password changed successfully");
        setOldPassword(""); setNewPassword(""); setConfirmNewPassword("");
      }
    } catch { toast.error("Error changing password"); }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Delete your restaurant account? This cannot be undone.")) return;
    try {
      await axios.delete(`${backendurl}partner/deleteaccount`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted");
      window.location.href = "/";
    } catch { toast.error("Error deleting account"); }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <p className="text-gray-600">Manage your restaurant details and account</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button onClick={() => setActiveTab("profile")}
          className={`cursor-pointer px-4 py-2 font-medium transition-colors ${activeTab === "profile" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500"}`}>
          <Store className="w-4 h-4 inline mr-2" />Profile
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
                <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center overflow-hidden">
                  {profile.logo ? (
                    <img src={profile.logo} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <Store className="w-10 h-10" />
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const formData = new FormData();
                    formData.append("data", JSON.stringify({ name, phone, address, discountPercentage, pointsRequired, description }));
                    formData.append("image", file);
                    try {
                      await axios.post(`${backendurl}partner/updateprofile`, formData, {
                        headers: { Authorization: `Bearer ${token}` },
                      });
                      toast.success("Logo updated");
                      window.location.reload();
                    } catch {
                      toast.error("Failed to upload logo");
                    }
                  }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
                <p className="text-red-100 mb-2">Restaurant Partner</p>
                <div className="flex items-center space-x-4 text-sm">
                  <span className="inline-flex items-center gap-1"><Tag className="w-4 h-4" /> {profile.discountPercentage ?? 0}% discount</span>
                  <span className="inline-flex items-center gap-1"><Award className="w-4 h-4" /> {profile.pointsRequired ?? 0} pts required</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer px-4 py-2 rounded-xl font-medium transition-colors"
              >
                <Edit3 className="w-4 h-4 text-red-500 inline mr-1" />
                <span className="text-red-500">{isEditing ? "Cancel" : "Edit"}</span>
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Restaurant Information</h4>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Restaurant Name</label>
                  {isEditing ? (
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Store className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{name}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Phone Number</label>
                  {isEditing ? (
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Address</label>
                  {isEditing ? (
                    <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className={inputClass} />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{address}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <h4 className="text-lg font-bold text-gray-900">Discount Offer</h4>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Discount on Bill (%)</label>
                  {isEditing ? (
                    <input type="number" min="0" max="100" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className={inputClass} />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.discountPercentage}%</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Points Required</label>
                  {isEditing ? (
                    <input type="number" min="0" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} className={inputClass} />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Award className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.pointsRequired} pts</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Description</label>
                  {isEditing ? (
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputClass} />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{description || "No description added"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {isEditing && (
              <div className="mt-8 pt-6 border-t flex space-x-4">
                <button onClick={handleSave} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold">Save Changes</button>
                <button onClick={() => setIsEditing(false)} className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold">Cancel</button>
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
              <input type="password" value={oldpassword} onChange={(e) => setOldPassword(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">New Password</label>
              <input type="password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} required className={inputClass} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Confirm New Password</label>
              <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className={inputClass} />
            </div>
            <button type="submit" className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold">Update Password</button>
          </form>
        </div>
      )}

      {activeTab === "danger" && (
        <div className="bg-white rounded-2xl shadow-lg border border-red-200 p-8 max-w-lg">
          <div className="flex items-center gap-3 mb-6">
            <Trash2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
          </div>
          <p className="text-gray-600 mb-6">This action is permanent. Your restaurant profile and all redemption history will be removed.</p>
          <button onClick={handleDeleteAccount} className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold">Delete My Account</button>
        </div>
      )}
    </div>
  );
};

export default PartnerProfile;
