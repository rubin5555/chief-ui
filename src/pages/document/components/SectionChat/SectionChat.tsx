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
  /**
   * Fired after a comment is posted. SectionBlock uses it to complete main's
   * "send it back for changes" flow: the section flips to `fix` on the first
   * message written after the request, so the reason and the status change are
   * one act rather than two.
   */
  onMessageSent?: () => void;
}

/**
 * A section's comment thread, drawn as main draws it (Edit.tsx:342-515): a speech
 * bubble in the page's left margin with a tail pointing back at the section.
 *
 * Deliberately *not* on `useFloatingPanel`, which every other popover on this page
 * uses. A menu is done with as soon as you touch anything else, so dismissing it
 * on an outside click is right; this bubble is open precisely so you can work in
 * the document underneath it — marking a passage to quote is a mousedown in the
 * paper, and that is the one gesture a dismiss-on-outside panel cannot survive.
 * It closes on its X, on its own trigger, and on nothing else.
 *
 * Owns its own trigger, thread and draft (per
 * `.claude/skills/modal-placement.md`). Two things are coordinated above it, both
 * because they are facts about the page and not about one bubble: which chat is
 * open, since they all share one spot on screen, and whether a passage is being
 * marked, since that changes what a click on the sheet means.
 */
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

  // The stub mutation has no cache-normalized link back to the query (no
  // real resolvers yet, per src/api/stubLink.ts) — appended locally instead
  // of relying on a refetch, same spirit as the rest of src/api today.
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

  // Gated on `open` rather than on the bubble being on screen: scrolling the
  // section out of view hides the bubble but does not close the chat, and a
  // passage marked while it is hidden is still the passage that was asked for.
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

  // Jumping back to a quoted passage. The lookup is scoped to this section first,
  // so a phrase that appears more than once in the document lands on the one the
  // comment is actually about.
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
      {/* The row's own button, not IconButton: this sits inside NodeActionRow
          between the paperclip and the 3-dots, and a different size or hover
          would break the row apart visually. */}
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

      {/* Portalled out to the body: this trigger sits inside the A4 sheet, and
          the sheet is scaled with CSS `zoom`. Zoom applies to fixed-position
          descendants too, so a bubble left in place would be drawn at the paper's
          scale and land somewhere other than the pixels it was measured against
          the moment the reader zoomed. */}
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
