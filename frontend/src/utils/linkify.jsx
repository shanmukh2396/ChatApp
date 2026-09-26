import React from 'react';

/**
 * Parses message text and returns React nodes with clickable HTTP/HTTPS links,
 * while safely preserving surrounding text, newlines, emojis, and punctuation.
 */
export const linkifyText = (text, options = {}) => {
  if (!text || typeof text !== 'string') return text || '';

  const { isSelf = false } = options;

  // Regex to match URLs starting with http:// or https://
  // Stops at whitespace
  const urlRegex = /(https?:\/\/[^\s]+)/gi;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = urlRegex.exec(text)) !== null) {
    const fullMatch = match[0];
    const matchIndex = match.index;

    // Push preceding text if any
    if (matchIndex > lastIndex) {
      parts.push(text.substring(lastIndex, matchIndex));
    }

    // Clean trailing sentence punctuation from the matched URL
    let url = fullMatch;
    let trailingPunctuation = '';

    const punctuationRegex = /([.,!?;:)'"\]>]+)$/;
    const punctMatch = url.match(punctuationRegex);
    if (punctMatch) {
      trailingPunctuation = punctMatch[1];
      url = url.slice(0, -trailingPunctuation.length);
    }

    // Strictly validate that URL starts with http:// or https://
    const isSafeScheme = /^https?:\/\//i.test(url);

    if (isSafeScheme && url.length > 8) {
      const linkClass = isSelf
        ? 'underline decoration-1 underline-offset-2 font-semibold text-charcoal hover:text-forest transition-colors break-all'
        : 'underline decoration-1 underline-offset-2 font-semibold text-forest hover:text-forest-700 dark:text-mint dark:hover:text-white transition-colors break-all';

      parts.push(
        <a
          key={`link-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={linkClass}
          title={`Open ${url}`}
        >
          {url}
        </a>
      );

      if (trailingPunctuation) {
        parts.push(trailingPunctuation);
      }
    } else {
      // Fallback: render as raw text if not valid http/https
      parts.push(fullMatch);
    }

    lastIndex = matchIndex + fullMatch.length;
  }

  // Push remaining text after the last match
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

export default linkifyText;
