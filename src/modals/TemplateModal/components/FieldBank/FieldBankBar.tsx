import { ChevronDown, Database, Plus } from 'lucide-react';
import {
  Bar,
  BarActionBtn,
  BarActions,
  BarRow,
  BarTitle,
  BarTitleWrap,
  ToggleChevron,
} from './FieldBank.styles';
import { FIELD_BANK_IDS } from './FieldBank.testids';

const BAR_TITLE = 'ייבוא מידע ממערכת מקור';

interface FieldBankBarProps {
  edge: 'top' | 'bottom';
  showFieldsToggle: boolean;
  onToggleFields: () => void;
  onOpenPicker: () => void;
}

export const FieldBankBar = ({
  edge,
  showFieldsToggle,
  onToggleFields,
  onOpenPicker,
}: FieldBankBarProps) => {
  const toggleTitle = edge === 'top' ? 'חזור לנושאים' : 'הצג שדות';

  return (
    <Bar $edge={edge} data-testid={FIELD_BANK_IDS.bar(edge)}>
      <BarRow>
        <BarTitleWrap>
          <Database size={12} />
          <BarTitle>{BAR_TITLE}</BarTitle>
        </BarTitleWrap>
        <BarActions>
          {showFieldsToggle && (
            <BarActionBtn
              type="button"
              onClick={onToggleFields}
              title={toggleTitle}
              aria-label={toggleTitle}
              data-testid={FIELD_BANK_IDS.toggleBtn}
            >
              <ToggleChevron $isRotated={edge === 'bottom'}>
                <ChevronDown size={14} />
              </ToggleChevron>
            </BarActionBtn>
          )}
          <BarActionBtn
            type="button"
            onClick={onOpenPicker}
            aria-label="ייבוא שדות"
            data-testid={FIELD_BANK_IDS.openPickerBtn}
          >
            <Plus size={14} />
          </BarActionBtn>
        </BarActions>
      </BarRow>
    </Bar>
  );
};
