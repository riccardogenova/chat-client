"use client";

import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import io, { Socket } from "socket.io-client";

const SocketContext = createContext(null as Socket | null);

export const useSocket = () => useContext(SocketContext);

interface Props {
  children: ReactNode;
}

export const ProviderSocket = ({ children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [totalUserConnected, setTotalUserConnected] = useState<number | null>(
    null
  );

  useEffect(() => {
    const socketIo = io("http://localhost:8080", {});
    setSocket(socketIo);

    socketIo.on("connect", () => {
      setConnected(true);
    });

    socketIo.on("total-users", (totalUsers) => {
      setTotalUserConnected(totalUsers);
      // if (totalUsers !== totalUserConnected) setTotalUserConnected(totalUsers);
    });

    return () => {
      socketIo.disconnect();
      setConnected(false);
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: 1,
          background: connected ? "#00dd00" : "transparent",
        }}
      />
      <p>Connected users: {totalUserConnected || ""}</p>
      {children}
    </SocketContext.Provider>
  );
};
