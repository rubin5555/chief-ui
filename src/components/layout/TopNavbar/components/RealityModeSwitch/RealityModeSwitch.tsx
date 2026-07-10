import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { gray } from '@/styles/theme';
import { useRealityModeSwitchAnalytics } from './RealityModeSwitch.analytics';
import { REALITY_MODE_OPTIONS, REALITY_MODES } from './RealityModeSwitch.constants';
import {
  SwitchLabel,
  SwitchMenu,
  SwitchOption,
  SwitchRoot,
  SwitchTrigger,
} from './RealityModeSwitch.styles';
import { REALITY_MODE_SWITCH_IDS } from './RealityModeSwitch.testids';

export const RealityModeSwitch = () => {
  const [mode, setMode] = useState<string>(REALITY_MODES.REALITY);
  const [isOpen, setIsOpen] = useState(false);
  const { trackModeChanged } = useRealityModeSwitchAnalytics();

  const onToggle = () => setIsOpen((prev) => !prev);

  const onSelect = (nextMode: string) => () => {
    setMode(nextMode);
    setIsOpen(false);
    trackModeChanged(nextMode);
  };

  return (
    <SwitchRoot data-testid={REALITY_MODE_SWITCH_IDS.root}>
      <SwitchTrigger data-testid={REALITY_MODE_SWITCH_IDS.trigger} onClick={onToggle}>
        <SwitchLabel>{mode}</SwitchLabel>
        <ChevronDown size={14} color={gray[600]} />
      </SwitchTrigger>

      {isOpen && (
        <SwitchMenu data-testid={REALITY_MODE_SWITCH_IDS.menu}>
          {REALITY_MODE_OPTIONS.map((option) => (
            <SwitchOption
              key={option}
              data-testid={REALITY_MODE_SWITCH_IDS.option(option)}
              onClick={onSelect(option)}
            >
              {option}
            </SwitchOption>
          ))}
        </SwitchMenu>
      )}
    </SwitchRoot>
  );
};
