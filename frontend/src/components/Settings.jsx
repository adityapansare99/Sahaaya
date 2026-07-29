import React, { useState } from "react";
import { Building, Save, Lock, Trash2 } from "lucide-react";
import LocationInput from "./LocationInput";
import ConfirmModal from "./ConfirmModal";

const Settings = ({
  profile,
  updateProfile,
  changePasswordHandler,
  deleteAccountHandler,
  totalCollections,
}) => {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState({ address: profile.address || "", lat: profile.latitude || null, lng: profile.longitude || null });
  const [typeofNgo, setTypeofNgo] = useState(profile.typeofNgo || "");
  const [RegistrationNumber, setRegistrationNumber] = useState(
    profile.RegistrationNumber || "",
  );
  const [contactPerson, setContactPerson] = useState(
    profile.contactPerson || "",
  );
  const [DailyCapacity, setDailyCapacity] = useState(
    profile.DailyCapacity || "",
  );
  const [Description, setDescription] = useState(profile.Description || "");
  const [activeSection, setActiveSection] = useState("profile");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const submitHandler = () => {
    const responseData = {
      name,
      phone,
      address: address.address,
      typeofNgo,
      RegistrationNumber,
      contactPerson,
      DailyCapacity,
      Description,
      latitude: address.lat,
      longitude: address.lng,
    };
    updateProfile(responseData);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    changePasswordHandler({ oldpassword, newpassword, confirmNewPassword });
    setOldPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
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
    { id: "profile", label: "Profile", icon: Building },
    { id: "password", label: "Security", icon: Lock },
    { id: "danger", label: "Danger", icon: Trash2 },
  ];

  const labelCls = "block text-sm font-medium text-ink-2 mb-2";

  const OrgStats = () => (
    <div className="flow-panel p-6">
      <h3 className="font-display text-base font-semibold text-ink mb-4">
        Organization Stats
      </h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Member since</span>
          <span className="font-semibold text-ink nums">
            {profile.createdAt
              ? new Date(profile.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  year: "numeric",
                })
              : "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-mute">Total food collections</span>
          <span className="font-semibold text-ink nums">{totalCollections || 0}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="mb-7">
        <h2 className="font-display text-3xl font-bold text-ink mb-2">Account & Settings</h2>
        <p className="text-mute">Manage your organization and preferences</p>
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
                      ? "border-ngo text-ngo"
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>NGO Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flow-input"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Registration Number</label>
                    <input
                      type="text"
                      value={RegistrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="flow-input"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Contact Person</label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="flow-input"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Type of NGO</label>
                    <select
                      value={typeofNgo}
                      onChange={(e) => setTypeofNgo(e.target.value)}
                      className="flow-input cursor-pointer"
                    >
                      <option value="trust">Trust</option>
                      <option value="society">Society</option>
                      <option value="company">Section 8 Company</option>
                      <option value="charitable">Charitable Foundation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flow-input nums"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Daily Capacity</label>
                    <input
                      type="text"
                      value={DailyCapacity}
                      onChange={(e) => setDailyCapacity(e.target.value)}
                      placeholder="e.g., 500 meals per day"
                      className="flow-input"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Address</label>
                  <LocationInput
                    value={address.address ?? ""}
                    onChange={(val) => setAddress((prev) => ({ ...prev, address: val }))}
                    onSelect={(coords) => setAddress((prev) => ({ ...prev, ...coords }))}
                    placeholder="Enter complete address"
                    required
                  />
                </div>
                <div>
                  <label className={labelCls}>NGO Description</label>
                  <textarea
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="flow-input resize-none"
                  />
                </div>
                <div className="flex justify-end pt-1">
                  <button onClick={submitHandler} className="fbtn fbtn-flow">
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

              <div><OrgStats /></div>
            </div>
          )}

          {/* Password Section */}
          {activeSection === "password" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <h3 className="font-display text-base font-semibold text-ink mb-4">Change Password</h3>
                <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md">
                  <div>
                    <label className={labelCls}>Current Password</label>
                    <input
                      type="password"
                      value={oldpassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="flow-input"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>New Password</label>
                    <input
                      type="password"
                      value={newpassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="flow-input"
                    />
                  </div>
                  <div>
                    <label className={labelCls}>Confirm New Password</label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className="flow-input"
                    />
                  </div>
                  <button type="submit" className="fbtn fbtn-flow">
                    Update Password
                  </button>
                </form>
              </div>
              <div><OrgStats /></div>
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
                  This action is permanent. Your NGO profile and all donation history will be removed.
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
        description="This action is permanent. Your NGO profile and all donation history will be removed."
        confirmLabel="Yes, delete account"
      />
    </div>
  );
};

export default Settings;
