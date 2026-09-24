import React from 'react';
import { useChat } from '../context/ChatContext';
import Sidebar from '../components/sidebar/Sidebar';
import ChatWindow from '../components/chat/ChatWindow';
import UserSearchModal from '../components/modals/UserSearchModal';
import CreateGroupModal from '../components/modals/CreateGroupModal';
import GroupDetailsModal from '../components/modals/GroupDetailsModal';

const ChatDashboard = () => {
  const { activeConversation } = useChat();

  return (
    <div className="flex h-screen w-full bg-surface overflow-hidden">
      {/* 
        Mobile Layout:
        - If activeConversation is null: show Sidebar (full width), hide ChatWindow.
        - If activeConversation is selected: hide Sidebar, show ChatWindow (full width).
        
        Desktop Layout:
        - Side-by-side: Sidebar (fixed width) + ChatWindow (flex-1).
      */}
      <div
        className={`h-full ${
          activeConversation ? 'hidden md:flex' : 'flex w-full md:w-auto'
        }`}
      >
        <Sidebar />
      </div>

      <div
        className={`flex-1 h-full ${
          activeConversation ? 'flex w-full' : 'hidden md:flex'
        }`}
      >
        <ChatWindow />
      </div>

      {/* Global Modals */}
      <UserSearchModal />
      <CreateGroupModal />
      <GroupDetailsModal />
    </div>
  );
};

export default ChatDashboard;
