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
          marker={SUPERSCRIPT_NUMS[index] ?? String(index + 1)}
          readOnly={readOnly}
          onChange={handleChange(footnote.id)}
          onRemove={handleRemove(footnote.id)}
        />
      ))}
    </ListRoot>
  );
};
