import { OPTION_TOGGLES } from '../../EditDocDetailsModal.constants';
import type { DocDetailsForm } from '../../useDocDetailsForm';
import { DocOptionToggleRow } from './components/DocOptionToggleRow';
import { PdfAccessRow } from './components/PdfAccessRow';
import { OptionsCard } from './DocOptionsCard.styles';

export interface DocOptionsCardProps {
  form: DocDetailsForm;
  isLimitedEdit: boolean;
}

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
