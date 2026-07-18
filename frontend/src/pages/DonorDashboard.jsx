import React, { useState, useEffect, useContext, useRef } from "react";
import { Menu, X } from "lucide-react";
import SidebarD from "../components/SidebarD";
import CreateDonation from "../components/CreateDonation";
import MyDonations from "../components/MyDonations";
import Impact from "../components/Impact";
import SettingsD from "../components/SettingsD";
import ApprovalPending from "../components/ApprovalPending";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import Swal from "sweetalert2";

const DonorDashboard = () => {
  const { backendurl, token } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const actions = useRef(null);
  const [activeSection, setActiveSection] = useState("create");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const [profile, setProfile] = useState({});

  useEffect(() => {
    getAllDonations();
    getProfile();
  }, []);

  const handleDonationCreate = async (newDonation) => {
    const response = await axios.post(
      `${backendurl}donation/createDonation`,
      newDonation,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.data.success) {
      toast.error("Donation creation failed");
      return;
    }

    toast.success(response.data.message);
    setDonations((prevDonations) => [...prevDonations, response.data.data]);
  };

  const getAllDonations = async (silent = false) => {
    try {
      const response = await axios.get(
        `${backendurl}donation/getAllDonations`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Donation creation failed");
        return;
      }

      if (!silent) toast.success(response.data.message);
      setDonations(response.data.data);
    } catch (error) {}
  };

  // Latest fetch fn in a ref so the socket listeners (registered once) always call current closures.
  actions.current = { getAllDonations };

  useEffect(() => {
    if (!socket || !profile?._id) return;

    const join = () => socket.emit("join", { userId: profile._id, userType: "donor" });
    if (socket.connected) join();
    socket.on("connect", join);

    const onDonationAccepted = () => {
      toast.success("Your donation was accepted by an NGO!");
      actions.current.getAllDonations(true);
    };
    const onStatusUpdate = ({ status }) => {
      toast.info(status === "completed" ? "Delivery completed" : "Food picked up");
      actions.current.getAllDonations(true);
    };
    socket.on("donationAccepted", onDonationAccepted);
    socket.on("statusUpdate", onStatusUpdate);

    return () => {
      socket.off("connect", join);
      socket.off("donationAccepted", onDonationAccepted);
      socket.off("statusUpdate", onStatusUpdate);
    };
  }, [socket, profile]);

  const navigate = useNavigate();

  const handleDonationEdit = async (donation) => {
    try {
      const response = await axios.put(
        `${backendurl}donation/editDonation`,
        donation,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Donation edit failed");
        return;
      }

      toast.success(response.data.message);
      getAllDonations();
    } catch (error) {
      console.error(error);
      toast.error("Error Editing donation");
    }
  };

  const handleDonationCancel = async (donationId) => {
    try {
      const response = await axios.delete(
        `${backendurl}donation/deleteDonation`,
        {
          data: { donationId },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Donation cancellation failed");
        return;
      }

      toast.success(response.data.message);
      getAllDonations();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting donation");
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${backendurl}donor/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Could not fetch profile");
        return;
      }

      setProfile(response.data.data);
    } catch (error) {
      toast.error("Error fetching profile");
    }
  };

  const handleProfileUpdate = async (updatedProfile) => {
    try {
      const response = await axios.post(
        `${backendurl}donor/updateprofile`,
        updatedProfile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Could not update profile");
        return;
      }

      setProfile(response.data.data);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Error updating profile");
    }
  };

  const changePasswordHandler = async (passwordData) => {
    try {
      if (passwordData.newpassword !== passwordData.confirmNewPassword) {
        toast.error("New passwords do not match");
        return;
      }

      const data = {
        oldpassword: passwordData.oldpassword,
        newpassword: passwordData.newpassword,
      };
      const response = await axios.post(
        `${backendurl}donor/updatepassword`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error(response.data.message || "Could not change password");
        return;
      }

      toast.success("Password changed successfully");
    } catch (error) {
      toast.error("Error in changing password. Please check old password.");
    }
  };

  const deleteAccountHandler = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action will permanently delete your account.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) {
      toast.info("Account deletion cancelled");
      return;
    }

    try {
      const response = await axios.delete(`${backendurl}donor/deleteaccount`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error(response.data.message || "Could not delete account");
        return;
      }
      toast.success("Account deleted successfully");
      navigate("/login");
    } catch (error) {
      toast.error("Error in deleting account.");
    }
  };

  const renderContent = () => {
    switch (activeSection) {
      case "create":
        return <CreateDonation onDonationCreate={handleDonationCreate} />;
      case "donations":
        return (
          <MyDonations
            donations={donations}
            onEdit={handleDonationEdit}
            onCancel={handleDonationCancel}
          />
        );
      case "impact":
        return <Impact />;
      case "settings":
        return (
          <SettingsD
            profile={profile}
            onProfileUpdate={handleProfileUpdate}
            changePasswordHandler={changePasswordHandler}
            deleteAccountHandler={deleteAccountHandler}
          />
        );
      default:
        return <CreateDonation onDonationCreate={handleDonationCreate} />;
    }
  };

  if (profile._id && !profile.approved) {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarD
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex-1 lg:ml-64">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-2xl hover:bg-gray-100 transition-colors duration-200"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
          <h1 className="text-xl font-bold text-gray-800">Sahaaya</h1>
          <div className="w-10"></div>
        </div>

        {/* Main Content */}
        <main className="p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default DonorDashboard;
