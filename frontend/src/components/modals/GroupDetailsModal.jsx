import React, { useState } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { Users, X, UserMinus, LogOut, ShieldCheck } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-md bg-[#171827] border border-[#202235] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#202235]">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#F20D3A]" />
            <span>Group Info</span>
          </h2>
          <button
            onClick={() => setIsGroupDetailsOpen(false)}
            className="p-2 rounded-xl text-[#9293A5] hover:text-white hover:bg-[#202235] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Profile Header */}
        <div className="p-6 flex flex-col items-center border-b border-[#202235] bg-[#131420]/60">
          <img
            src={activeConversation.groupAvatar}
            alt={activeConversation.name}
            className="w-20 h-20 rounded-3xl object-cover mb-3 border-2 border-[#F20D3A]/50 shadow-xl"
          />
          <h3 className="text-lg font-extrabold text-white text-center">
            {activeConversation.name}
          </h3>
          <p className="text-xs text-[#9293A5] mt-1 font-semibold">
            {activeConversation.participants?.length || 0} active members
          </p>
        </div>

        {/* Members List */}
        <div className="p-4 flex-1 overflow-y-auto">
          <h4 className="text-xs font-bold text-[#9293A5] uppercase tracking-wider mb-3">
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
                  className="flex items-center justify-between p-3 rounded-2xl bg-[#202235]/60 border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">
                          {member.name}
                        </span>
                        {isCurrentUser && (
                          <span className="text-[10px] text-[#FF8BA2] bg-[#F20D3A]/20 px-2 py-0.5 rounded-md font-bold border border-[#F20D3A]/30">
                            You
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#9293A5]">{member.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {memberIsAdmin && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-500/30">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    )}
                    {isAdmin && !memberIsAdmin && (
                      <button
                        onClick={() => handleRemoveMember(member._id)}
                        disabled={loading}
                        title="Remove member"
                        className="p-1.5 rounded-xl text-[#9293A5] hover:text-[#F20D3A] hover:bg-[#F20D3A]/10 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer Action: Leave Group */}
        <div className="p-4 border-t border-[#202235] bg-[#171827]">
          <button
            onClick={handleLeaveGroup}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 font-bold text-xs flex items-center justify-center gap-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Leave Group Channel</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GroupDetailsModal;
