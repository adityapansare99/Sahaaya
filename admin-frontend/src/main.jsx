import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <App />
        <ToastContainer />
      </BrowserRouter>
    </AdminProvider>
  </StrictMode>
);
