import React, { useState, useRef } from 'react';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useSocket } from '../../context/SocketContext';
import { validateFile, isImage } from '../../utils/fileHelpers';
import { Send, Paperclip, X, FileText, Loader2 } from 'lucide-react';
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

    if (socket && activeConversation) {
      socket.emit('typing', {
        conversationId: activeConversation._id,
        userName: user?.name || 'User',
      });

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

    const error = validateFile(file);
    if (error) {
      toast.error(error);
      return;
    }

    setSelectedFile(file);

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
    <div className="p-3 sm:p-4 bg-white/80 backdrop-blur-xl border-t border-sage-300 shrink-0">
      {/* ─── File Attachment Preview Bar ─────────────────────────────────── */}
      {selectedFile && (
        <div className="flex items-center gap-3 p-3 mb-3 rounded-2xl bg-sage-100 border border-sage-300 animate-slide-up shadow-sm">
          {filePreview ? (
            <img
              src={filePreview}
              alt="Preview"
              className="w-12 h-12 rounded-xl object-cover border border-sage-300"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-forest/10 text-forest flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-charcoal truncate">
              {selectedFile.name}
            </p>
            <p className="text-[10px] text-charcoal-50">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={clearSelectedFile}
            className="p-1.5 rounded-full text-charcoal-50 hover:text-charcoal hover:bg-sage-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ─── Composer Form ───────────────────────────────────────────────── */}
      <form onSubmit={handleSend} className="flex items-center gap-2.5">
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
          title="Attach photo or document"
          className="p-2.5 rounded-xl bg-sage-100 text-charcoal-100 hover:text-forest hover:bg-sage-200 border border-sage-300 transition-all duration-200 shrink-0"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type your message..."
          value={text}
          onChange={handleTextChange}
          disabled={uploading}
          className="flex-1 bg-white text-charcoal placeholder-charcoal-50 border border-sage-300 rounded-xl px-4 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:border-forest focus:ring-2 focus:ring-forest/20 disabled:opacity-50"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={(!text.trim() && !selectedFile) || uploading}
          className="p-2.5 sm:px-5 rounded-xl bg-forest hover:bg-forest-600 active:bg-forest-700 text-white font-bold text-sm shadow-sm transition-all duration-200 active:scale-[0.98] shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {uploading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <div className="flex items-center gap-1.5">
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default MessageComposer;
