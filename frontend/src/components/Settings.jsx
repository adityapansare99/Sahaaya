import React, { useState } from "react";
import { Building, Save, User, Lock, Trash2 } from "lucide-react";

const Settings = ({
  profile,
  updateProfile,
  changePasswordHandler,
  deleteAccountHandler,
  totalCollections,
}) => {
  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
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

  const [oldpassword, setOldPassword] = useState("");
  const [newpassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const submitHandler = () => {
    const responseData = {
      name,
      phone,
      address,
      typeofNgo,
      RegistrationNumber,
      contactPerson,
      DailyCapacity,
      Description,
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

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Account & Settings</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveSection("profile")}
          className={`cursor-pointer px-4 py-2 font-medium rounded-t-lg transition-colors ${activeSection === "profile" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Building className="w-4 h-4 inline mr-2" />
          Profile
        </button>
        <button
          onClick={() => setActiveSection("password")}
          className={`cursor-pointer px-4 py-2 font-medium rounded-t-lg transition-colors ${activeSection === "password" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Lock className="w-4 h-4 inline mr-2" />
          Change Password
        </button>
        <button
          onClick={() => setActiveSection("danger")}
          className={`cursor-pointer px-4 py-2 font-medium rounded-t-lg transition-colors ${activeSection === "danger" ? "text-red-500 border-b-2 border-red-500" : "text-gray-500 hover:text-gray-700"}`}
        >
          <Trash2 className="w-4 h-4 inline mr-2" />
          Delete Account
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Section */}
        {activeSection === "profile" && (
          <>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Building className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    NGO Information
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      NGO Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <input
                      type="text"
                      value={RegistrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      value={contactPerson}
                      onChange={(e) => setContactPerson(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type of NGO
                    </label>
                    <select
                      value={typeofNgo}
                      onChange={(e) => setTypeofNgo(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <option value="trust">Trust</option>
                      <option value="society">Society</option>
                      <option value="company">Section 8 Company</option>
                      <option value="charitable">Charitable Foundation</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Daily Capacity
                    </label>
                    <input
                      type="text"
                      value={DailyCapacity}
                      onChange={(e) => setDailyCapacity(e.target.value)}
                      placeholder="e.g., 500 meals per day"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NGO Description
                  </label>
                  <textarea
                    value={Description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={submitHandler}
                    className="px-6 py-2 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organization Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="font-semibold text-gray-900">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total food collections
                    </span>
                    <span className="font-semibold text-gray-900">
                      {totalCollections || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Delete Account Section */}
        {activeSection === "danger" && (
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200">
              <div className="flex items-center gap-3 mb-6">
                <Trash2 className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Delete Account</h3>
              </div>
              <p className="text-gray-600 mb-6">This action is permanent. Your NGO profile and all donation history will be removed.</p>
              <button onClick={() => deleteAccountHandler?.()}
                className="px-6 py-2 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium">
                Delete My Account
              </button>
            </div>
          </div>
        )}

        {/* Change Password Section */}
        {activeSection === "password" && (
          <>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <Lock className="w-5 h-5 text-red-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Change Password
                  </h3>
                </div>
                <form
                  onSubmit={handlePasswordSubmit}
                  className="space-y-4 max-w-md"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={oldpassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <input
                      type="password"
                      value={newpassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Organization Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Member since</span>
                    <span className="font-semibold text-gray-900">
                      {profile.createdAt
                        ? new Date(profile.createdAt).toLocaleDateString(
                            "en-US",
                            { month: "short", year: "numeric" },
                          )
                        : "—"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      Total food collections
                    </span>
                    <span className="font-semibold text-gray-900">
                      {totalCollections || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Settings;
