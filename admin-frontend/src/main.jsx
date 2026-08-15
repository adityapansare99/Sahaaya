import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { AdminProvider } from "./context/AdminContext.jsx";

if (!toast.__flowSingleToast) {
  [
    "success",
    "error",
    "info",
    "warning",
    "warn",
    "loading",
    "default",
    "dark",
  ].forEach((m) => {
    const orig = toast[m];
    if (typeof orig === "function") {
      toast[m] = (...args) => {
        toast.dismiss();
        return orig(...args);
      };
    }
  });
  toast.__flowSingleToast = true;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AdminProvider>
      <BrowserRouter>
        <App />
        <ToastContainer
          toastClassName="flow-toast"
          bodyClassName="flow-toast-body"
          progressClassName="flow-toast-progress"
          position="top-right"
          autoClose={3000}
          newestOnTop
        />
      </BrowserRouter>
    </AdminProvider>
  </StrictMode>,
);
