import React, { useState } from "react";
import {
  Store,
  Phone,
  MapPin,
  Edit3,
  Tag,
  Award,
  FileText,
  Camera,
} from "lucide-react";

const PartnerProfile = ({ profile, handleChangeProfile }) => {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address || "");
  const [discountPercentage, setDiscountPercentage] = useState(
    profile.discountPercentage ?? ""
  );
  const [pointsRequired, setPointsRequired] = useState(
    profile.pointsRequired ?? ""
  );
  const [description, setDescription] = useState(profile.description || "");

  const handleSave = () => {
    setIsEditing(false);
    handleChangeProfile({
      name,
      phone,
      address,
      discountPercentage,
      pointsRequired,
      description,
    });
  };

  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent";
  const readClass =
    "flex items-center space-x-3 p-3 bg-gray-50 rounded-xl text-gray-900";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <p className="text-gray-600">
          Manage your restaurant details and discount offer
        </p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center overflow-hidden">
                {profile.logo ? (
                  <img
                    src={profile.logo}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Store className="w-10 h-10" />
                )}
              </div>
              <button className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
              <p className="text-red-100 mb-2">Restaurant Partner</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="inline-flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  {profile.discountPercentage ?? 0}% discount
                </span>
                <span className="inline-flex items-center gap-1">
                  <Award className="w-4 h-4" />
                  {profile.pointsRequired ?? 0} pts required
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 cursor-pointer px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4 text-red-500" />
              <span className="text-red-500">
                {isEditing ? "Cancel" : "Edit Profile"}
              </span>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Restaurant info */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">
                Restaurant Information
              </h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restaurant Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <div className={readClass}>
                      <Store className="w-5 h-5 text-gray-400" />
                      <span>{name}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <div className={readClass}>
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span>{phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className={inputClass}
                    />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Offer info */}
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">Discount Offer</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Discount on Bill (%)
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={discountPercentage}
                      onChange={(e) => setDiscountPercentage(e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <div className={readClass}>
                      <Tag className="w-5 h-5 text-gray-400" />
                      <span>{profile.discountPercentage}%</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Points Required
                  </label>
                  {isEditing ? (
                    <input
                      type="number"
                      min="0"
                      value={pointsRequired}
                      onChange={(e) => setPointsRequired(e.target.value)}
                      className={inputClass}
                    />
                  ) : (
                    <div className={readClass}>
                      <Award className="w-5 h-5 text-gray-400" />
                      <span>{profile.pointsRequired} pts</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className={inputClass}
                    />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <FileText className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">
                        {description || "No description added"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-6 border-t border-gray-100 flex space-x-4">
              <button
                onClick={handleSave}
                className="bg-red-500 cursor-pointer hover:bg-red-600 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="bg-gray-100 cursor-pointer hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerProfile;
