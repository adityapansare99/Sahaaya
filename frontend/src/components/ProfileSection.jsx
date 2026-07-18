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

const ProfileSection = ({profile,handleChangeProfile}) => {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(profile.name || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [address, setAddress] = useState(profile.address);
  const [emergencyContact, setEmergencyContact] = useState(profile.emergencyNumber || "");
  const [vehicleType, setVehicleType] = useState(profile.typeOfVehicle || "");
  const [licenseNumber, setLicenseNumber] = useState(profile.licenseNumber || "");
  const [vehicleNumber, setVehicleNumber] = useState(profile.vehicleNumber || "");
  const [vehicleCapacity, setVehicleCapacity] = useState(profile.vehicleCapacity || "");

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
    const data={
      name,
      address,
      phone,
      emergencyNumber: emergencyContact,
      vehicleCapacity,
      licenseNumber,
      vehicleNumber,
      typeOfVehicle: vehicleType,
    };

    handleChangeProfile(data);
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
              <h3 className="text-2xl font-bold mb-1">{name}</h3>
              <p className="text-red-100 mb-2">Delivery Partner</p>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <span>⭐</span>
                  <span>{profile?.rating || "-"} Rating</span>
                </div>
                <div>{profile?.totalDeliveries || "-"} Deliveries</div>
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
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <User className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{name}</span>
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
                      onChange={(e) =>
                        setPhone(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{phone}</span>
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
                      onChange={(e) =>
                        setAddress(e.target.value)
                      }
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-start space-x-3 p-3 bg-gray-50 rounded-xl">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <span className="text-gray-900">{address}</span>
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
                      value={emergencyContact}
                      onChange={(e) =>
                        setEmergencyContact(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {emergencyContact}
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
                      value={vehicleType}
                      onChange={(e) =>
                        setVehicleType(e.target.value)
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
                        {getVehicleLabel(vehicleType)}
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
                      value={licenseNumber}
                      onChange={(e) =>
                        setLicenseNumber(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {licenseNumber}
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
                      value={vehicleNumber}
                      onChange={(e) =>
                        setVehicleNumber(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Shield className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {vehicleNumber}
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
                      value={vehicleCapacity}
                      onChange={(e) =>
                        setVehicleCapacity(e.target.value)
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  ) : (
                    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">
                        {vehicleCapacity}
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
                onClick={()=>{
                  handleSave();
                }}
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

export default ProfileSection;
