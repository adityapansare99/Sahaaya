import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [Role, setRole] = useState(localStorage.getItem("role") || "Donor");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const backendurl =
    (import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "") + "/";

  const logout = async () => {
    try {
      await fetch(`${backendurl}logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
    }
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setToken("");
    setRole("Donor");
  };

  const value = {
    Role,
    setRole,
    token,
    setToken,
    backendurl,
    logout,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
