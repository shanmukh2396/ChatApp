/**
 * Replaces common text emotion shortcuts with Unicode emojis.
 */
const EMOJI_MAP = [
  { pattern: /(?:^|\s)(<3)(?=\s|$)/g, emoji: '❤️' },
  { pattern: /(?:^|\s)(<\/3)(?=\s|$)/g, emoji: '💔' },
  { pattern: /(?:^|\s)(:\))(?=\s|$)/g, emoji: '😊' },
  { pattern: /(?:^|\s)(:-\))(?=\s|$)/g, emoji: '😊' },
  { pattern: /(?:^|\s)(:D|:-D)(?=\s|$)/g, emoji: '😀' },
  { pattern: /(?:^|\s)(;\)|;-\))(?=\s|$)/g, emoji: '😉' },
  { pattern: /(?:^|\s)(:P|:-P|:p|:-p)(?=\s|$)/g, emoji: '😛' },
  { pattern: /(?:^|\s)(:\(|:-\()(?=\s|$)/g, emoji: '🙁' },
  { pattern: /(?:^|\s)(:'\(|:'-\()(?=\s|$)/g, emoji: '😢' },
  { pattern: /(?:^|\s)(:O|:-O|:o|:-o)(?=\s|$)/g, emoji: '😮' },
  { pattern: /(?:^|\s)(B\)|B-\)|8\)|8-\))(?=\s|$)/g, emoji: '😎' },
  { pattern: /(?:^|\s)(\(y\)|\(Y\))(?=\s|$)/g, emoji: '👍' },
  { pattern: /(?:^|\s)(\(n\)|\(N\))(?=\s|$)/g, emoji: '👎' },
  { pattern: /(?:^|\s)(:fire:)(?=\s|$)/gi, emoji: '🔥' },
  { pattern: /(?:^|\s)(:star:)(?=\s|$)/gi, emoji: '⭐' },
  { pattern: /(?:^|\s)(:check:)(?=\s|$)/gi, emoji: '✅' },
  { pattern: /(?:^|\s)(:100:)(?=\s|$)/gi, emoji: '💯' },
  { pattern: /(?:^|\s)(:wave:)(?=\s|$)/gi, emoji: '👋' },
  { pattern: /(?:^|\s)(:clap:)(?=\s|$)/gi, emoji: '👏' },
  { pattern: /(?:^|\s)(:sparkles:)(?=\s|$)/gi, emoji: '✨' },
];

export const replaceEmojiShortcuts = (text) => {
  if (!text || typeof text !== 'string') return text;

  let result = text;
  for (const { pattern, emoji } of EMOJI_MAP) {
    result = result.replace(pattern, (match, shortcut) => {
      return match.replace(shortcut, emoji);
    });
  }
  return result;
};

export default replaceEmojiShortcuts;
