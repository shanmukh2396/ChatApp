import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingMap, setTypingMap] = useState({}); // { [conversationId]: { userId, userName } }

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isGroupDetailsOpen, setIsGroupDetailsOpen] = useState(false);

  const activeConversationRef = useRef(activeConversation);
  useEffect(() => {
    activeConversationRef.current = activeConversation;
  }, [activeConversation]);

  // ─── Fetch Conversations ───────────────────────────────────────────────────
  const fetchConversations = useCallback(async () => {
    if (!user) return;
    setLoadingConversations(true);
    try {
      const { data } = await api.get('/conversations');
      if (data.success) {
        setConversations(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ─── Select & Load Conversation ───────────────────────────────────────────
  const selectConversation = useCallback(
    async (conversation) => {
      if (!conversation) {
        setActiveConversation(null);
        setMessages([]);
        return;
      }

      // Leave previous socket room
      if (activeConversationRef.current && socket) {
        socket.emit('leave_conversation', activeConversationRef.current._id);
      }

      setActiveConversation(conversation);
      setLoadingMessages(true);

      try {
        // Join socket room
        if (socket) {
          socket.emit('join_conversation', conversation._id);
          socket.emit('mark_read', { conversationId: conversation._id });
        }

        // Fetch messages
        const { data } = await api.get(`/messages/${conversation._id}`);
        if (data.success) {
          setMessages(data.data);
        }

        // Mark as read in backend
        await api.put(`/messages/${conversation._id}/read`);

        // Reset unread count locally
        setConversations((prev) =>
          prev.map((c) => {
            if (c._id === conversation._id) {
              const updatedMeta = (c.memberMeta || []).map((m) =>
                m.user === user?._id || m.user?._id === user?._id
                  ? { ...m, unreadCount: 0 }
                  : m
              );
              return { ...c, memberMeta: updatedMeta };
            }
            return c;
          })
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
        toast.error('Could not load chat history');
      } finally {
        setLoadingMessages(false);
      }
    },
    [socket, user]
  );

  // ─── Send Message ──────────────────────────────────────────────────────────
  const sendMessage = async (content, messageType = 'text', attachment = null) => {
    if (!activeConversation) return;

    try {
      const payload = {
        conversationId: activeConversation._id,
        content,
        messageType,
        attachment,
      };

      const { data } = await api.post('/messages', payload);
      if (data.success) {
        const newMsg = data.data;

        // Append to local messages state
        setMessages((prev) => [...prev, newMsg]);

        // Emit real-time message to room
        if (socket) {
          socket.emit('send_message', {
            conversationId: activeConversation._id,
            message: newMsg,
          });
          socket.emit('stop_typing', {
            conversationId: activeConversation._id,
          });
        }

        // Update latest message in conversation list
        setConversations((prev) =>
          prev.map((c) =>
            c._id === activeConversation._id
              ? { ...c, latestMessage: newMsg, updatedAt: new Date().toISOString() }
              : c
          )
        );

        return { success: true, message: newMsg };
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      return { success: false };
    }
  };

  // ─── Real-time Socket Event Handlers ───────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMsg) => {
      const currentActive = activeConversationRef.current;

      // If message is in currently active chat
      if (currentActive && newMsg.conversation === currentActive._id) {
        setMessages((prev) => {
          // Avoid duplicate messages
          if (prev.some((m) => m._id === newMsg._id)) return prev;
          return [...prev, newMsg];
        });

        // Mark as read immediately since user is actively viewing it
        api.put(`/messages/${currentActive._id}/read`).catch(() => {});
        socket.emit('mark_read', { conversationId: currentActive._id });
      }

      // Update conversations list latest message & unread badge
      setConversations((prev) => {
        let exists = false;
        const updated = prev.map((c) => {
          if (c._id === newMsg.conversation) {
            exists = true;
            const isCurrentlyOpen = currentActive?._id === c._id;
            const updatedMeta = (c.memberMeta || []).map((m) => {
              if (m.user === user?._id || m.user?._id === user?._id) {
                return {
                  ...m,
                  unreadCount: isCurrentlyOpen ? 0 : (m.unreadCount || 0) + 1,
                };
              }
              return m;
            });
            return {
              ...c,
              latestMessage: newMsg,
              updatedAt: new Date().toISOString(),
              memberMeta: updatedMeta,
            };
          }
          return c;
        });

        // If it's a new conversation not yet in the list, refresh list
        if (!exists) {
          fetchConversations();
        }

        return updated.sort(
          (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
        );
      });
    };

    const handleTyping = ({ conversationId, userId, userName, isTyping }) => {
      if (userId === user?._id) return;
      setTypingMap((prev) => ({
        ...prev,
        [conversationId]: isTyping ? { userId, userName } : null,
      }));
    };

    const handleMessagesRead = ({ conversationId, readerId, readAt }) => {
      const currentActive = activeConversationRef.current;
      if (currentActive && currentActive._id === conversationId) {
        setMessages((prev) =>
          prev.map((m) => {
            if (!m.readBy.some((r) => r.user?._id === readerId || r.user === readerId)) {
              return {
                ...m,
                readBy: [...m.readBy, { user: readerId, readAt }],
              };
            }
            return m;
          })
        );
      }
    };

    socket.on('new_message', handleNewMessage);
    socket.on('typing_indicator', handleTyping);
    socket.on('messages_read', handleMessagesRead);

    return () => {
      socket.off('new_message', handleNewMessage);
      socket.off('typing_indicator', handleTyping);
      socket.off('messages_read', handleMessagesRead);
    };
  }, [socket, user, fetchConversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        setConversations,
        activeConversation,
        setActiveConversation,
        messages,
        setMessages,
        loadingConversations,
        loadingMessages,
        typingMap,
        fetchConversations,
        selectConversation,
        sendMessage,
        isSearchOpen,
        setIsSearchOpen,
        isCreateGroupOpen,
        setIsCreateGroupOpen,
        isGroupDetailsOpen,
        setIsGroupDetailsOpen,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
