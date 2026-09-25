import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { Search, X, UserPlus, MessageSquare, Loader2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#171827] border border-[#202235] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#202235]">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
            <UserPlus className="w-5 h-5 text-[#F20D3A]" />
            <span>Find Contacts</span>
          </h2>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-2 rounded-xl text-[#9293A5] hover:text-white hover:bg-[#202235] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-[#202235]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9293A5] w-4 h-4" />
            <input
              type="text"
              autoFocus
              placeholder="Search by name or email address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-[#131420] text-white placeholder-[#9293A5] border border-[#202235] rounded-xl pl-10 pr-4 py-2.5 text-xs transition-all duration-200 focus:outline-none focus:border-[#F20D3A] focus:ring-2 focus:ring-[#F20D3A]/20"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1 divide-y divide-[#202235]/40">
          {loading ? (
            <div className="py-16 text-center text-[#9293A5] text-xs flex flex-col items-center gap-2.5">
              <Loader2 className="w-6 h-6 text-[#F20D3A] animate-spin" />
              <span>Searching ConnectHub users...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="py-16 text-center text-[#9293A5] text-xs px-4">
              {query ? 'No contacts found matching your query' : 'Type a name or email to search users'}
            </div>
          ) : (
            users.map((u) => {
              const isOnline = onlineUsers.has(u._id);
              return (
                <div
                  key={u._id}
                  onClick={() => !startingChat && handleStartChat(u._id)}
                  className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#202235] cursor-pointer transition-all duration-200 group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-10 h-10 rounded-2xl object-cover border border-[#202235]"
                      />
                      {isOnline && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#171827]" />
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white group-hover:text-[#FF8BA2] transition-colors">
                        {u.name}
                      </h4>
                      <p className="text-xs text-[#9293A5]">{u.email}</p>
                    </div>
                  </div>
                  <button
                    disabled={startingChat}
                    className="px-3 py-1.5 rounded-xl bg-[#F20D3A] hover:bg-[#D90B32] text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Chat</span>
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
