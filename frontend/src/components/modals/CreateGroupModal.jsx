import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useChat } from '../../context/ChatContext';
import { Users, X, Check, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateGroupModal = () => {
  const {
    isCreateGroupOpen,
    setIsCreateGroupOpen,
    fetchConversations,
    selectConversation,
  } = useChat();

  const [groupName, setGroupName] = useState('');
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isCreateGroupOpen) {
      setGroupName('');
      setQuery('');
      setUsers([]);
      setSelectedUsers([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
        if (data.success) {
          setUsers(data.data);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isCreateGroupOpen]);

  const toggleSelectUser = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      setSelectedUsers((prev) => prev.filter((u) => u._id !== user._id));
    } else {
      setSelectedUsers((prev) => [...prev, user]);
    }
  };

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      return toast.error('Please enter a group name');
    }
    if (selectedUsers.length < 1) {
      return toast.error('Please select at least 1 member');
    }

    setSubmitting(true);
    try {
      const payload = {
        name: groupName.trim(),
        members: selectedUsers.map((u) => u._id),
      };

      const { data } = await api.post('/conversations/group', payload);
      if (data.success) {
        toast.success(`Group "${groupName}" created!`);
        await fetchConversations();
        selectConversation(data.data);
        setIsCreateGroupOpen(false);
      }
    } catch (err) {
      toast.error('Failed to create group');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isCreateGroupOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#0c2417] border border-[#18422b] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#18422b]">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#10B981]" />
            <span>Create Group Channel</span>
          </h2>
          <button
            onClick={() => setIsCreateGroupOpen(false)}
            className="p-2 rounded-xl text-[#9bb8a8] hover:text-white hover:bg-[#18422b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateGroup} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 sm:p-5 space-y-3.5 border-b border-[#18422b]">
            {/* Group Name */}
            <div>
              <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Design Team or Project Squad"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-[#071a0f] text-white placeholder-[#9bb8a8] border border-[#18422b] rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
              />
            </div>

            {/* Member Search */}
            <div>
              <label className="block text-xs font-bold text-[#9bb8a8] uppercase tracking-wider mb-1.5">
                Add Members ({selectedUsers.length} selected)
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9bb8a8] w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users to add..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full bg-[#071a0f] text-white placeholder-[#9bb8a8] border border-[#18422b] rounded-xl pl-10 pr-4 py-2 text-xs focus:outline-none focus:border-[#10B981] focus:ring-2 focus:ring-[#10B981]/20 transition-all"
                />
              </div>
            </div>

            {/* Selected Members Chips */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedUsers.map((u) => (
                  <span
                    key={u._id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#10B981]/20 text-[#6ee7b7] text-xs font-semibold border border-[#10B981]/30"
                  >
                    <span>{u.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectUser(u)}
                      className="hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* User Results List */}
          <div className="overflow-y-auto flex-1 p-3 space-y-1 divide-y divide-[#18422b]/40">
            {users.length === 0 ? (
              <div className="py-8 text-center text-[#9bb8a8] text-xs">
                Search above to find members to add to the group
              </div>
            ) : (
              users.map((u) => {
                const isSelected = selectedUsers.some((sel) => sel._id === u._id);
                return (
                  <div
                    key={u._id}
                    onClick={() => toggleSelectUser(u)}
                    className="flex items-center justify-between p-2.5 rounded-2xl hover:bg-[#18422b] cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-white">{u.name}</h4>
                        <p className="text-xs text-[#9bb8a8]">{u.email}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-lg flex items-center justify-center border transition-colors ${
                        isSelected
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'border-[#18422b] bg-[#071a0f]'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Submit */}
          <div className="p-4 border-t border-[#18422b] bg-[#0c2417]">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-2xl bg-[#10B981] hover:bg-[#059669] active:bg-[#047857] text-white font-bold text-sm shadow-lg shadow-[#10B981]/25 transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
            >
              {submitting ? 'Creating Group...' : `Create Group (${selectedUsers.length} members)`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;

