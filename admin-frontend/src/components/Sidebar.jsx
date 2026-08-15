import { useNavigate, useLocation } from "react-router-dom";
import { useAdmin } from "../context/AdminContext.jsx";
import {
  LayoutDashboard,
  Heart,
  Users,
  Bike,
  Store,
  Package,
  Truck,
  LogOut,
} from "lucide-react";
import Logo from "./flow/Logo.jsx";

const navItems = [
  { id: "/home", label: "Dashboard", icon: LayoutDashboard, role: "ink" },
  { id: "/ngos", label: "NGOs", icon: Heart, role: "ngo" },
  { id: "/donors", label: "Donors", icon: Users, role: "donor" },
  { id: "/delivery", label: "Delivery Partners", icon: Bike, role: "rider" },
  {
    id: "/partners",
    label: "Restaurant Partners",
    icon: Store,
    role: "partner",
  },
  { id: "/donations", label: "Donations", icon: Package, role: "donor" },
  { id: "/rides", label: "Rides", icon: Truck, role: "rider" },
];

const ROLE_COLOR = {
  ink: "var(--color-ink)",
  ngo: "var(--color-ngo)",
  donor: "var(--color-donor)",
  rider: "var(--color-rider)",
  partner: "var(--color-partner)",
};

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAdmin();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="flow-rail admin-rail">
      <div className="flow-rail-inner">
        <div className="admin-brand">
          <Logo size="sm" subtitle={false} onClick={() => navigate("/home")} />
          <span className="admin-brand-role">Admin</span>
        </div>

        <nav className="flow-navlist">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.id)}
                className={"flow-nav-i" + (isActive ? " active" : "")}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon
                  style={{ color: isActive ? "#fff" : ROLE_COLOR[item.role] }}
                />
                <span className="nav-label">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="admin-rail-foot">
          <button
            onClick={handleLogout}
            className="flow-nav-i"
            style={{ color: "var(--color-urgent)" }}
          >
            <LogOut />
            <span className="nav-label">Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
