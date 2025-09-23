import React from "react";
import { Truck, MapPin, Clock, Award, User, X } from "lucide-react";

const SidebarR = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "deliveries", label: "Available Deliveries", icon: Truck },
    { id: "active", label: "Active Delivery", icon: MapPin },
    { id: "history", label: "Delivery History", icon: Clock },
    { id: "rewards", label: "Rewards & Impact", icon: Award },
    { id: "profile", label: "Profile & Settings", icon: User },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300
        lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-gray-900">Sahaaya</h2>
                <p className="text-sm text-gray-500">Rider Dashboard</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSection(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-left transition-all duration-200
                  ${
                    activeSection === item.id
                      ? "bg-red-50 text-red-600 border-l-4 border-red-500"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-6 right-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 text-white">
            <h3 className="font-semibold mb-2">Need Help?</h3>
            <p className="text-sm text-red-100 mb-3">
              Contact our support team
            </p>
            <button className="bg-white text-red-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-50 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarR;
