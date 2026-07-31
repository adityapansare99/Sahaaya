import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import AppContextProvider from "./context/AppContext.jsx";
import SocketProvider from "./context/SocketContext.jsx";

if (!toast.__flowSingleToast) {
  ["success", "error", "info", "warning", "warn", "loading", "default", "dark"].forEach((m) => {
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
// ─────────────────────────────────────────────────────────────────────────────

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppContextProvider>
      <SocketProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </SocketProvider>
    </AppContextProvider>
  </StrictMode>,
);
