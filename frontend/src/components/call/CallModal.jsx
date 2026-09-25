import React, { useEffect, useRef } from 'react';
import { useCall } from '../../context/CallContext';
import {
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  Signal,
} from 'lucide-react';

const CallModal = () => {
  const {
    callStatus,
    callType,
    partner,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    callDuration,
    formatDuration,
    endCall,
    toggleMute,
    toggleCamera,
  } = useCall();

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  // Attach local stream to video element
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  // Attach remote stream to video element
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Render when call is either calling or connected
  if (callStatus !== 'calling' && callStatus !== 'connected') {
    return null;
  }

  const isVideo = callType === 'video';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-charcoal/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-[#26332B] border border-[#547A60]/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col relative h-[580px] sm:h-[620px]">
        {/* ─── Call Header Bar ─────────────────────────────────────────────── */}
        <div className="absolute top-0 inset-x-0 p-4 sm:p-5 flex items-center justify-between z-20 bg-gradient-to-b from-black/70 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#547A60]/30 border border-[#547A60]/40 flex items-center justify-center text-[#D5E5D5]">
              {isVideo ? <Video className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold text-white">
                {partner?.name || 'User'}
              </h3>
              <p className="text-xs text-[#E3EBE2] flex items-center gap-1.5 font-semibold">
                <Signal className="w-3.5 h-3.5 text-[#547A60] animate-pulse" />
                <span>
                  {callStatus === 'calling'
                    ? 'Calling...'
                    : `Connected • ${formatDuration(callDuration)}`}
                </span>
              </p>
            </div>
          </div>

          <span className="px-3 py-1 rounded-full bg-[#547A60]/40 border border-[#547A60]/50 text-xs font-bold text-[#D5E5D5]">
            {isVideo ? 'HD Video' : 'HD Voice'}
          </span>
        </div>

        {/* ─── Main Viewport Area ─────────────────────────────────────────── */}
        <div className="flex-1 w-full h-full relative flex items-center justify-center bg-[#1c2620] overflow-hidden">
          {/* VIDEO CALL VIEW */}
          {isVideo ? (
            <div className="w-full h-full relative">
              {/* Remote Video (Main Display) */}
              {remoteStream ? (
                <video
                  ref={remoteVideoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-center p-6 bg-[#26332B]">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#547A60]/40 mb-4 shadow-xl">
                    <img
                      src={partner?.avatar || 'https://ui-avatars.com/api/?name=User'}
                      alt={partner?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-1">
                    {callStatus === 'calling' ? 'Ringing...' : 'Connecting video stream...'}
                  </h4>
                  <p className="text-xs text-[#E3EBE2]/70">
                    {partner?.name} will appear once connected
                  </p>
                </div>
              )}

              {/* Local Video Picture-in-Picture (PiP) */}
              <div className="absolute bottom-24 right-4 w-32 sm:w-44 h-44 sm:h-56 rounded-2xl overflow-hidden border-2 border-[#547A60] shadow-2xl z-20 bg-black">
                {isCameraOff ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-[#26332B] text-[#E3EBE2] text-xs p-2 text-center">
                    <VideoOff className="w-6 h-6 mb-1 text-red-400" />
                    <span>Camera Off</span>
                  </div>
                ) : (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover mirror"
                  />
                )}
              </div>
            </div>
          ) : (
            /* VOICE CALL VIEW */
            <div className="flex flex-col items-center justify-center text-center p-6 relative z-10">
              {/* Pulsing Avatar */}
              <div className="relative w-32 h-32 mb-6">
                <div className="absolute inset-0 rounded-full bg-[#547A60]/30 animate-ping" />
                <img
                  src={partner?.avatar || 'https://ui-avatars.com/api/?name=User'}
                  alt={partner?.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#547A60] relative z-10 shadow-2xl"
                />
              </div>

              <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                {partner?.name}
              </h3>

              {/* Audio Waveform Visualization */}
              <div className="flex items-center gap-1.5 my-4 h-8">
                {[40, 70, 90, 60, 100, 50, 80, 45, 95, 65, 85, 30].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 bg-[#547A60] rounded-full animate-pulse"
                    style={{
                      height: callStatus === 'connected' ? `${h}%` : '20%',
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>

              <p className="text-sm text-[#E3EBE2]/80 font-semibold">
                {callStatus === 'calling'
                  ? 'Calling...'
                  : `In Call • ${formatDuration(callDuration)}`}
              </p>
            </div>
          )}
        </div>

        {/* ─── Bottom Floating Controls Bar ───────────────────────────────── */}
        <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 flex items-center justify-center gap-5 z-30 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            className={`p-3.5 rounded-full transition-all duration-200 ${
              isMuted
                ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                : 'bg-[#547A60]/40 text-white hover:bg-[#547A60]/60 border border-white/20'
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          {/* Camera Toggle (for video calls) */}
          {isVideo && (
            <button
              onClick={toggleCamera}
              title={isCameraOff ? 'Turn on camera' : 'Turn off camera'}
              className={`p-3.5 rounded-full transition-all duration-200 ${
                isCameraOff
                  ? 'bg-red-600/30 text-red-400 border border-red-500/40'
                  : 'bg-[#547A60]/40 text-white hover:bg-[#547A60]/60 border border-white/20'
              }`}
            >
              {isCameraOff ? (
                <VideoOff className="w-5 h-5" />
              ) : (
                <Video className="w-5 h-5" />
              )}
            </button>
          )}

          {/* End Call Button */}
          <button
            onClick={endCall}
            title="End Call"
            className="px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 shadow-lg shadow-red-600/40 transition-all duration-200 active:scale-95"
          >
            <PhoneOff className="w-5 h-5" />
            <span className="hidden sm:inline text-xs font-black uppercase tracking-wider">
              End Call
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CallModal;
