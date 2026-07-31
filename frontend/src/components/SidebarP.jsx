import React, { useContext } from "react";
import { LayoutDashboard, Ticket, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import Logo from "./flow/Logo";

const SidebarP = ({
  activeSection,
  setActiveSection,
  sidebarOpen,
  setSidebarOpen,
}) => {
  const menuItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "redemptions", label: "Redemptions", icon: Ticket },
    { id: "profile", label: "Profile & Settings", icon: User },
  ];

  const navigate = useNavigate();
  const { logout } = useContext(AppContext);

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
    navigate("/Login");
  };

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`flow-rail shadow-lg fixed top-0 left-0 h-full z-50 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
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
                    setActiveSection(item.id);
                    if (window.innerWidth < 1024) setSidebarOpen(false);
                  }}
                  className={`flow-nav-i${isActive ? " active" : ""}`}
                >
                  <Icon className="w-[18px] h-[18px]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="flow-rail-foot">
            <button className="flow-nav-i" onClick={handleLogout}>
              <LogOut className="w-[18px] h-[18px]" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarP;
