import React, { useContext, useEffect, useState } from "react";
import { Menu } from "lucide-react";
import SidebarP from "../components/SidebarP";
import PartnerOverview from "../components/PartnerOverview";
import PartnerRedemptions from "../components/PartnerRedemptions";
import PartnerProfile from "../components/PartnerProfile";
import { AppContext } from "../context/AppContext";
import ApprovalPending from "../components/ApprovalPending";
import Logo from "../components/flow/Logo";
import LiveChip from "../components/flow/LiveChip";
import { toast } from "react-toastify";
import axios from "axios";

const PartnerDashboard = () => {
  const [activeSection, setActiveSection] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({});
  const [redemptions, setRedemptions] = useState([]);
  const [name, setName] = useState("");
  const { backendurl, token } = useContext(AppContext);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${backendurl}partner/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        toast.error("Error in fetching profile");
        return;
      }

      setProfile(response.data.data);
      setName(response.data.data.name);
    } catch (error) {
      toast.error("Error in fetching profile");
    }
  };

  const getRedemptions = async () => {
    try {
      const response = await axios.get(`${backendurl}partner/redemptions`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.data.success) {
        toast.error("Error in fetching redemptions");
        return;
      }

      setRedemptions(response.data.data);
    } catch (error) {
      toast.error("Error in fetching redemptions");
    }
  };

  const handleChangeProfile = async (data) => {
    try {
      const response = await axios.post(
        `${backendurl}partner/updateprofile`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.data.success) {
        toast.error("Error in updating profile");
        return;
      }

      setProfile(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error in updating profile");
    }
  };

  useEffect(() => {
    getProfile();
    getRedemptions();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return <PartnerOverview profile={profile} redemptions={redemptions} />;
      case "redemptions":
        return <PartnerRedemptions redemptions={redemptions} />;
      case "profile":
        return (
          <PartnerProfile
            profile={profile}
            handleChangeProfile={handleChangeProfile}
          />
        );
      default:
        return <PartnerOverview profile={profile} redemptions={redemptions} />;
    }
  };

  if (profile._id && !profile.approved) {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-canvas flex">
      <SidebarP
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 transition-all duration-300">
        {/* Mobile Header */}
        <div className="lg:hidden bg-surface border-b border-line p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-ink-2 hover:bg-surface-2 transition-colors duration-200"
          >
            <Menu className="w-6 h-6" />
          </button>
          <Logo size="sm" subtitle={false} />
          <div className="w-7"></div>
        </div>

        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Desktop greet bar */}
            <div className="hidden lg:flex items-center justify-between mb-7">
              <div className="flex items-center gap-2.5">
                <span className="font-display text-[11px] font-bold tracking-[0.18em] uppercase text-mute-2">
                  Partner
                </span>
                <span className="h-3 w-px bg-line" />
                <span className="font-display text-sm font-semibold text-ink">
                  {name ? `Welcome back, ${name.split(" ")[0]}` : "Partner dashboard"}
                </span>
              </div>
              <LiveChip>Live</LiveChip>
            </div>

            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PartnerDashboard;
