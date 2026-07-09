import { Check, ChevronDown } from 'lucide-react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import {
  Checkbox,
  ChevronWrapper,
  Dropdown,
  OptionBtn,
  OptionLabel,
  Trigger,
} from './MultiSelectDropdown.styles';
import { MULTI_SELECT_DROPDOWN_IDS } from './MultiSelectDropdown.testids';

interface MultiSelectDropdownProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  id?: string;
  'data-testid'?: string;
}

export const MultiSelectDropdown = ({
  options,
  selected,
  onChange,
  placeholder = 'בחר...',
  id,
  'data-testid': testId,
}: MultiSelectDropdownProps) => {
  const panel = useFloatingPanel();
  const base = testId ?? MULTI_SELECT_DROPDOWN_IDS.root;

  const onTriggerClick = () => panel.toggle((r) => ({ top: r.bottom + 4, left: r.left }));

  const toggleOption = (opt: string) => () => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };

  const triggerWidth = panel.btnRef.current?.offsetWidth;
  const displayValue =
    selected.length === 0
      ? placeholder
      : selected.length === 1
        ? selected[0]
        : `${selected.length} נבחרו`;

  return (
    <>
      <Trigger
        ref={panel.btnRef}
        type="button"
        id={id}
        data-testid={base}
        $isPlaceholder={selected.length === 0}
        onClick={onTriggerClick}
      >
        <span>{displayValue}</span>
        <ChevronWrapper $open={panel.open}>
          <ChevronDown size={16} />
        </ChevronWrapper>
      </Trigger>

      {panel.open && panel.pos && (
        <Dropdown
          ref={panel.panelRef}
          data-testid={MULTI_SELECT_DROPDOWN_IDS.dropdown}
          style={{ ...panel.pos, width: triggerWidth }}
        >
          {options.map((opt) => {
            const isSelected = selected.includes(opt);
            return (
              <OptionBtn
                key={opt}
                type="button"
                data-testid={MULTI_SELECT_DROPDOWN_IDS.option(opt)}
                onClick={toggleOption(opt)}
              >
                <Checkbox $checked={isSelected}>
                  {isSelected && <Check size={11} strokeWidth={3} />}
                </Checkbox>
                <OptionLabel $selected={isSelected}>{opt}</OptionLabel>
              </OptionBtn>
            );
          })}
        </Dropdown>
      )}
    </>
  );
};
