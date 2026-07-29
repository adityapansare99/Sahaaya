import React from "react";
import { Package, History, BarChart3, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./flow/Logo";

const Sidebar = ({ activeTab, setActiveTab, isMobileOpen, setIsMobileOpen }) => {
  const menuItems = [
    { id: "requests", label: "Incoming Donations", icon: Package },
    { id: "history", label: "Received Donations", icon: History },
    { id: "analytics", label: "Reports & Analytics", icon: BarChart3 },
    { id: "settings", label: "Account & Settings", icon: Settings },
  ];

  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flow-rail shadow-lg fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } w-64`}
      >
        <div className="flow-rail-inner h-full flex flex-col">
          {/* Brand */}
          <div className="brand">
            <Logo size="sm" onClick={() => navigate("/")} />
          </div>

          {/* Menu Items */}
          <nav className="flow-navlist">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) setIsMobileOpen(false);
                  }}
                  className={`flow-nav-i${isActive ? " active" : ""}`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
