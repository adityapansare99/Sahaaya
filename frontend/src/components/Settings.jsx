import React, { useState } from 'react';
import { Building, Mail, Phone, MapPin, Save, HelpCircle, Shield, Bell, User } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    ngoName: 'Sahaaya Foundation',
    registrationNo: 'NGO/2018/0045789',
    contactPerson: 'Mrs. Priya Sharma',
    email: 'contact@sahaayafoundation.org',
    phone: '+91 98765 43210',
    address: 'Sector 15, Phase 2, Gurgaon, Haryana - 122001',
    capacity: '500',
    operatingHours: '24/7',
    description: 'We work towards eliminating hunger in urban areas by collecting surplus food from donors and distributing it to those in need through our network of volunteers and community centers.'
  });

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Account & Settings</h2>
        <button className="px-4 py-2 bg-[#ef4f5f] text-white rounded-xl hover:bg-[#d63447] transition-colors duration-200 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NGO Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-5 h-5 text-[#ef4f5f]" />
              <h3 className="text-lg font-semibold text-gray-900">NGO Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NGO Name</label>
                <input
                  type="text"
                  value={formData.ngoName}
                  onChange={(e) => handleInputChange('ngoName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={formData.registrationNo}
                  onChange={(e) => handleInputChange('registrationNo', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={formData.contactPerson}
                  onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Capacity</label>
                <input
                  type="text"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
                  placeholder="e.g., 500 meals per day"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Organization Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ef4f5f] focus:border-transparent"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-[#ef4f5f]" />
              <h3 className="text-lg font-semibold text-gray-900">Notification Preferences</h3>
            </div>
            
            <div className="space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900">
                      {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </div>
                    <div className="text-sm text-gray-500">
                      {key === 'emailAlerts' && 'Receive donation alerts via email'}
                      {key === 'smsAlerts' && 'Get SMS notifications for urgent requests'}
                      {key === 'pushNotifications' && 'Browser notifications for new donations'}
                      {key === 'weeklyReports' && 'Weekly impact and analytics reports'}
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => handleNotificationChange(key, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ef4f5f]"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Change Password</div>
                  <div className="text-sm text-gray-500">Update login credentials</div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Privacy Settings</div>
                  <div className="text-sm text-gray-500">Manage data preferences</div>
                </div>
              </button>
              
              <button className="w-full p-3 text-left rounded-lg border border-[#ef4f5f] bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-[#ef4f5f]" />
                <div>
                  <div className="font-medium text-[#ef4f5f]">Contact Support</div>
                  <div className="text-sm text-red-600">Get help from our team</div>
                </div>
              </button>
            </div>
          </div>

          {/* Organization Stats */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Organization Stats</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Member since</span>
                <span className="font-semibold text-gray-900">Jan 2022</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total food collections</span>
                <span className="font-semibold text-gray-900">1,247</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Meals distributed</span>
                <span className="font-semibold text-gray-900">18,650</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Collection success rate</span>
                <span className="font-semibold text-green-600">96%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;