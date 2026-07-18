import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "./AppContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

const SocketProvider = (props) => {
  const { backendurl } = useContext(AppContext);
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(backendurl);

    socketRef.current = newSocket;
    setSocket(newSocket); 

    newSocket.on("connect", () => {});

    newSocket.on("disconnect", () => {});

    return () => newSocket.disconnect();
  }, [backendurl]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;