import React, { useState } from "react";
import { User, Mail, Phone, MapPin, Lock, Save, Trash2 } from "lucide-react";
import LocationInput from "./LocationInput";
import ConfirmModal from "./ConfirmModal";

const SettingsD = ({ profile, onProfileUpdate, changePasswordHandler, deleteAccountHandler }) => {
  const [formData, setFormData] = useState(profile);
  const [activeSection, setActiveSection] = useState("profile");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onProfileUpdate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const submitHandler = (e) => {
    e.preventDefault();
    changePasswordHandler({ oldpassword, newpassword, confirmNewPassword });
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      await deleteAccountHandler?.();
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "danger", label: "Danger", icon: Trash2 },
  ];

  const labelCls = "block text-sm font-medium text-ink-2 mb-2";

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Account &amp; Settings</h2>
        <p className="text-mute">Manage your account and preferences</p>
      </div>

      <div className="flow-panel overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-line">
          <nav className="flex gap-7 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSection(tab.id)}
                  className={`flex cursor-pointer items-center gap-2 py-4 border-b-2 font-display font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "border-donor text-donor"
                      : "border-transparent text-mute hover:text-ink"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Section */}
          {activeSection === "profile" && (
            <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className={labelCls}>
                    <User className="w-4 h-4 inline mr-2 text-mute" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="flow-input"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <MapPin className="w-4 h-4 inline mr-2 text-mute" />
                    Address
                  </label>
                  <LocationInput
                    value={formData.address?.address || formData.address || ""}
                    onChange={(val) => handleInputChange("address", val)}
                    onSelect={(coords) => setFormData((prev) => ({ ...prev, latitude: coords.lat, longitude: coords.lng }))}
                    placeholder="Enter your address"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <Phone className="w-4 h-4 inline mr-2 text-mute" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="flow-input nums"
                    required
                  />
                </div>

                <div>
                  <label className={labelCls}>
                    <MapPin className="w-4 h-4 inline mr-2 text-mute" />
                    PinCode
                  </label>
                  <input
                    type="text"
                    value={formData.pincode}
                    onChange={(e) => handleInputChange("pincode", e.target.value)}
                    className="flow-input nums"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" className="fbtn fbtn-flow">
                  <Save className="w-4 h-4" />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div className="max-w-md">
              <h3 className="font-display text-base font-semibold text-ink mb-4">Change Password</h3>
              <form onSubmit={(e) => submitHandler(e)} className="space-y-4">
                <div>
                  <label className={labelCls}>Current Password</label>
                  <input
                    type="password"
                    value={oldpassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="flow-input"
                  />
                </div>
                <div>
                  <label className={labelCls}>New Password</label>
                  <input
                    type="password"
                    value={newpassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flow-input"
                  />
                </div>
                <div>
                  <label className={labelCls}>Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="flow-input"
                  />
                </div>
                <button type="submit" className="fbtn fbtn-flow">
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Danger Section */}
          {activeSection === "danger" && (
            <div className="max-w-2xl">
              <div
                className="rounded-[var(--r-lg)] p-6"
                style={{ border: "1px dashed rgba(var(--urgent-rgb),.4)", background: "rgba(var(--urgent-rgb),.04)" }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="grid place-items-center w-10 h-10 rounded-xl"
                    style={{ background: "rgba(var(--urgent-rgb),.1)", color: "var(--color-urgent)" }}
                  >
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-ink">Delete Account</h3>
                </div>
                <p className="text-sm text-mute mb-5">
                  This action is permanent. Your donor profile and all donation history will be removed.
                </p>
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="fbtn fbtn-g fbtn-sm"
                  style={{ color: "var(--color-urgent)", borderColor: "rgba(var(--urgent-rgb),.35)" }}
                >
                  <span>Delete My Account</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        title="Delete your account?"
        description="This action is permanent. All your donation history will be permanently deleted."
        confirmLabel="Yes, delete account"
      />
    </div>
  );
};

export default SettingsD;
