import React, { useState } from 'react';
import { Building, Mail, Phone, MapPin, Save, HelpCircle, Shield, Bell, User } from 'lucide-react';

const Settings = ({profile,updateProfile}) => {

  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    pushNotifications: true,
    weeklyReports: true
  });

  const [name,setName]=useState(profile.name || "");
  const [phone,setPhone]=useState(profile.phone || "");
  const [address,setAddress]=useState(profile.address || "");
  const [typeofNgo,setTypeofNgo]=useState(profile.typeofNgo || "");
  const [RegistrationNumber,setRegistrationNumber]=useState(profile.RegistrationNumber || "");
  const [contactPerson,setContactPerson]=useState(profile.contactPerson || "");
  const [DailyCapacity,setDailyCapacity]=useState(profile.DailyCapacity || "");
  const [Description,setDescription]=useState(profile.Description || "");

  const submitHandler=()=>{
    const responseData={
      name,
      phone,
      address,
      typeofNgo,
      RegistrationNumber,
      contactPerson,
      DailyCapacity,
      Description
    }
    
    updateProfile(responseData);
  }

  const handleNotificationChange = (field, value) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6 md:ml-2">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Account & Settings</h2>
        <button onClick={()=>{
          submitHandler()
        }} className="px-4 py-2 cursor-pointer bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors duration-200 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* NGO Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Building className="w-5 h-5 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">NGO Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">NGO Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Registration Number</label>
                <input
                  type="text"
                  value={RegistrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contact Person</label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type of NGO</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  value={typeofNgo}
                  onChange={(e) => setTypeofNgo(e.target.value)}
                >
                  <option value="trust">Trust (Registered under the Indian Trusts Act)</option>
                  <option value="society">Society (Registered under the Societies Registration Act, 1860)</option>
                  <option value="company">Section 8 Company (Non-Profit Company) (Under Companies Act, 2013)</option>
                  <option value="shg">Co-operative Society / Self-Help Group (SHG) (if applicable)</option>
                  <option value="charitable">Charitable Foundation</option>
                  <option value="community">Religious / Community Organization</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Capacity</label>
                <input
                  type="text"
                  value={DailyCapacity}
                  onChange={(e) => setDailyCapacity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="e.g., 500 meals per day"
                />
              </div>
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
            
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">NGO Description</label>
              <textarea
                value={Description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <Bell className="w-5 h-5 text-red-500" />
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
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-500"></div>
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
              <button className="w-full p-3 cursor-pointer text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Change Password</div>
                  <div className="text-sm text-gray-500">Update login credentials</div>
                </div>
              </button>
              
              <button className="w-full cursor-pointer p-3 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="font-medium text-gray-900">Privacy Settings</div>
                  <div className="text-sm text-gray-500">Manage data preferences</div>
                </div>
              </button>
              
              <button className="w-full p-3 cursor-pointer text-left rounded-lg border border-red-500 bg-red-50 hover:bg-red-100 transition-colors duration-200 flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-red-500" />
                <div>
                  <div className="font-medium text-red-500">Contact Support</div>
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