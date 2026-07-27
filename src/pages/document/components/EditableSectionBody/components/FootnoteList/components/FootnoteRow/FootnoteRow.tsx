import { X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { Footnote } from '../../../../../../types';
import { Marker, NoteInput, NoteText, RemoveBtn, Row } from './FootnoteRow.styles';
import { FOOTNOTE_ROW_IDS } from './FootnoteRow.testids';

export interface FootnoteRowProps {
  footnote: Footnote;
  /** The superscript this note is marked with — its position, not its id. */
  marker: string;
  readOnly: boolean;
  onChange: (text: string) => void;
  onRemove: () => void;
}

/** Height is cleared before measuring, or a shrinking note keeps the height it grew to. */
const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

// One footnote: its marker, its text, and the way to drop it (main,
// Edit.tsx:4375).
export const FootnoteRow = ({
  footnote,
  marker,
  readOnly,
  onChange,
  onRemove,
}: FootnoteRowProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    fitToContent(event.currentTarget);
  };

  return (
    <Row dir="rtl" data-testid={FOOTNOTE_ROW_IDS.root(footnote.id)}>
      <Marker aria-hidden="true">{marker}</Marker>

      {readOnly ? (
        <NoteText>{footnote.text}</NoteText>
      ) : (
        <NoteInput
          // Sizes to whatever was already written on mount, then keeps up from
          // onChange — a direct write from an event, not an effect.
          ref={fitToContent}
          value={footnote.text}
          rows={1}
          dir="rtl"
          placeholder="הזן את תוכן ההערה..."
          aria-label={`הערת שוליים ${marker}`}
          data-testid={FOOTNOTE_ROW_IDS.input(footnote.id)}
          onChange={handleChange}
        />
      )}

      {!readOnly && (
        <RemoveBtn
          type="button"
          aria-label={`מחיקת הערת שוליים ${marker}`}
          data-testid={FOOTNOTE_ROW_IDS.removeBtn(footnote.id)}
          onClick={onRemove}
        >
          <X size={12} aria-hidden="true" />
        </RemoveBtn>
      )}
    </Row>
  );
};
