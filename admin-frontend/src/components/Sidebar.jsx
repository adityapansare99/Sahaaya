import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import { LayoutDashboard, Users, Heart, Truck, Store, Package, Bike, LogOut } from "lucide-react";

const navItems = [
  { id: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "/ngos", label: "NGOs", icon: Heart },
  { id: "/donors", label: "Donors", icon: Users },
  { id: "/delivery", label: "Delivery Partners", icon: Bike },
  { id: "/partners", label: "Restaurant Partners", icon: Store },
  { id: "/donations", label: "Donations", icon: Package },
  { id: "/rides", label: "Rides", icon: Truck },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-40 flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Sahaaya</h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <button key={item.id} onClick={() => navigate(item.id)}
                className={`w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? "bg-red-500 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}>
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200">
        <button onClick={handleLogout}
          className="w-full cursor-pointer flex items-center gap-4 px-4 py-3 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
