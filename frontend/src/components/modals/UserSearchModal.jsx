import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { FiSearch, FiX, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';

const UserSearchModal = () => {
  const { isSearchOpen, setIsSearchOpen, selectConversation, fetchConversations } =
    useChat();
  const { onlineUsers } = useSocket();

  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startingChat, setStartingChat] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, isSearchOpen]);

  const handleStartChat = async (userId) => {
    setStartingChat(true);
    try {
      const { data } = await api.post('/conversations', { userId });
      if (data.success) {
        await fetchConversations();
        selectConversation(data.data);
        setIsSearchOpen(false);
      }
    } catch (err) {
      toast.error('Failed to start conversation');
    } finally {
      setStartingChat(false);
    }
  };

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md bg-surface-card border-surface-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUserPlus className="text-primary-400" /> Start New Chat
          </h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-surface-border">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              autoFocus
              placeholder="Search users by name or email..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto flex-1 p-2 divide-y divide-surface-border/40">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Searching users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              {query ? 'No users found matching query' : 'Type a name or email to search'}
            </div>
          ) : (
            users.map((u) => {
              const isOnline = onlineUsers.has(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => !startingChat && handleStartChat(u._id)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 avatar"
                      />
                      {isOnline && <span className="online-dot" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">{u.name}</h4>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <button
                    disabled={startingChat}
                    className="btn-primary py-1.5 px-3 text-xs"
                  >
                    Chat
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSearchModal;
