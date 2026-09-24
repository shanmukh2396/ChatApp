import React, { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { FiUsers, FiX, FiUserMinus, FiLogOut, FiShield } from 'react-icons/fi';
import toast from 'react-hot-toast';

const GroupDetailsModal = () => {
  const { user } = useAuth();
  const {
    activeConversation,
    isGroupDetailsOpen,
    setIsGroupDetailsOpen,
    fetchConversations,
    selectConversation,
  } = useChat();

  const [loading, setLoading] = useState(false);

  if (!isGroupDetailsOpen || !activeConversation || !activeConversation.isGroupChat) {
    return null;
  }

  const isAdmin =
    activeConversation.groupAdmin?._id === user?._id ||
    activeConversation.groupAdmin === user?._id;

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Remove this member from the group?')) return;

    setLoading(true);
    try {
      const { data } = await api.put(
        `/conversations/group/${activeConversation._id}/remove`,
        { userId: memberId }
      );
      if (data.success) {
        toast.success('Member removed');
        await fetchConversations();
        selectConversation(data.data);
      }
    } catch (err) {
      toast.error('Failed to remove member');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;

    setLoading(true);
    try {
      const { data } = await api.put(
        `/conversations/group/${activeConversation._id}/leave`
      );
      if (data.success) {
        toast.success('You have left the group');
        await fetchConversations();
        selectConversation(null);
        setIsGroupDetailsOpen(false);
      }
    } catch (err) {
      toast.error('Failed to leave group');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="card w-full max-w-md bg-surface-card border-surface-border shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FiUsers className="text-primary-400" /> Group Info
          </h2>
          <button
            onClick={() => setIsGroupDetailsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-surface-input transition-colors"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Group Profile Header */}
        <div className="p-6 flex flex-col items-center border-b border-surface-border bg-surface/40">
          <img
            src={activeConversation.groupAvatar}
            alt={activeConversation.name}
            className="w-20 h-20 avatar mb-3 border-2 border-primary-500/50 shadow-lg"
          />
          <h3 className="text-lg font-bold text-white text-center">
            {activeConversation.name}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {activeConversation.participants?.length || 0} members
          </p>
        </div>

        {/* Members List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            Group Members
          </h4>
          <div className="space-y-2">
            {activeConversation.participants?.map((member) => {
              const memberIsAdmin =
                activeConversation.groupAdmin?._id === member._id ||
                activeConversation.groupAdmin === member._id;
              const isCurrentUser = member._id === user?._id;

              return (
                <div
                  key={member._id}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-surface-input/50 border border-surface-border/50"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 avatar"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-semibold text-white">
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-primary-400 bg-primary-950/60 px-1.5 py-0.5 rounded border border-primary-800/60">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {memberIsAdmin && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-500/30">
                        <FiShield className="w-3 h-3" /> Admin
                      </span>
                    )}
                    {isAdmin && !memberIsAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={loading}
                        title="Remove member"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      >
                        <FiUserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-surface-border bg-surface-card flex justify-between items-center">
          <button
            onClick={handleLeaveGroup}
            disabled={loading}
            className="btn-danger w-full py-2.5 text-sm"
          >
            <FiLogOut className="w-4 h-4" /> Leave Group
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
