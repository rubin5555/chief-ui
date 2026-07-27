import { AutoWidthWrap, Ghost, Input } from './NodeTitleField.styles';
import { NODE_TITLE_FIELD_IDS } from './NodeTitleField.testids';
import type { NodeTitleVariant } from './NodeTitleField.types';

export interface NodeTitleFieldProps {
  nodeId: string;
  variant: NodeTitleVariant;
  value: string;
  onChange: (title: string) => void;
}

const PLACEHOLDER: Record<NodeTitleVariant, string> = {
  subject: 'שם הנושא',
  section: 'שם הסעיף',
  subSection: 'שם תת הסעיף',
};

const ARIA_LABEL: Record<NodeTitleVariant, string> = {
  subject: 'שם הנושא',
  section: 'שם הסעיף',
  subSection: 'שם תת הסעיף',
};

// In main, a heading inside the paper is an input, not static text — you retitle
// a section by clicking its title, and the sidebar outline follows. This is the
// one component behind all three levels of that.
//
// Only the section variant shrink-wraps to its text (main's ghost-span trick at
// Edit.tsx:4403); subject and sub-section titles fill the row. That asymmetry is
// main's, and it is visible: a section's hover highlight ends at the last letter.
export const NodeTitleField = ({ nodeId, variant, value, onChange }: NodeTitleFieldProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => onChange(event.target.value);
  const autoWidth = variant === 'section';

  const input = (
    <Input
      $variant={variant}
      $autoWidth={autoWidth}
      value={value}
      dir="rtl"
      placeholder={PLACEHOLDER[variant]}
      aria-label={ARIA_LABEL[variant]}
      data-testid={NODE_TITLE_FIELD_IDS.input(nodeId)}
      onChange={handleChange}
    />
  );

  if (!autoWidth) return input;

  return (
    <AutoWidthWrap>
      <Ghost $variant={variant} aria-hidden="true">
        {value || PLACEHOLDER[variant]}
      </Ghost>
      {input}
    </AutoWidthWrap>
  );
};
