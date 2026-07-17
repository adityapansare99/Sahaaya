import React, { useContext, useEffect, useState } from "react";
import SidebarP from "../components/SidebarP";
import PartnerOverview from "../components/PartnerOverview";
import PartnerRedemptions from "../components/PartnerRedemptions";
import PartnerProfile from "../components/PartnerProfile";
import { AppContext } from "../context/AppContext";
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

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarP
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <div className="p-4 lg:p-8">
          <div className="mb-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 rounded-lg bg-white shadow-sm border"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {name}! 🍽️
            </h1>
            <p className="text-gray-600 mt-2">
              Rewarding delivery heroes, one discount at a time
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default PartnerDashboard;
