import { OPTION_TOGGLES } from '../../EditDocDetailsModal.constants';
import type { DocDetailsForm } from '../../useDocDetailsForm';
import { DocOptionToggleRow } from './components/DocOptionToggleRow';
import { PdfAccessRow } from './components/PdfAccessRow';
import { OptionsCard } from './DocOptionsCard.styles';

export interface DocOptionsCardProps {
  form: DocDetailsForm;
  /** Past editing, every option is settled (main's isLimitedEdit). */
  isLimitedEdit: boolean;
}

/**
 * What happens to the document once it leaves: who can open the PDF, whether the
 * approval round is called off, whether it carries a watermark, and whether it
 * goes out sealed (main, Edit.tsx:2362).
 *
 * The PDF row stays live even on a document past editing — main keeps it
 * editable there too (2365 gates on `readOnly` alone, not `isLimitedEdit`),
 * because who may open a distributed file is a decision you go on making after
 * the document itself is fixed.
 */
export const DocOptionsCard = ({ form, isLimitedEdit }: DocOptionsCardProps) => (
  <OptionsCard>
    <form.Field name="pdfAccess">
      {(field) => (
        <PdfAccessRow value={field.state.value} locked={false} onChange={field.handleChange} />
      )}
    </form.Field>

    {OPTION_TOGGLES.map((option) => (
      <form.Field key={option.field} name={option.field}>
        {(field) => (
          <DocOptionToggleRow
            field={option.field}
            label={option.label}
            checked={field.state.value}
            locked={isLimitedEdit}
            onChange={field.handleChange}
          />
        )}
      </form.Field>
    ))}
  </OptionsCard>
);
