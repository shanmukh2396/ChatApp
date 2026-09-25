import React from 'react';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Video } from 'lucide-react';

const IncomingCallModal = () => {
  const { callStatus, callType, partner, acceptCall, declineCall } = useCall();

  if (callStatus !== 'incoming' || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-[#0f2d1c] border border-[#204e35] rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient Ringing Pulse */}
        <div className="absolute inset-0 bg-[#10B981]/10 rounded-3xl animate-pulse-slow pointer-events-none" />

        {/* Incoming Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#6ee7b7] text-xs font-bold mb-5">
          {callType === 'video' ? (
            <Video className="w-3.5 h-3.5" />
          ) : (
            <Phone className="w-3.5 h-3.5" />
          )}
          <span>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</span>
        </div>

        {/* Caller Avatar with Ringing Wave Effect */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-[#10B981]/30 animate-ping" />
          <img
            src={partner.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt={partner.name}
            className="w-24 h-24 rounded-full object-cover border-3 border-[#10B981] relative z-10 shadow-xl"
          />
        </div>

        {/* Caller Name */}
        <h3 className="text-xl font-black text-white mb-1 tracking-tight">
          {partner.name}
        </h3>
        <p className="text-xs text-[#9bb8a8] mb-8 font-medium">
          ConnectHub {callType === 'video' ? 'Video' : 'Audio'} Call...
        </p>

        {/* Accept & Decline Buttons */}
        <div className="flex items-center justify-center gap-8 relative z-10">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => declineCall('Declined by user')}
              title="Decline"
              className="w-14 h-14 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-600/30 transition-all duration-200 active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold text-red-400">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={acceptCall}
              title="Accept"
              className="w-14 h-14 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-lg shadow-[#10B981]/30 transition-all duration-200 active:scale-95 animate-bounce"
            >
              <Phone className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold text-emerald-400">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
