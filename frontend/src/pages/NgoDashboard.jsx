import React, { useContext, useEffect, useState } from "react";
import Sidebar from "../components/Sidebar.jsx";
import FoodRequests from "../components/FoodRequests";
import DonationHistory from "../components/DonationHistory";
import Analytics from "../components/Analytics";
import Settings from "../components/Settings";
import axios from "axios";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";
import { set } from "mongoose";

function App() {
  const [activeTab, setActiveTab] = useState("requests");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [donations, setDonations] = useState([]);
  const { backendurl, token } = useContext(AppContext);
  const [acceptedOrder,setAcceptedOrder]=useState([]);
  const [filtered,setFiltered]=useState([]);
  const [profile,setProfile]=useState({});

  const getProfile=async()=>{
    try {
      const response=await axios.get(`${backendurl}ngo/profile`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if(!response.data.success){
        toast.error("Error in fetching profile");
      }

      setProfile(response.data.data);
    } catch (error) {
      toast.error("Error in fetching profile");
    }
  }

  useEffect(()=>{
    getProfile();
  },[])

  const updateProfile=async(responseData)=>{
    try {
      const response=await axios.post(`${backendurl}ngo/updateprofile`,responseData,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if(!response.data.success){
        toast.error("Error in updating profile");
        return;
      }
      toast.success(response.data.message || "Profile updated successfully");
      setProfile(response.data.data);
    } catch (error) {
      toast.error("Error in updating profile");
    }
  }

  const getAllDonations = async () => {
    try {
      const response = await axios.get(`${backendurl}receiver/donations`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.data.success) {
        toast.error("Donations not found");
        return;
      }

      toast.success(response.data.message);
      setDonations(response.data.data);
    } catch (err) {
      toast.error("Error fetching donations");
    }
  };

  const acceptOrder=async(donationId)=>{
    try {
      const response=await axios.put(`${backendurl}receiver/acceptOrder`,{donationId},{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if(!response.data.success){
        toast.error("Error in accepting donation");
        return;
      }

      toast.success(response.data.message);
      getAllDonations();
    } catch (error) {
      toast.error("Error in accepting donation");
    }
  }

  const rejectOrder=async(donationId)=>{
    try {
      const response=donations.filter(donation=>donation._id!==donationId)
      setDonations(response);
      toast.success("Donation rejected temporarily");
    } catch (error) {
      toast.error("Error in rejecting donation");
    }
  }

  const acceptedOrdersHandler=async()=>{
    try {
      const response=await axios.get(`${backendurl}receiver/receivedDonations`,{
        headers:{
          Authorization:`Bearer ${token}`
        }
      })

      if(!response.data.success){
        toast.error("Error in fetching accepted donations");
        return;
      }

      toast.success(response.data.message);
      setAcceptedOrder(response.data.data);
      setFiltered(response.data.data.response);
      console.log(response.data.data.response);
    } catch (error) {
      toast.error("Error in fetching accepted donations");
    }
  }

  useEffect(()=>{
    getAllDonations();
    acceptedOrdersHandler();
  },[])

  const renderContent = () => {
    switch (activeTab) {
      case "requests":
        return <FoodRequests donations={donations} acceptOrder={acceptOrder} rejectOrder={rejectOrder}/>;
      case "history":
        return <DonationHistory acceptedOrder={acceptedOrder} filtered={filtered} setFiltered={setFiltered} />;
      case "analytics":
        return <Analytics />;
      case "settings":
        return <Settings profile={profile} updateProfile={updateProfile} />;
      default:
        return <FoodRequests />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
      />

      {/* Main Content */}
      <div className="lg:ml-64">
        <main className="p-6 lg:p-8 pt-16 lg:pt-8">{renderContent()}</main>
      </div>
    </div>
  );
}

export default App;
