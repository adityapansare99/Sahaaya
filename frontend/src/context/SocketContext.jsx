import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = (props) => {
  const { backendurl, token } = useContext(AppContext);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Only connect socket when user is authenticated
    if (!token) {
      // Clean up any existing connection when token becomes falsy
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
      }
      return;
    }

    const newSocket = io(backendurl);

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on("connect", () => {});

    newSocket.on("disconnect", () => {});

    return () => newSocket.disconnect();
  }, [backendurl, token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;