import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const DASH = {
  Donor: "/DonorDashboard",
  Receiver: "/NgoDashboard",
  Rider: "/RiderDashboard",
  Partner: "/PartnerDashboard",
};

const ProtectedRoute = ({ allow, children }) => {
  const { token, Role } = useContext(AppContext);
  const location = useLocation();

  if (!token) {
    return <Navigate to="/Login" replace state={{ from: location.pathname }} />;
  }
  if (Role !== allow) {
    return <Navigate to={DASH[Role] || "/Login"} replace />;
  }
  return children;
};

export default ProtectedRoute;
