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
    <div className="flex h-screen w-full bg-[#F4F6F2] overflow-hidden relative">
      {/* ─── Animated PrismaticBurst Subtle Sage Background ───────────────── */}
      <PrismaticBurst
        color1="#547A60"
        color2="#E3EBE2"
        color3="#D5E5D5"
        color4="#F4F6F2"
        speed={0.12}
        intensity={0.25}
        rays={8.0}
        grain={0.01}
        mouseInfluence={0.1}
        opacity={0.25}
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


