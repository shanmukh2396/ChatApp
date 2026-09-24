// Utility: format timestamps for messages and conversation previews
import { format, isToday, isYesterday, formatDistanceToNow } from 'date-fns';

/**
 * Format a message timestamp for display inside a chat window.
 * e.g. "10:45 AM"
 */
export const formatMessageTime = (date) => {
  return format(new Date(date), 'h:mm a');
};

/**
 * Format a conversation's latestMessage timestamp for the sidebar.
 * - Today    → "10:45 AM"
 * - Yesterday → "Yesterday"
 * - Older     → "Sep 20"
 */
export const formatConversationTime = (date) => {
  const d = new Date(date);
  if (isToday(d))     return format(d, 'h:mm a');
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMM d');
};

/**
 * Format lastSeen for user presence.
 * e.g. "last seen 5 minutes ago"
 */
export const formatLastSeen = (date) => {
  if (!date) return 'last seen a while ago';
  return `last seen ${formatDistanceToNow(new Date(date), { addSuffix: true })}`;
};

/**
 * Format file size in human-readable form.
 * e.g. 1048576 → "1.0 MB"
 */
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
};
