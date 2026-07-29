import React from "react";
import { Plus, History, TrendingUp, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Logo from "./flow/Logo";

const SidebarD = ({ activeSection, onSectionChange, isOpen, onToggle }) => {
  const menuItems = [
    { id: "create", label: "Create Donation", icon: Plus },
    { id: "donations", label: "My Donations", icon: History },
    { id: "impact", label: "Impact", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const navigate = useNavigate();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flow-rail shadow-lg fixed left-0 top-0 h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
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
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSectionChange(item.id);
                    if (window.innerWidth < 1024) onToggle();
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

export default SidebarD;
