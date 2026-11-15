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
  onQuoteClick: (quote: string) => boolean;
}

const QUOTE_TITLE = 'מעבר לטקסט המצוטט';
const QUOTE_MISSING_TITLE = 'הטקסט המצוטט אינו מופיע במסמך';

export const ChatMessage = ({ comment, onQuoteClick }: ChatMessageProps) => {
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
          <QuoteAuthor>{mine ? 'את/ה' : comment.authorName}</QuoteAuthor>
          <QuoteText>{comment.quote}</QuoteText>
        </QuoteCard>
      )}
      <MessageText $quoted={Boolean(comment.quote)}>{comment.text}</MessageText>
    </MessageBubble>
  );
};
