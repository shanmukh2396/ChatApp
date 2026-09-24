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

      // Obtain socket ticket or fallback auth token
      const ticket = await getSocketTicket();
      if (!ticket || !active) return;

      const rawSocketUrl =
        import.meta.env.VITE_SOCKET_URL ||
        (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '') : null) ||
        (import.meta.env.PROD ? 'https://chatapp-813y.onrender.com' : 'http://localhost:5000');

      const socketUrl = rawSocketUrl.replace(/\/+$/, '');
      const storedToken = localStorage.getItem('chat_token');

      const newSocket = io(socketUrl, {
        auth: { ticket, token: storedToken },
        withCredentials: true,
        transports: ['websocket', 'polling'], // Fallback transport for resilient connections
        reconnectionAttempts: 15,
        reconnectionDelay: 1000,
        timeout: 20000,
      });

      newSocket.on('connect', () => {
        setConnected(true);
      });

      newSocket.on('disconnect', () => {
        setConnected(false);
      });

      newSocket.on('connect_error', async (err) => {
        console.warn('Socket connection error:', err.message);
        // Refresh ticket / token on auth failure
        if (err.message.includes('ticket') || err.message.includes('Authentication') || err.message.includes('token')) {
          const freshTicket = await getSocketTicket();
          if (freshTicket) {
            newSocket.auth = { ticket: freshTicket, token: localStorage.getItem('chat_token') };
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
