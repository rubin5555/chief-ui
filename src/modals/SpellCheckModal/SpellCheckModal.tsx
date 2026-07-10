import { Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { STEPS } from './SpellCheckModal.constants';
import {
  MenuDot,
  MenuIconBadge,
  StepItem,
  StepList,
  StepNumber,
  StepText,
  ToggleKnob,
  ToggleWidget,
} from './SpellCheckModal.styles';
import { SPELL_CHECK_MODAL_IDS } from './SpellCheckModal.testids';

interface SpellCheckModalProps {
  onClose: () => void;
}

export const SpellCheckModal = ({ onClose }: SpellCheckModalProps) => {
  return (
    <Modal
      data-testid={SPELL_CHECK_MODAL_IDS.root}
      title="התקנת בדיקת איות"
      icon={<Check size={16} />}
      onClose={onClose}
    >
      <StepList dir="rtl">
        {STEPS.map(({ step, text, hasIcon, hasToggle }) => (
          <StepItem key={step}>
            <StepNumber>{step}</StepNumber>
            <StepText>
              {text}
              {hasIcon && (
                <MenuIconBadge>
                  <MenuDot />
                  <MenuDot />
                  <MenuDot />
                </MenuIconBadge>
              )}
              {hasToggle && (
                <ToggleWidget>
                  <ToggleKnob />
                </ToggleWidget>
              )}
            </StepText>
          </StepItem>
        ))}
      </StepList>
    </Modal>
  );
};
