import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAdmin } from "./context/AdminContext.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NGOs from "./pages/NGOs.jsx";
import Donors from "./pages/Donors.jsx";
import DeliveryPartners from "./pages/DeliveryPartners.jsx";
import RestaurantPartners from "./pages/RestaurantPartners.jsx";
import Donations from "./pages/Donations.jsx";
import Rides from "./pages/Rides.jsx";

const ProtectedRoute = ({ children }) => {
  const { token } = useAdmin();
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/ngos" element={<ProtectedRoute><NGOs /></ProtectedRoute>} />
      <Route path="/donors" element={<ProtectedRoute><Donors /></ProtectedRoute>} />
      <Route path="/delivery" element={<ProtectedRoute><DeliveryPartners /></ProtectedRoute>} />
      <Route path="/partners" element={<ProtectedRoute><RestaurantPartners /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
      <Route path="/rides" element={<ProtectedRoute><Rides /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
