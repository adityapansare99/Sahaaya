import React from "react";
import {
  Heart,
  Plus,
  History,
  TrendingUp,
  Settings,
  HelpCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const SidebarD = ({ activeSection, onSectionChange, isOpen, onToggle }) => {
  const menuItems = [
    { id: "create", label: "Create Donation", icon: Plus },
    { id: "donations", label: "My Donations", icon: History },
    { id: "impact", label: "Impact", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const navigate=useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white shadow-lg z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 mb-8">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 onClick={()=>{
              navigate('/')
            }} className="text-2xl font-bold text-gray-800 cursor-pointer">Sahaaya</h1>
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
                  }}
                  className={`w-full cursor-pointer flex items-center space-x-3 px-4 py-3 rounded-2xl transition-all duration-200 ${
                    isActive
                      ? "bg-red-500 text-white shadow-lg"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Support Button */}
          <div className="mt-8 pt-8 border-t border-gray-200">
            <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-200">
              <HelpCircle className="w-5 h-5" />
              <span className="font-medium cursor-pointer">Contact Support</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarD;
