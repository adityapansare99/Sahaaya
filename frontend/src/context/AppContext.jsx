import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [Role, setRole] = useState(localStorage.getItem("role") || "Donor");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const backendurl = import.meta.env.VITE_BACKEND_URL;
  const value = {
    Role, 
    setRole,
    token,
    setToken,
    backendurl
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
