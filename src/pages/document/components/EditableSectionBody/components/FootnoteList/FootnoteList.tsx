import { SUPERSCRIPT_NUMS } from '../../../../document.constants';
import type { Footnote } from '../../../../types';
import { FootnoteRow } from './components/FootnoteRow';
import { FootnoteRule, ListRoot } from './FootnoteList.styles';
import { FOOTNOTE_LIST_IDS } from './FootnoteList.testids';

export interface FootnoteListProps {
  nodeId: string;
  footnotes: Footnote[];
  readOnly: boolean;
  onChange: (footnotes: Footnote[]) => void;
}

// A node's footnotes, under the short rule that separates them from its body
// (main, Edit.tsx:4372).
//
// Markers come from the note's *position*, so deleting the second note renumbers
// the third — which is why the notes carry ids and the markers don't. main keys
// these rows by array index and hits exactly that: removing one mid-list remounts
// every row after it, losing focus and any in-flight edit.
export const FootnoteList = ({ nodeId, footnotes, readOnly, onChange }: FootnoteListProps) => {
  if (footnotes.length === 0) return null;

  const handleChange = (footnoteId: string) => (text: string) =>
    onChange(
      footnotes.map((footnote) => (footnote.id === footnoteId ? { ...footnote, text } : footnote)),
    );

  const handleRemove = (footnoteId: string) => () =>
    onChange(footnotes.filter((footnote) => footnote.id !== footnoteId));

  return (
    <ListRoot data-testid={FOOTNOTE_LIST_IDS.root(nodeId)}>
      <FootnoteRule />
      {footnotes.map((footnote, index) => (
        <FootnoteRow
          key={footnote.id}
          footnote={footnote}
          // Past twelve there is no superscript character left, so the plain
          // number stands in — same ceiling main has, without the blank marker.
          marker={SUPERSCRIPT_NUMS[index] ?? String(index + 1)}
          readOnly={readOnly}
          onChange={handleChange(footnote.id)}
          onRemove={handleRemove(footnote.id)}
        />
      ))}
    </ListRoot>
  );
};
