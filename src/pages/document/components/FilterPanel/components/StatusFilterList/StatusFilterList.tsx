import { Check } from 'lucide-react';
import { useState } from 'react';
import { FILTER_STATUSES, SECTION_STATUS_COLOR } from '../../../../document.constants';
import type { SectionStatus } from '../../../../types';
import { FILTER_PANEL_IDS } from '../../FilterPanel.testids';
import {
  ApplyButton,
  CheckBox,
  ClearButton,
  FooterRow,
  OptionLabel,
  OptionList,
  OptionRow,
  StatusDot,
} from './StatusFilterList.styles';

export interface StatusFilterListProps {
  applied: SectionStatus[];
  onApply: (statuses: SectionStatus[]) => void;
}

export const StatusFilterList = ({ applied, onApply }: StatusFilterListProps) => {
  const [staged, setStaged] = useState<SectionStatus[]>(applied);

  const handleToggle = (status: SectionStatus) => () =>
    setStaged((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status],
    );

  const handleClear = () => setStaged([]);
  const handleApply = () => onApply(staged);

  return (
    <>
      <OptionList>
        {FILTER_STATUSES.map(({ id, label }) => {
          const isChecked = staged.includes(id);
          return (
            <OptionRow
              key={id}
              type="button"
              aria-pressed={isChecked}
              data-testid={FILTER_PANEL_IDS.option(id)}
              onClick={handleToggle(id)}
            >
              <CheckBox $checked={isChecked}>
                {isChecked && <Check size={10} strokeWidth={3} />}
              </CheckBox>
              <StatusDot $color={SECTION_STATUS_COLOR[id]} />
              <OptionLabel>{label}</OptionLabel>
            </OptionRow>
          );
        })}
      </OptionList>

      <FooterRow>
        <ApplyButton
          type="button"
          $hasFilters={staged.length > 0}
          data-testid={FILTER_PANEL_IDS.applyBtn}
          onClick={handleApply}
        >
          {staged.length > 0 ? `סנן (${staged.length})` : 'סנן'}
        </ApplyButton>
        {staged.length > 0 && (
          <ClearButton type="button" data-testid={FILTER_PANEL_IDS.clearBtn} onClick={handleClear}>
            נקה
          </ClearButton>
        )}
      </FooterRow>
    </>
  );
};
