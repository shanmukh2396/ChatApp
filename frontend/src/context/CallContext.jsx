import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { useAuth } from './AuthContext';
import { useSocket } from './SocketContext';
import toast from 'react-hot-toast';

const CallContext = createContext(null);

const ICE_SERVERS = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
  ],
};

export const CallProvider = ({ children }) => {
  const { user } = useAuth();
  const { socket } = useSocket();

  const [callStatus, setCallStatus] = useState('idle'); // 'idle' | 'calling' | 'incoming' | 'connected' | 'ended' | 'failed'
  const [callType, setCallType] = useState('voice'); // 'voice' | 'video'
  const [partner, setPartner] = useState(null); // { _id, name, avatar }
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const pcRef = useRef(null);
  const localStreamRef = useRef(null);
  const pendingOfferRef = useRef(null);
  const timerRef = useRef(null);

  // Helper to cleanup media tracks & connection
  const cleanupCall = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setCallStatus('idle');
    setPartner(null);
    setIsMuted(false);
    setIsCameraOff(false);
    setCallDuration(0);
    pendingOfferRef.current = null;
  }, []);

  // Format seconds to mm:ss
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ─── Socket Signaling Event Handlers ───────────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    // 1. Incoming call received
    const handleIncomingCall = (data) => {
      // If already in a call, automatically decline with busy status
      if (callStatus !== 'idle') {
        socket.emit('call_declined', {
          callerId: data.callerId,
          reason: 'User is currently busy on another call',
        });
        return;
      }

      setCallType(data.callType || 'voice');
      setPartner({
        _id: data.callerId,
        name: data.callerName || 'User',
        avatar: data.callerAvatar,
      });
      pendingOfferRef.current = data.offer;
      setCallStatus('incoming');
    };

    // 2. Caller receives call acceptance
    const handleCallAccepted = async (data) => {
      if (!pcRef.current) return;

      try {
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(data.answer)
        );
        setCallStatus('connected');

        // Start duration timer
        timerRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      } catch (err) {
        console.error('Error handling call_accepted answer:', err);
        toast.error('Failed to establish peer connection');
        cleanupCall();
      }
    };

    // 3. Call declined by recipient
    const handleCallDeclined = (data) => {
      toast.error(data.reason || 'Call was declined');
      cleanupCall();
    };

    // 4. Partner ended the call
    const handleCallEnded = () => {
      toast('Call ended', { icon: '📞' });
      cleanupCall();
    };

    // 5. ICE Candidate exchange
    const handleIceCandidate = async (data) => {
      if (pcRef.current && data.candidate) {
        try {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        } catch (err) {
          console.error('Error adding ICE candidate:', err);
        }
      }
    };

    socket.on('incoming_call', handleIncomingCall);
    socket.on('call_accepted', handleCallAccepted);
    socket.on('call_declined', handleCallDeclined);
    socket.on('call_ended', handleCallEnded);
    socket.on('ice_candidate', handleIceCandidate);

    return () => {
      socket.off('incoming_call', handleIncomingCall);
      socket.off('call_accepted', handleCallAccepted);
      socket.off('call_declined', handleCallDeclined);
      socket.off('call_ended', handleCallEnded);
      socket.off('ice_candidate', handleIceCandidate);
    };
  }, [socket, callStatus, cleanupCall]);

  // ─── Initialize PeerConnection Helper ──────────────────────────────────────
  const createPeerConnection = (targetUserId) => {
    const pc = new RTCPeerConnection(ICE_SERVERS);

    // Send ICE candidates to partner
    pc.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit('ice_candidate', {
          targetUserId,
          candidate: event.candidate,
        });
      }
    };

    // Receive Remote Stream tracks
    pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        setRemoteStream(event.streams[0]);
      }
    };

    // Connection state changes
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
        toast.error('Call connection lost');
        cleanupCall();
      }
    };

    pcRef.current = pc;
    return pc;
  };

  // ─── Start Call (Caller Action) ───────────────────────────────────────────
  const startCall = async (recipient, type = 'voice') => {
    if (!socket || !recipient || !user) return;
    if (callStatus !== 'idle') return;

    setCallType(type);
    setPartner(recipient);
    setCallStatus('calling');

    try {
      const constraints = {
        audio: true,
        video: type === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = createPeerConnection(recipient._id);

      // Add local tracks to peer connection
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      // Create WebRTC Offer
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      // Send call signaling via Socket
      socket.emit('call_user', {
        receiverId: recipient._id,
        callerName: user.name,
        callerAvatar: user.avatar,
        callType: type,
        offer,
      });
    } catch (err) {
      console.error('Error starting call:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        toast.error(`Please allow ${type === 'video' ? 'camera & mic' : 'microphone'} access to place calls.`);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        toast.error('No microphone or camera device found on your device.');
      } else {
        toast.error('Failed to initiate call: ' + err.message);
      }
      cleanupCall();
    }
  };

  // ─── Accept Call (Receiver Action) ────────────────────────────────────────
  const acceptCall = async () => {
    if (!socket || !partner || !pendingOfferRef.current) return;

    try {
      const constraints = {
        audio: true,
        video: callType === 'video' ? { width: { ideal: 1280 }, height: { ideal: 720 } } : false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      const pc = createPeerConnection(partner._id);

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      await pc.setRemoteDescription(
        new RTCSessionDescription(pendingOfferRef.current)
      );

      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      socket.emit('call_accepted', {
        callerId: partner._id,
        answer,
      });

      setCallStatus('connected');

      // Start duration timer
      timerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Error accepting call:', err);
      toast.error('Could not access audio/video hardware.');
      declineCall('Hardware error');
    }
  };

  // ─── Decline Call ─────────────────────────────────────────────────────────
  const declineCall = (reason = 'Call declined') => {
    if (socket && partner) {
      socket.emit('call_declined', {
        callerId: partner._id,
        reason,
      });
    }
    cleanupCall();
  };

  // ─── End Active Call ──────────────────────────────────────────────────────
  const endCall = () => {
    if (socket && partner) {
      socket.emit('call_ended', {
        partnerId: partner._id,
      });
    }
    cleanupCall();
  };

  // ─── Media Controls: Mute & Camera Toggle ─────────────────────────────────
  const toggleMute = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  };

  const toggleCamera = () => {
    if (localStreamRef.current && callType === 'video') {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsCameraOff(!videoTrack.enabled);
      }
    }
  };

  return (
    <CallContext.Provider
      value={{
        callStatus,
        callType,
        partner,
        localStream,
        remoteStream,
        isMuted,
        isCameraOff,
        callDuration,
        formatDuration,
        startCall,
        acceptCall,
        declineCall,
        endCall,
        toggleMute,
        toggleCamera,
      }}
    >
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};
