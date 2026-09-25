import React, { useState } from 'react';
import { useChat } from '../context/ChatContext';
import NavSidebar from '../components/sidebar/NavSidebar';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import UserSearchModal from '../components/modals/UserSearchModal';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import GroupDetailsModal from '../components/modals/GroupDetailsModal';

const ChatDashboard = () => {
  const { activeConversation } = useChat();
  const [filterTab, setFilterTab] = useState('all');

  return (
    <div className="flex h-screen w-full bg-[#11121d] overflow-hidden">
      {/* ─── Column 1: Slim Left Navigation Bar (Desktop) ────────────────── */}
      <NavSidebar activeTab={filterTab} onTabChange={setFilterTab} />

      {/* ─── Column 2: Conversations List Sidebar ────────────────────────── */}
      <div
        className={`h-full ${
          activeConversation ? 'hidden md:flex' : 'flex w-full md:w-auto'
        }`}
      >
        <Sidebar filterTab={filterTab} setFilterTab={setFilterTab} />
      </div>

      {/* ─── Column 3: Main Chat Window ──────────────────────────────────── */}
      <div
        className={`flex-1 h-full ${
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
