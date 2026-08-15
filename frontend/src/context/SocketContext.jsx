import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = (props) => {
  const { backendurl, token, logout } = useContext(AppContext);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  const logoutRef = useRef(logout);
  logoutRef.current = logout;

  useEffect(() => {
    if (!token) {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const newSocket = io(backendurl, { auth: { token } });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {});

    newSocket.on("disconnect", () => {});

    newSocket.on("connect_error", (err) => {
      if (err?.message === "unauthorized") logoutRef.current?.();
    });

    return () => newSocket.disconnect();
  }, [backendurl, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;