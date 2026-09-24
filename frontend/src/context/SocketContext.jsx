import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user, getSocketTicket } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [connected, setConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    let active = true;

    const connectSocket = async () => {
      if (!user) {
        if (socketRef.current) {
          socketRef.current.disconnect();
          socketRef.current = null;
          setSocket(null);
          setConnected(false);
        }
        return;
      }

      // Obtain short-lived socket ticket from backend
      const ticket = await getSocketTicket();
      if (!ticket || !active) return;

      const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

      const newSocket = io(socketUrl, {
        auth: { ticket },
        withCredentials: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 1000,
      });

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('connect_error', async (err) => {
        console.warn('Socket connection error:', err.message);
        // Refresh ticket on auth failure
        if (err.message.includes('ticket') || err.message.includes('Authentication')) {
          const freshTicket = await getSocketTicket();
          if (freshTicket) {
            newSocket.auth = { ticket: freshTicket };
            newSocket.connect();
          }
        }
      });

      // Presence status updates
      newSocket.on('user_status', ({ userId, isOnline }) => {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          if (isOnline) {
            next.add(userId);
          } else {
            next.delete(userId);
          }
          return next;
        });
      });

      socketRef.current = newSocket;
      setSocket(newSocket);
    };

    connectSocket();

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
