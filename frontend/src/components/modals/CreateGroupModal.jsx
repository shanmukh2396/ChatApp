import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { useChat } from '../../context/ChatContext';
import { FiUsers, FiX, FiCheck } from 'react-icons/fi';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md bg-surface-card border-surface-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUsers className="text-primary-400" /> Create Group Chat
          </h2>
          <button
            onClick={() => setIsCreateGroupOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleCreateGroup} className="flex flex-col flex-1 overflow-hidden">
          <div className="p-4 space-y-3 border-b border-surface-border">
            {/* Group Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Group Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Project Developers"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="input"
              />
            </div>

            {/* Member Selection Search */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Add Members
              </label>
              <input
                type="text"
                placeholder="Search users to add..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input"
              />
            </div>

            {/* Selected Members Chips */}
            {selectedUsers.length > 0 && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {selectedUsers.map((u) => (
                  <span
                    key={u._id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary-600/30 text-primary-300 text-xs border border-primary-500/40"
                  >
                    <span>{u.name}</span>
                    <button
                      type="button"
                      onClick={() => toggleSelectUser(u)}
                      className="hover:text-white"
                    >
                      <FiX className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* User Results List */}
          <div className="overflow-y-auto flex-1 p-2 divide-y divide-surface-border/40">
            {users.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Search above to find users to add
              </div>
            ) : (
              users.map((u) => {
                const isSelected = selectedUsers.some((sel) => sel._id === u._id);
                return (
                  <div
                    key={u._id}
                    onClick={() => toggleSelectUser(u)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-surface-hover cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img src={u.avatar} alt={u.name} className="w-8 h-8 avatar" />
                      <div>
                        <h4 className="text-sm font-medium text-white">{u.name}</h4>
                        <p className="text-xs text-slate-400">{u.email}</p>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-md flex items-center justify-center border ${
                        isSelected
                          ? 'bg-primary-600 border-primary-500 text-white'
                          : 'border-surface-border'
                      }`}
                    >
                      {isSelected && <FiCheck className="w-3.5 h-3.5" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Submit */}
          <div className="p-4 border-t border-surface-border bg-surface-card">
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full py-2.5 shadow-lg shadow-primary-600/30"
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
