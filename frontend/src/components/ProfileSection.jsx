import React, { useContext, useState, useRef, useEffect } from "react";
import { User, Phone, MapPin, Edit3, Shield, Camera, Lock, Trash2 } from "lucide-react";
import LocationInput from "./LocationInput";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";

const ProfileSection = ({ profile, handleChangeProfile }) => {
  const { backendurl, token } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
    if (address && (addressCoords.lat == null || addressCoords.lng == null)) {
      toast.error("Please select your address from the dropdown suggestions so we can map your location");
      return;
    }
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
    setDeleting(true);
    try {
      await axios.delete(`${backendurl}delivery/deleteaccount`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Account deleted");
      window.location.href = "/";
    } catch {
      toast.error("Error deleting account");
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const getVehicleLabel = (v) => {
    const opt = vehicleOptions.find((o) => o.value === v);
    return opt ? `${opt.icon} ${opt.label}` : v;
  };

  const labelCls = "block text-sm font-medium text-ink-2 mb-2";

  return (
    <div className="space-y-6">
      <div className="mb-2">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Profile & Settings</h2>
        <p className="text-mute">Manage your account and preferences</p>
      </div>

      <div className="flow-panel overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-line">
          <nav className="flex gap-7 px-6">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "password", label: "Security", icon: Lock },
              { id: "danger", label: "Danger", icon: Trash2 },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex cursor-pointer items-center gap-2 py-4 border-b-2 font-display font-medium text-sm transition-all duration-200 ${
                    isActive ? "border-rider text-rider" : "border-transparent text-mute hover:text-ink"
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
            {/* Gradient header (rider-teal) */}
            <div
              className="p-6 md:p-8 text-white relative overflow-hidden"
              style={{ background: "linear-gradient(140deg, var(--color-rider), var(--color-rider-2))" }}
            >
              <div className="flex items-center gap-6 flex-wrap">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl overflow-hidden" style={{ background: "rgba(255,255,255,.18)", border: "1px solid rgba(255,255,255,.25)" }}>
                    {profile.image ? <img src={profile.image} className="w-full h-full object-cover" alt="" /> : "🧑‍🍳"}
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
                    className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-surface rounded-full flex items-center justify-center" style={{ boxShadow: "var(--sh-md)" }}>
                    <Camera className="w-4 h-4" style={{ color: "var(--color-rider)" }} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-2xl font-bold mb-1">{name}</h3>
                  <p className="text-sm text-white/80 mb-2">Delivery Partner</p>
                  <div className="flex items-center gap-4 text-sm nums">
                    <span>⭐ {profile?.rating || "—"}</span>
                    <span>{profile?.totalDeliveries || "—"} deliveries</span>
                  </div>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="fbtn fbtn-g" style={{ background: "rgba(255,255,255,.15)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>
                  <Edit3 className="w-4 h-4" />
                  <span>{isEditing ? "Cancel" : "Edit"}</span>
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Personal Information */}
                <div className="space-y-4">
                  <h4 className="font-display text-base font-semibold text-ink">Personal Information</h4>
                  {[
                    { label: "Full Name", value: name, set: setName, icon: User },
                    { label: "Phone", value: phone, set: setPhone, icon: Phone },
                    { label: "Emergency Contact", value: emergencyContact, set: setEmergencyContact, icon: Phone },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className={labelCls}>{f.label}</label>
                      {isEditing ? (
                        <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} className="flow-input" />
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                          <f.icon className="w-5 h-5 text-mute" />
                          <span className="text-ink nums">{f.value || "—"}</span>
                        </div>
                      )}
                    </div>
                  ))}
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
                      <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                        <MapPin className="w-5 h-5 text-mute" />
                        <span className="text-ink">{address || "—"}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vehicle Information */}
                <div className="space-y-4">
                  <h4 className="font-display text-base font-semibold text-ink">Vehicle Information</h4>
                  {[
                    { label: "Vehicle Type", value: vehicleType, set: setVehicleType, comp: "select", options: vehicleOptions, display: getVehicleLabel(vehicleType) },
                    { label: "License Number", value: licenseNumber, set: setLicenseNumber },
                    { label: "Vehicle Number", value: vehicleNumber, set: setVehicleNumber },
                    { label: "Vehicle Capacity", value: vehicleCapacity, set: setVehicleCapacity },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className={labelCls}>{f.label}</label>
                      {isEditing ? (
                        f.comp === "select" ? (
                          <select value={f.value} onChange={(e) => f.set(e.target.value)} className="flow-input cursor-pointer">
                            {f.options.map((o) => <option key={o.value} value={o.value}>{o.icon} {o.label}</option>)}
                          </select>
                        ) : (
                          <input type="text" value={f.value} onChange={(e) => f.set(e.target.value)} className="flow-input" />
                        )
                      ) : (
                        <div className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                          <Shield className="w-5 h-5 text-mute" />
                          <span className="text-ink">{f.display || f.value || "—"}</span>
                        </div>
                      )}
                    </div>
                  ))}
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
              <div className="grid place-items-center w-10 h-10 rounded-xl" style={{ background: "var(--color-rider-soft)", color: "var(--color-rider-2)" }}>
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
              <p className="text-sm text-mute mb-5">This action is permanent. All your data, delivery history, and earned points will be removed.</p>
              <button onClick={() => setConfirmOpen(true)} className="fbtn fbtn-g fbtn-sm" style={{ color: "var(--color-urgent)", borderColor: "rgba(var(--urgent-rgb),.35)" }}>
                <span>Delete My Account</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteAccount}
        loading={deleting}
        title="Delete your account?"
        description="This action is permanent. All your data, delivery history, and earned points will be removed."
        confirmLabel="Yes, delete account"
      />
    </div>
  );
};

export default ProfileSection;
