import { Thumb, TrackButton } from './Toggle.styles';
import { TOGGLE_IDS } from './Toggle.testids';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  'aria-label'?: string;
  id?: string;
  'data-testid'?: string;
}

export const Toggle = ({
  checked,
  onChange,
  'aria-label': ariaLabel,
  id,
  'data-testid': testId,
}: ToggleProps) => {
  const handleClick = () => onChange(!checked);

  return (
    <TrackButton
      type="button"
      id={id}
      data-testid={testId ?? TOGGLE_IDS.root}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      $checked={checked}
      onClick={handleClick}
    >
      <Thumb $checked={checked} />
    </TrackButton>
  );
};
