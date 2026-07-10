import type { TemplateDocType, TemplateDocTypeOption } from '../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import { OptionButton, OptionWrap, Row, Tooltip } from './DocTypeToggle.styles';

interface DocTypeToggleProps {
  options: TemplateDocTypeOption[];
  value: TemplateDocType | null;
  onChange: (id: TemplateDocType) => void;
}

export const DocTypeToggle = ({ options, value, onChange }: DocTypeToggleProps) => {
  const handleSelect = (option: TemplateDocTypeOption) => () => {
    if (option.disabled) return;
    onChange(option.id);
  };

  return (
    <Row>
      {options.map((option) => (
        <OptionWrap key={option.id}>
          <OptionButton
            type="button"
            data-testid={TEMPLATE_MODAL_IDS.docTypeToggle(option.id)}
            onClick={handleSelect(option)}
            $isActive={value === option.id}
            $disabled={!!option.disabled}
          >
            {option.label}
          </OptionButton>
          {option.disabled && <Tooltip>בקרוב</Tooltip>}
        </OptionWrap>
      ))}
    </Row>
  );
};
