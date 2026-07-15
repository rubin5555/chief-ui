import { BookOpen } from 'lucide-react';
import { forwardRef } from 'react';
import { IconButtonRoot } from '@/components/ui/IconButton/IconButton.styles';
import { TRAINING_MENU_IDS } from '../TrainingMenu.testids';

interface TrainingTriggerButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const TrainingTriggerButton = forwardRef<HTMLButtonElement, TrainingTriggerButtonProps>(
  ({ isOpen, onClick }, ref) => (
    <IconButtonRoot
      ref={ref}
      type="button"
      $isActive={isOpen}
      aria-label="מדריך"
      data-testid={TRAINING_MENU_IDS.trigger}
      onClick={onClick}
    >
      <BookOpen size={20} />
    </IconButtonRoot>
  ),
);
TrainingTriggerButton.displayName = 'TrainingTriggerButton';
