import React, { useState } from "react";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Car,
  Edit3,
  Shield,
  HelpCircle,
  Settings,
  Camera,
} from "lucide-react";

const ProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Alex Kumar",
    email: "alex.kumar@email.com",
    phone: "+91 9876543210",
    address: "Jubilee Hills, Hyderabad",
    vehicleType: "motorcycle",
    licenseNumber: "ABCD/436152",
    emergencyContact: "+91 9876543211",
    rating: "4.9",
    totalDeliveries: "124",
    vehicleNumber: "TS09AB1234",
    vehicleCapacity: "50",
  });

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
    // Handle save logic here
  };

  const getVehicleLabel = (value) => {
    const vehicle = vehicleOptions.find((v) => v.value === value);
    return vehicle ? `${vehicle.icon} ${vehicle.label}` : value;
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile & Settings</h2>
        <p className="text-gray-600">Manage your account and preferences</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-8 text-white">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 cursor-pointer bg-white bg-opacity-20 rounded-2xl flex items-center justify-center text-4xl">
                👨‍🍳
              </div>
              <button className="absolute cursor-pointer -bottom-2 -right-2 w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1">{profile.name}</h3>
              <p className="text-red-100 mb-2">Delivery Partner</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{profile.rating} Rating</span>
                </div>
                <div>{profile.totalDeliveries} Deliveries</div>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white cursor-pointer bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-xl font-medium transition-colors flex items-center space-x-2"
            >
              <Edit3 className="w-4 h-4  text-red-500" />
              <span className="text-red-500">
                {isEditing ? "Cancel" : "Edit Profile"}
              </span>
            </button>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">
                Personal Information
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.name}
                      onChange={(e) =>
                        setProfile({ ...profile, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.name}</span>
                    </div>
                  )}
                </div>

                {!isEditing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.email}</span>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) =>
                        setProfile({ ...profile, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  {isEditing ? (
                    <textarea
                      value={profile.address}
                      onChange={(e) =>
                        setProfile({ ...profile, address: e.target.value })
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{profile.address}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Emergency Contact
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.emergencyContact}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          emergencyContact: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {profile.emergencyContact}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-lg font-bold text-gray-900">
                Vehicle Information
              </h4>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Type
                  </label>
                  {isEditing ? (
                    <select
                      value={profile.vehicleType}
                      onChange={(e) =>
                        setProfile({ ...profile, vehicleType: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    >
                      {vehicleOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.icon} {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Car className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {getVehicleLabel(profile.vehicleType)}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.licenseNumber}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          licenseNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {profile.licenseNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Number
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profile.vehicleNumber}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          vehicleNumber: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {profile.vehicleNumber}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vehicle Capacity
                  </label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profile.vehicleCapacity}
                      onChange={(e) =>
                        setProfile({
                          ...profile,
                          vehicleCapacity: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {profile.vehicleCapacity}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="mt-8 pt-6 border-t flex space-x-4">
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

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Account Settings</h3>
              <p className="text-gray-600 text-sm">
                Privacy, notifications, and more
              </p>
            </div>
          </div>
          <button className="w-full cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-xl font-medium transition-colors">
            Manage Settings
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <HelpCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900">Help & Support</h3>
              <p className="text-gray-600 text-sm">Get help with deliveries</p>
            </div>
          </div>
          <button className="w-full cursor-pointer bg-green-50 hover:bg-green-100 text-green-600 py-3 rounded-xl font-medium transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
