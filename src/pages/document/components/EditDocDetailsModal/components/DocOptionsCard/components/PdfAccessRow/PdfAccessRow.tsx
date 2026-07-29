import type { PdfAccess } from '../../../../../../types';
import { PDF_ACCESS_OPTIONS } from '../../../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../EditDocDetailsModal.testids';
import { OptionLabel, OptionRow } from '../../DocOptionsCard.styles';
import { Segment, Segments } from './PdfAccessRow.styles';

export interface PdfAccessRowProps {
  value: PdfAccess;
  locked: boolean;
  onChange: (value: PdfAccess) => void;
}

/**
 * Who may open the document once it is a PDF. A pair of segments rather than a
 * switch, because neither answer is the absence of the other — "for authorised
 * readers only" and "for everyone" are both positions, and a switch would make
 * one of them read as off.
 */
export const PdfAccessRow = ({ value, locked, onChange }: PdfAccessRowProps) => {
  const handleSelect = (option: PdfAccess) => () => onChange(option);

  return (
    <OptionRow $locked={locked}>
      <OptionLabel $locked={locked}>ייצוא לPDF</OptionLabel>
      <Segments>
        {PDF_ACCESS_OPTIONS.map((option) => (
          <Segment
            key={option.id}
            type="button"
            disabled={locked}
            aria-pressed={value === option.id}
            $selected={value === option.id}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.pdfAccessOption(option.id)}
            onClick={handleSelect(option.id)}
          >
            {option.label}
          </Segment>
        ))}
      </Segments>
    </OptionRow>
  );
};
