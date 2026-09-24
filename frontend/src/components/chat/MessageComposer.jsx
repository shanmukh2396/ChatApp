import React, { useState, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { validateFile, isImage } from '../../utils/fileHelpers';
import { FiSend, FiPaperclip, FiX, FiFile, FiImage } from 'react-icons/fi';
import toast from 'react-hot-toast';

const MessageComposer = () => {
  const { user } = useAuth();
  const { activeConversation, sendMessage } = useChat();
  const { socket } = useSocket();

  const [text, setText] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const handleTextChange = (e) => {
    setText(e.target.value);

    // Emit typing indicator to room
    if (socket && activeConversation) {
      socket.emit('typing', {
        conversationId: activeConversation._id,
        userName: user.name,
      });

      // Clear previous timeout and stop typing after 2.5s of inactivity
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stop_typing', {
          conversationId: activeConversation._id,
        });
      }, 2500);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size and format
    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);

    // If image, create local blob preview URL
    if (isImage(file.type)) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) return;

    let attachment = null;
    let messageType = 'text';

    if (selectedFile) {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);

      try {
        const { data } = await api.post('/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (data.success) {
          attachment = data.data;
          messageType = isImage(selectedFile.type) ? 'image' : 'file';
        }
      } catch (err) {
        toast.error('Failed to upload file');
        setUploading(false);
        return;
      }
      setUploading(false);
    }

    const contentToSend = text.trim();
    setText('');
    clearSelectedFile();

    await sendMessage(contentToSend, messageType, attachment);
  };

  return (
    <div className="p-3 sm:p-4 bg-surface-card border-t border-surface-border">
      {/* File Attachment Preview Bar */}
      {selectedFile && (
        <div className="flex items-center gap-3 p-2.5 mb-3 rounded-xl bg-surface-input/80 border border-surface-border animate-slide-up">
          {filePreview ? (
            <img
              src={filePreview}
              alt="Preview"
              className="w-12 h-12 rounded-lg object-cover border border-surface-border"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-primary-600/20 text-primary-400 flex items-center justify-center">
              <FiFile className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {selectedFile.name}
            </p>
            <p className="text-[10px] text-slate-400">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelectedFile}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-surface-border"
          >
            <FiX className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex items-center gap-2">
        {/* Hidden File Input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />

        {/* Attachment Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach file or image"
          className="btn-ghost p-2.5 rounded-xl text-slate-400 hover:text-primary-400 shrink-0"
        >
          <FiPaperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={handleTextChange}
          className="input flex-1 py-2.5"
          disabled={uploading}
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedFile) || uploading}
          className="btn-primary p-2.5 sm:px-4 shrink-0 shadow-md shadow-primary-600/20"
        >
          {uploading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <FiSend className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageComposer;
