import React, { useContext, useEffect, useRef, useState } from "react";
import SidebarR from "../components/SidebarR";
import AvailableDeliveries from "../components/AvailableDeliveries";
import ActiveDelivery from "../components/ActiveDelivery";
import DeliveryHistory from "../components/DeliveryHistory";
import RewardsSection from "../components/RewardsSection";
import RedeemPoints from "../components/RedeemPoints";
import ProfileSection from "../components/ProfileSection";
import ApprovalPending from "../components/ApprovalPending";
import { AppContext } from "../context/AppContext";
import { SocketContext } from "../context/SocketContext";
import { toast } from "react-toastify";
import axios from "axios";

const RiderDashboard = () => {
  const [activeSection, setActiveSection] = useState("deliveries");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [deliveries, setDeliveries] = useState([]);
  const { backendurl, token } = useContext(AppContext);
  const { socket } = useContext(SocketContext);
  const actions = useRef(null);
  const [activeOrder, setActiveOrder] = useState([]);
  const [history, setHistory] = useState([]);
  const [profile, setProfile] = useState({});
  const [name, setName] = useState("");

  const fetchDeliveries = async () => {
    try {
      const response = await axios.get(`${backendurl}rider/allRides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Error in fetching deliveries");
      }

      setDeliveries(response.data.data);
    } catch (error) {
      console.log(error);
      toast.error("Error in fetching deliveries");
    }
  };

  const handleAcceptDelivery = async (id) => {
    try {
      const response = await axios.put(
        `${backendurl}rider/acceptRide`,
        { rideId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Error in accepting delivery");
        return;
      }

      fetchDeliveries();
      // Pull the now-active ride, then land on the Active tab so it shows without a manual refresh.
      await getActiveOrder(true);
      setActiveSection("active");
      toast.success("Delivery accepted successfully");
    } catch (error) {
      toast.error("Error in accepting delivery");
    }
  };

  const getActiveOrder = async (silent = false) => {
    try {
      const response = await axios.get(`${backendurl}rider/getRides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Error in fetching active order");
      }

      setActiveOrder(response.data.data);

      if (!silent && response.data.data.length > 0) toast.info("You have an active order");
    } catch (error) {
      toast.error("Error in fetching active order");
    }
  };

  const handlepickup = async (id) => {
    try {
      const response = await axios.put(
        `${backendurl}rider/markPicked`,
        { rideId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Error in marking pickup");
      }
      getActiveOrder();
      toast.success("Pickup marked successfully");
    } catch (error) {
      toast.error("Error in marking pickup");
    }
  };

  const handlecomplete = async (id) => {
    try {
      const response = await axios.put(
        `${backendurl}rider/markCompeted`,
        { rideId: id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Error in marking complete");
      }
      getActiveOrder();
      toast.success("Delivery completed successfully");
    } catch (error) {
      toast.error("Error in marking complete");
    }
  };

  const getHistory = async () => {
    try {
      const response = await axios.get(`${backendurl}rider/getAllRides`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Error in fetching delivery history");
      }

      setHistory(response.data.data);
    } catch (error) {
      toast.error("Error in fetching delivery history");
    }
  };

  const getProfile = async () => {
    try {
      const response = await axios.get(`${backendurl}delivery/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Error in fetching profile");
      }

      setProfile(response.data.data);
      setName(response.data.data.name);
    } catch (error) {
      toast.error("Error in fetching profile");
    }
  };

  // Latest fetch fns in a ref so the socket listeners (registered once) always call current closures.
  actions.current = { fetchDeliveries, getActiveOrder, getHistory };

  useEffect(() => {
    if (!socket || !profile?._id) return;

    const join = () => socket.emit("join", { userId: profile._id, userType: "delivery" });
    if (socket.connected) join();
    socket.on("connect", join);

    const onRideCreated = () => {
      toast.success("New delivery available!");
      actions.current.fetchDeliveries();
    };
    const onPointsAwarded = ({ points }) => {
      toast.success(`Points earned! Total: ${points} pts`);
      actions.current.getActiveOrder(true);
      actions.current.getHistory();
    };
    socket.on("rideCreated", onRideCreated);
    socket.on("pointsAwarded", onPointsAwarded);

    return () => {
      socket.off("connect", join);
      socket.off("rideCreated", onRideCreated);
      socket.off("pointsAwarded", onPointsAwarded);
    };
  }, [socket, profile]);

  const handleChangeProfile = async (data) => {
    try {
      const response = await axios.post(
        `${backendurl}delivery/updateprofile`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.data.success) {
        toast.error("Error in updating profile");
      }

      setProfile(response.data.data);
      toast.success("Profile updated successfully");
      getProfile();
    } catch (error) {
      toast.error("Error in updating profile");
    }
  };

  useEffect(() => {
    fetchDeliveries();
    getActiveOrder();
    getHistory();
    getProfile();
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case "deliveries":
        return (
          <AvailableDeliveries
            deliveries={deliveries}
            handleAcceptDelivery={handleAcceptDelivery}
            setDeliveries={setDeliveries}
          />
        );
      case "active":
        return (
          <ActiveDelivery
            setActiveSection={setActiveSection}
            activeOrder={activeOrder}
            handlepickup={handlepickup}
            handlecomplete={handlecomplete}
          />
        );
      case "history":
        return <DeliveryHistory history={history} />;
      case "rewards":
        return <RewardsSection />;
      case "redeem":
        return <RedeemPoints />;
      case "profile":
        return (
          <ProfileSection
            profile={profile}
            handleChangeProfile={handleChangeProfile}
          />
        );
      default:
        return <AvailableDeliveries />;
    }
  };

  if (profile._id && !profile.approved) {
    return <ApprovalPending />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <SidebarR
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
              Welcome back, {name}! 🚴‍♂️
            </h1>
            <p className="text-gray-600 mt-2">
              Ready to make a difference today?
            </p>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default RiderDashboard;
