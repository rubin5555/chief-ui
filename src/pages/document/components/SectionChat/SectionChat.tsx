import { Highlighter, MessageSquare, Send, X } from 'lucide-react';
import type { ChangeEvent, FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { type SectionCommentDto, useAddSectionComment, useSectionComments } from '@/api/comments';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { IconButtonBadge, IconButtonRoot } from '@/components/ui/IconButton';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import {
  CloseBtn,
  EmptyState,
  Header,
  HeaderTitle,
  InputRow,
  MarkerBanner,
  MarkerToggleBtn,
  MessageBubble,
  MessageInput,
  MessagesList,
  QuoteBlock,
  QuoteStrip,
  SendBtn,
} from './SectionChat.styles';
import { SECTION_CHAT_IDS } from './SectionChat.testids';

const PANEL_WIDTH = 260;

export interface SectionChatProps {
  sectionId: string;
  title: string;
}

// Owns its own trigger + popover (per .claude/skills/modal-placement.md's
// "state and render must not be split" rule) and its own comment thread —
// no page-level state for chat exists anywhere else.
export const SectionChat = ({ sectionId, title }: SectionChatProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();
  const { data } = useSectionComments(sectionId);
  const { mutate: addComment } = useAddSectionComment();

  // The stub mutation has no cache-normalized link back to the query (no
  // real resolvers yet, per src/api/stubLink.ts) — appended locally instead
  // of relying on a refetch, same spirit as the rest of src/api today.
  const [sentComments, setSentComments] = useState<SectionCommentDto[]>([]);
  const [message, setMessage] = useState('');
  const [markerMode, setMarkerMode] = useState(false);
  const [quote, setQuote] = useState('');

  const comments = [...(data ?? []), ...sentComments];

  // Quote-marking: capture the plain selected text on the page while marker
  // mode is on. This mirrors main's Edit.tsx behavior exactly (a DOM
  // selection snapshot, not a TinyMCE bookmark) — jumping back to the
  // quoted location inside the document is a deferred follow-up, not
  // required for a comment to carry its quoted context.
  useEffect(() => {
    if (!markerMode) return;
    const handleMouseUp = () => {
      const selected = window.getSelection()?.toString().trim();
      if (!selected) return;
      setQuote(selected);
      setMarkerMode(false);
      window.getSelection()?.removeAllRanges();
    };
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [markerMode]);

  const handleToggle = () => panel.toggle(PANEL_WIDTH);
  const handleClearQuote = () => setQuote('');
  const handleMessageChange = (e: ChangeEvent<HTMLInputElement>) => setMessage(e.target.value);
  const handleToggleMarker = () => {
    setMarkerMode((prev) => !prev);
    setQuote('');
  };

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    const text = message.trim();
    if (!text && !quote) return;
    const sent = await addComment({ sectionId, input: { text, quote: quote || undefined } });
    if (sent) setSentComments((prev) => [...prev, sent]);
    setMessage('');
    setQuote('');
  };

  return (
    <>
      <IconButtonRoot
        ref={panel.btnRef}
        type="button"
        $isActive={panel.open}
        aria-label={`תגובות לסעיף ${title}`}
        data-testid={SECTION_CHAT_IDS.trigger(sectionId)}
        onClick={handleToggle}
      >
        <MessageSquare size={14} />
        {comments.length > 0 && <IconButtonBadge />}
      </IconButtonRoot>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
          data-testid={SECTION_CHAT_IDS.panel(sectionId)}
        >
          <Header>
            <HeaderTitle>{title}</HeaderTitle>
            <CloseBtn type="button" onClick={panel.close} aria-label="סגירה">
              <X size={14} />
            </CloseBtn>
          </Header>

          <MessagesList>
            {comments.length === 0 && <EmptyState>אין עדיין תגובות</EmptyState>}
            {comments.map((comment) => (
              <MessageBubble
                key={comment.id}
                $mine={comment.from === 'me'}
                data-testid={SECTION_CHAT_IDS.message(comment.id)}
              >
                {comment.quote && <QuoteBlock>{comment.quote}</QuoteBlock>}
                <div>{comment.text}</div>
              </MessageBubble>
            ))}
          </MessagesList>

          {markerMode && (
            <MarkerBanner>
              <Highlighter size={12} />
              <span>סמן טקסט במסמך...</span>
            </MarkerBanner>
          )}

          {quote && (
            <QuoteStrip>
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
                value={message}
                onChange={handleMessageChange}
                placeholder="הקלד הודעה..."
                dir="rtl"
                data-testid={SECTION_CHAT_IDS.input}
              />
              <MarkerToggleBtn
                type="button"
                $active={markerMode}
                onClick={handleToggleMarker}
                aria-label="סימון טקסט"
                data-testid={SECTION_CHAT_IDS.markerToggle}
              >
                <Highlighter size={13} />
              </MarkerToggleBtn>
            </InputRow>
          </form>
        </FloatingPanel>
      )}
    </>
  );
};
