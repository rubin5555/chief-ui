import type { SignatureType } from '@/pages/profile/components/tabs/SignaturesPanel';
import type { SignatureTypeOption } from '../../SignatureModal.constants';
import { OptionButton, OptionWrap, Row, Tooltip } from './SignatureTypeControl.styles';

interface SignatureTypeControlProps {
  options: SignatureTypeOption[];
  activeId: SignatureType;
  onChange: (id: SignatureType) => void;
}

export const SignatureTypeControl = ({
  options,
  activeId,
  onChange,
}: SignatureTypeControlProps) => {
  const handleSelect = (option: SignatureTypeOption) => () => {
    if (option.disabled) return;
    onChange(option.id);
  };

  return (
    <Row>
      {options.map((option) => (
        <OptionWrap key={option.id}>
          <OptionButton
            type="button"
            onClick={handleSelect(option)}
            $isActive={activeId === option.id}
            $disabled={!!option.disabled}
          >
            {option.label}
          </OptionButton>
          {option.disabled && <Tooltip>Coming Soon</Tooltip>}
        </OptionWrap>
      ))}
    </Row>
  );
};
