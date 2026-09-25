import React from 'react';
import { useCall } from '../../context/CallContext';
import { Phone, PhoneOff, Video } from 'lucide-react';

const IncomingCallModal = () => {
  const { callStatus, callType, partner, acceptCall, declineCall } = useCall();

  if (callStatus !== 'incoming' || !partner) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/60 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-sm bg-white border border-sage-300 rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden">
        {/* Ambient Ringing Pulse */}
        <div className="absolute inset-0 bg-forest/5 rounded-3xl animate-pulse-slow pointer-events-none" />

        {/* Incoming Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest/10 border border-forest/20 text-forest text-xs font-bold mb-5">
          {callType === 'video' ? (
            <Video className="w-3.5 h-3.5" />
          ) : (
            <Phone className="w-3.5 h-3.5" />
          )}
          <span>Incoming {callType === 'video' ? 'Video' : 'Voice'} Call</span>
        </div>

        {/* Caller Avatar with Ringing Wave Effect */}
        <div className="relative w-24 h-24 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full bg-forest/20 animate-ping" />
          <img
            src={partner.avatar || 'https://ui-avatars.com/api/?name=User'}
            alt={partner.name}
            className="w-24 h-24 rounded-full object-cover border-4 border-forest/40 relative z-10 shadow-xl"
          />
        </div>

        {/* Caller Name */}
        <h3 className="text-xl font-black text-charcoal mb-1 tracking-tight">
          {partner.name}
        </h3>
        <p className="text-xs text-charcoal-50 mb-8 font-medium">
          ConnectHub {callType === 'video' ? 'Video' : 'Audio'} Call...
        </p>

        {/* Accept & Decline Buttons */}
        <div className="flex items-center justify-center gap-8 relative z-10">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => declineCall('Declined by user')}
              title="Decline"
              className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-all duration-200 active:scale-95"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold text-red-500">Decline</span>
          </div>

          {/* Accept Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={acceptCall}
              title="Accept"
              className="w-14 h-14 rounded-full bg-forest hover:bg-forest-600 text-white flex items-center justify-center shadow-lg shadow-forest/30 transition-all duration-200 active:scale-95 animate-bounce"
            >
              <Phone className="w-6 h-6" />
            </button>
            <span className="text-[11px] font-bold text-forest">Accept</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IncomingCallModal;
