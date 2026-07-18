import { createContext, useContext, useState, useCallback } from "react";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("admintoken") || "");
  const backendurl = import.meta.env.VITE_BACKEND_URL;

  const login = useCallback((newToken) => {
    setToken(newToken);
    localStorage.setItem("admintoken", newToken);
  }, []);

  const logout = useCallback(() => {
    setToken("");
    localStorage.removeItem("admintoken");
  }, []);

  return (
    <AdminContext.Provider value={{ token, backendurl, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

const useAdmin = () => useContext(AdminContext);

export { AdminProvider, useAdmin };
