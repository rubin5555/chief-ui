import { X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { Footnote } from '../../../../../../types';
import { Marker, NoteInput, NoteText, RemoveBtn, Row } from './FootnoteRow.styles';
import { FOOTNOTE_ROW_IDS } from './FootnoteRow.testids';

export interface FootnoteRowProps {
  footnote: Footnote;
  marker: string;
  readOnly: boolean;
  onChange: (text: string) => void;
  onRemove: () => void;
}

const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

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
