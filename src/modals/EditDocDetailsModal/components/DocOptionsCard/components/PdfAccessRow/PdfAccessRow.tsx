import type { PdfAccess } from '@/pages/document/types';
import { PDF_ACCESS_OPTIONS } from '../../../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../../../EditDocDetailsModal.testids';
import { OptionLabel, OptionRow } from '../components.shared.styles';
import { Segment, Segments } from './PdfAccessRow.styles';

export interface PdfAccessRowProps {
  value: PdfAccess;
  locked: boolean;
  onChange: (value: PdfAccess) => void;
}

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
