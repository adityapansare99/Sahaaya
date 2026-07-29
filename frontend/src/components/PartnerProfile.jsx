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
import LocationInput from "./LocationInput";

const PartnerProfile = ({ profile, handleChangeProfile }) => {
  const { backendurl, token } = useContext(AppContext);
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
  const [addresscor, setAddressCoords] = useState({ lat: profile.latitude ?? null, lng: profile.longitude ?? null });
  const [discountPercentage, setDiscountPercentage] = useState(profile.discountPercentage ?? "");
  const [pointsRequired, setPointsRequired] = useState(profile.pointsRequired ?? "");
  const [description, setDescription] = useState(profile.description || "");

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const labelCls = "block text-sm font-medium text-ink-2 mb-2";

  const handleSave = () => {
    setIsEditing(false);
    handleChangeProfile({ name, phone, address, discountPercentage, pointsRequired, description, latitude: addresscor.lat, longitude: addresscor.lng });
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

  const tabs = [
    { id: "profile", label: "Profile", icon: Store },
    { id: "password", label: "Security", icon: Lock },
    { id: "danger", label: "Danger", icon: Trash2 },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Profile & Settings</h2>
        <p className="text-mute">Manage your restaurant details and account</p>
      </div>

      <div className="flow-panel overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-line">
          <nav className="flex gap-7 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center gap-2 py-4 border-b-2 font-display font-medium text-sm transition-all duration-200 ${
                    isActive ? "border-partner text-partner" : "border-transparent text-mute hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Profile tab */}
        {activeTab === "profile" && (
          <div className="overflow-hidden">
            {/* Gradient header (partner-indigo) */}
            <div
              className="p-6 md:p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(140deg, var(--color-partner), var(--color-partner-2))" }}
            >
              <div className="flex items-center gap-6 flex-wrap">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl overflow-hidden" style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.25)" }}>
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
                    className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center"
                    style={{ boxShadow: "var(--sh-md)" }}
                  >
                    <Camera className="w-4 h-4" style={{ color: "var(--color-partner)" }} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl font-bold mb-1">{profile.name}</h3>
                  <p className="text-sm text-white/80 mb-2">Restaurant Partner</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="inline-flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> {profile.discountPercentage ?? 0}% off</span>
                    <span className="inline-flex items-center gap-1"><Award className="w-3.5 h-3.5" /> {profile.pointsRequired ?? 0} pts required</span>
                  </div>
                </div>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="fbtn fbtn-g"
                  style={{ background: "rgba(255,255,255,.15)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Restaurant Information */}
                <div className="space-y-4">
                  <h4 className="font-display text-base font-semibold text-ink">Restaurant Information</h4>
                  <div>
                    <label className={labelCls}>Restaurant Name</label>
                    {isEditing ? (
                      <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="flow-input" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                        <Store className="w-5 h-5 text-mute" />
                        <span className="text-ink">{name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    {isEditing ? (
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="flow-input nums" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                        <Phone className="w-5 h-5 text-mute" />
                        <span className="text-ink nums">{phone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Address</label>
                    {isEditing ? (
                      <LocationInput
                        value={address}
                        onChange={(val) => setAddress(val)}
                        onSelect={(coords) => setAddressCoords(coords)}
                        placeholder="Enter complete address"
                      />
                    ) : (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2">
                        <MapPin className="w-5 h-5 text-mute mt-0.5" />
                        <span className="text-ink">{address}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Discount Offer */}
                <div className="space-y-4">
                  <h4 className="font-display text-base font-semibold text-ink">Discount Offer</h4>
                  <div>
                    <label className={labelCls}>Discount on Bill (%)</label>
                    {isEditing ? (
                      <input type="number" min="0" max="100" value={discountPercentage} onChange={(e) => setDiscountPercentage(e.target.value)} className="flow-input nums" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                        <Tag className="w-5 h-5 text-mute" />
                        <span className="text-ink nums">{profile.discountPercentage}%</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Points Required</label>
                    {isEditing ? (
                      <input type="number" min="0" value={pointsRequired} onChange={(e) => setPointsRequired(e.target.value)} className="flow-input nums" />
                    ) : (
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                        <Award className="w-5 h-5 text-mute" />
                        <span className="text-ink nums">{profile.pointsRequired} pts</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>Description</label>
                    {isEditing ? (
                      <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className="flow-input resize-none" />
                    ) : (
                      <div className="flex items-start gap-3 p-3 rounded-xl bg-surface-2">
                        <FileText className="w-5 h-5 text-mute mt-0.5" />
                        <span className="text-ink">{description || "No description added"}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {isEditing && (
                <div className="mt-8 pt-6 border-t border-line flex gap-3">
                  <button onClick={handleSave} className="fbtn fbtn-flow">
                    <span>Save Changes</span>
                  </button>
                  <button onClick={() => setIsEditing(false)} className="fbtn fbtn-g">
                    <span>Cancel</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Password tab */}
        {activeTab === "password" && (
          <div className="p-6 md:p-8 max-w-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="grid place-items-center w-10 h-10 rounded-xl" style={{ background: "var(--color-partner-soft)", color: "var(--color-partner-2)" }}>
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-display text-base font-semibold text-ink">Change Password</h3>
            </div>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className={labelCls}>Current Password</label>
                <input type="password" value={oldpassword} onChange={(e) => setOldPassword(e.target.value)} required className="flow-input" />
              </div>
              <div>
                <label className={labelCls}>New Password</label>
                <input type="password" value={newpassword} onChange={(e) => setNewPassword(e.target.value)} required className="flow-input" />
              </div>
              <div>
                <label className={labelCls}>Confirm New Password</label>
                <input type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required className="flow-input" />
              </div>
              <button type="submit" className="fbtn fbtn-flow">Update Password</button>
            </form>
          </div>
        )}

        {/* Danger tab */}
        {activeTab === "danger" && (
          <div className="p-6 md:p-8 max-w-2xl">
            <div className="rounded-[var(--r-lg)] p-6" style={{ border: "1px dashed rgba(var(--urgent-rgb),.4)", background: "rgba(var(--urgent-rgb),.04)" }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="grid place-items-center w-10 h-10 rounded-xl" style={{ background: "rgba(var(--urgent-rgb),.1)", color: "var(--color-urgent)" }}>
                  <Trash2 className="w-5 h-5" />
                </div>
                <h3 className="font-display text-base font-semibold text-ink">Delete Account</h3>
              </div>
              <p className="text-sm text-mute mb-5">This action is permanent. Your restaurant profile and all redemption history will be removed.</p>
              <button onClick={handleDeleteAccount} className="fbtn fbtn-g fbtn-sm" style={{ color: "var(--color-urgent)", borderColor: "rgba(var(--urgent-rgb),.35)" }}>
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PartnerProfile;
