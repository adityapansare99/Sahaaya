import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { Route, Router, Routes } from "react-router-dom";
import Home from "./pages/Home";
import NgoRegistration from "./pages/NgoRegistration";
import DonorRegistration from "./pages/DonorRegistration";
import RiderRegistration from "./pages/RiderRegistration";
import Login from "./pages/Login";
import Role from "./pages/Role";
import ScrollToTop from "./components/ScrollToTop";
import DonorDashboard from "./pages/DonorDashboard";
import NgoDashboard from "./pages/NgoDashboard";
import RiderDashboard from "./pages/RiderDashboard";
import PartnerRegistration from "./pages/PartnerRegistration";
import PartnerDashboard from "./pages/PartnerDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import TrackOrder from "./pages/TrackOrder";
import ChatPanel from "./components/ChatPanel";

//Version 1 completed
const App = () => {
  return (
    <>
    <ToastContainer/>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Registration-Ngo" element={<NgoRegistration />} />
        <Route path="/Registration-Donor" element={<DonorRegistration />} />
        <Route path="/Registration-Rider" element={<RiderRegistration />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Role" element={<Role />} />
        <Route path="/DonorDashboard" element={<DonorDashboard />} />
        <Route path="/NgoDashboard" element={<NgoDashboard />} />
        <Route path="/RiderDashboard" element={<RiderDashboard />} />
        <Route path="/Registration-Partner" element={<PartnerRegistration />} />
        <Route path="/PartnerDashboard" element={<PartnerDashboard />} />
        <Route path="/ForgotPassword" element={<ForgotPassword />} />
        <Route path="/track/:rideId" element={<TrackOrder />} />
      </Routes>
      <ChatPanel />
    </>
  );
};

export default App;
