import { Highlighter, MessageSquare, Send, X } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useRef, useState } from 'react';
import { type SectionCommentDto, useAddSectionComment, useSectionComments } from '@/api/comments';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { ACTION_ICON_SIZE, ActionBtn, type ActionTone } from '../NodeActionRow';
import { ChatMessage } from './components/ChatMessage';
import { useSectionChatAnalytics } from './SectionChat.analytics';
import {
  BubbleBody,
  BubbleRoot,
  CloseBtn,
  EmptyState,
  Header,
  HeaderTitle,
  InputRow,
  MarkerBanner,
  MarkerToggleBtn,
  MessageInput,
  MessagesList,
  QuoteStrip,
  SendBtn,
  TailBorder,
  TailFill,
} from './SectionChat.styles';
import { SECTION_CHAT_IDS } from './SectionChat.testids';
import { useSectionChatCoordination } from './SectionChatContext';
import { useChatBubblePosition } from './useChatBubblePosition';
import { useQuoteMarker } from './useQuoteMarker';
import { highlightTextInDoc } from './utils/highlightTextInDoc';

export interface SectionChatProps {
  sectionId: string;
  title: string;
  tone?: ActionTone;
  onMessageSent?: () => void;
}

export const SectionChat = ({
  sectionId,
  title,
  tone = 'default',
  onMessageSent,
}: SectionChatProps) => {
  const { openSectionId, toggleChat, closeChat, isMarking, setMarking } =
    useSectionChatCoordination();
  const open = openSectionId === sectionId;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const top = useChatBubblePosition(triggerRef, open);

  const { data } = useSectionComments(sectionId);
  const { mutate: addComment } = useAddSectionComment();

  const [sentComments, setSentComments] = useState<SectionCommentDto[]>([]);
  const [message, setMessage] = useState('');
  const [quote, setQuote] = useState('');
  const { trackPanelOpened, trackMessageSent, trackQuoteMarked, trackQuoteJumped } =
    useSectionChatAnalytics();

  const comments = [...(data ?? []), ...sentComments];

  const handleMarked = (marked: string) => {
    setQuote(marked);
    setMarking(false);
    trackQuoteMarked();
    inputRef.current?.focus();
  };

  useQuoteMarker({ enabled: open && isMarking, onMarked: handleMarked });

  const handleToggle = () => {
    if (!open) trackPanelOpened();
    toggleChat(sectionId);
  };
  const handleClearQuote = () => setQuote('');
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleToggleMarker = () => {
    setMarking(!isMarking);
    setQuote('');
  };
  const handleCancelMarker = () => setMarking(false);

  const handleQuoteClick = (quoted: string) => {
    const found = highlightTextInDoc(quoted, sectionId);
    trackQuoteJumped(found);
    return found;
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text && !quote) return;
    trackMessageSent(Boolean(quote));
    const sent = await addComment({ sectionId, input: { text, quote: quote || undefined } });
    if (sent) setSentComments((prev) => [...prev, sent]);
    setMessage('');
    setQuote('');
    onMessageSent?.();
  };

  return (
    <>
      <ActionBtn
        ref={triggerRef}
        type="button"
        $tone={tone}
        $active={open || comments.length > 0}
        title="צאט"
        aria-label={`תגובות לסעיף ${title}`}
        data-testid={SECTION_CHAT_IDS.trigger(sectionId)}
        onClick={handleToggle}
      >
        <MessageSquare size={ACTION_ICON_SIZE} aria-hidden="true" />
      </ActionBtn>

      {open && top !== null && (
        <ModalPortal>
          <BubbleRoot $top={top} dir="rtl" data-testid={SECTION_CHAT_IDS.panel(sectionId)}>
            <TailBorder aria-hidden="true" />
            <TailFill aria-hidden="true" />

            <BubbleBody>
              <Header>
                <HeaderTitle>{title}</HeaderTitle>
                <CloseBtn type="button" onClick={closeChat} aria-label="סגירה">
                  <X size={14} />
                </CloseBtn>
              </Header>

              <MessagesList>
                {comments.length === 0 && <EmptyState>אין עדיין תגובות</EmptyState>}
                {comments.map((comment) => (
                  <ChatMessage key={comment.id} comment={comment} onQuoteClick={handleQuoteClick} />
                ))}
              </MessagesList>

              {isMarking && (
                <MarkerBanner>
                  <Highlighter size={12} />
                  <span>סמן טקסט במסמך...</span>
                  <button type="button" onClick={handleCancelMarker} aria-label="ביטול סימון">
                    <X size={12} />
                  </button>
                </MarkerBanner>
              )}

              {quote && (
                <QuoteStrip data-testid={SECTION_CHAT_IDS.draftQuote}>
                  <span>{quote}</span>
                  <button type="button" onClick={handleClearQuote} aria-label="ביטול ציטוט">
                    <X size={10} />
                  </button>
                </QuoteStrip>
              )}

              <form onSubmit={handleSend}>
                <InputRow>
                  <SendBtn type="submit" data-testid={SECTION_CHAT_IDS.sendBtn} aria-label="שליחה">
                    <Send size={12} />
                  </SendBtn>
                  <MessageInput
                    ref={inputRef}
                    value={message}
                    onChange={handleMessageChange}
                    placeholder="הקלד הודעה..."
                    dir="rtl"
                    data-testid={SECTION_CHAT_IDS.input}
                  />
                  <MarkerToggleBtn
                    type="button"
                    $active={isMarking}
                    onClick={handleToggleMarker}
                    aria-label="סימון טקסט"
                    data-testid={SECTION_CHAT_IDS.markerToggle}
                  >
                    <Highlighter size={13} />
                  </MarkerToggleBtn>
                </InputRow>
              </form>
            </BubbleBody>
          </BubbleRoot>
        </ModalPortal>
      )}
    </>
  );
};
