import { useState } from 'react';
import type { SectionCommentDto } from '@/api/comments';
import { SECTION_CHAT_IDS } from '../../SectionChat.testids';
import {
  MessageBubble,
  MessageText,
  QuoteAuthor,
  QuoteCard,
  QuoteText,
} from './ChatMessage.styles';

export interface ChatMessageProps {
  comment: SectionCommentDto;
  /** Jumps to the quoted passage in the sheet; false if it isn't there any more. */
  onQuoteClick: (quote: string) => boolean;
}

const QUOTE_TITLE = 'מעבר לטקסט המצוטט';
const QUOTE_MISSING_TITLE = 'הטקסט המצוטט אינו מופיע במסמך';

// One comment: the quoted passage it is about, then what was said about it
// (main's message row, Edit.tsx:444-461).
export const ChatMessage = ({ comment, onQuoteClick }: ChatMessageProps) => {
  // Set only by a click that came back empty — the passage was edited away, or
  // the section it was marked in is no longer rendered. Cheaper and more honest
  // than searching the sheet for every message on every render just to decide
  // whether a card should look pressable.
  const [isMissing, setIsMissing] = useState(false);

  const mine = comment.from === 'me';

  const handleQuoteClick = () => {
    if (!comment.quote) return;
    if (!onQuoteClick(comment.quote)) setIsMissing(true);
  };

  return (
    <MessageBubble $mine={mine} data-testid={SECTION_CHAT_IDS.message(comment.id)}>
      {comment.quote && (
        <QuoteCard
          type="button"
          $mine={mine}
          disabled={isMissing}
          title={isMissing ? QUOTE_MISSING_TITLE : QUOTE_TITLE}
          data-testid={SECTION_CHAT_IDS.quote(comment.id)}
          onClick={handleQuoteClick}
        >
          {/* main hardcodes the two names (Edit.tsx:453); the comment carries its
              author, so it says who it was. */}
          <QuoteAuthor>{mine ? 'את/ה' : comment.authorName}</QuoteAuthor>
          <QuoteText>{comment.quote}</QuoteText>
        </QuoteCard>
      )}
      <MessageText $quoted={Boolean(comment.quote)}>{comment.text}</MessageText>
    </MessageBubble>
  );
};
