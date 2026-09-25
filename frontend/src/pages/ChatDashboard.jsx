import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import NavSidebar from '../components/sidebar/NavSidebar';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import UserSearchModal from '../components/modals/UserSearchModal';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import GroupDetailsModal from '../components/modals/GroupDetailsModal';
import PrismaticBurst from '../components/backgrounds/PrismaticBurst';

const ChatDashboard = () => {
  const { activeConversation } = useChat();
  const [filterTab, setFilterTab] = useState('all');

  return (
    <div className="flex h-screen w-full bg-[#071a0f] overflow-hidden relative">
      {/* ─── Animated PrismaticBurst Ambient Background Effect ───────────── */}
      <PrismaticBurst
        color1="#042f1a"
        color2="#064e3b"
        color3="#059669"
        color4="#10b981"
        speed={0.2}
        intensity={0.45}
        rays={14.0}
        grain={0.03}
        mouseInfluence={0.2}
        opacity={0.35}
      />

      {/* ─── Column 1: Slim Left Navigation Bar (Desktop) ────────────────── */}
      <NavSidebar activeTab={filterTab} onTabChange={setFilterTab} />

      {/* ─── Column 2: Conversations List Sidebar ────────────────────────── */}
      <div
        className={`h-full relative z-10 ${
          activeConversation ? 'hidden md:flex' : 'flex w-full md:w-auto'
        }`}
      >
        <Sidebar filterTab={filterTab} setFilterTab={setFilterTab} />
      </div>

      {/* ─── Column 3: Main Chat Window ──────────────────────────────────── */}
      <div
        className={`flex-1 h-full relative z-10 ${
          activeConversation ? 'flex w-full' : 'hidden md:flex'
        }`}
      >
        <ChatWindow />
      </div>

      {/* ─── Modals ──────────────────────────────────────────────────────── */}
      <UserSearchModal />
      <CreateGroupModal />
      <GroupDetailsModal />
    </div>
  );
};

export default ChatDashboard;

