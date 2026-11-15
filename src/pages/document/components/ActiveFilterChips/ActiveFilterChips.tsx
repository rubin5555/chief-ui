import { getRouteApi } from '@tanstack/react-router';
import { X } from 'lucide-react';
import { FILTER_STATUSES, SECTION_STATUS_COLOR } from '../../document.constants';
import {
  Chip,
  ChipDot,
  ChipRemoveBtn,
  ChipsRow,
  ClearAllBtn,
  RowLabel,
} from './ActiveFilterChips.styles';
import { ACTIVE_FILTER_CHIPS_IDS } from './ActiveFilterChips.testids';

const routeApi = getRouteApi('/document/$id');

export const ActiveFilterChips = () => {
  const { statuses } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const activeStatuses = statuses ? statuses.split(',') : [];
  const activeOptions = FILTER_STATUSES.filter((option) => activeStatuses.includes(option.id));

  const handleRemove = (status: string) => () =>
    navigate({
      search: (prev) => ({
        ...prev,
        statuses: activeStatuses.filter((active) => active !== status).join(','),
      }),
      replace: true,
    });

  const handleClearAll = () =>
    navigate({ search: (prev) => ({ ...prev, statuses: '' }), replace: true });

  if (activeOptions.length === 0) return null;

  return (
    <ChipsRow data-testid={ACTIVE_FILTER_CHIPS_IDS.root}>
      <RowLabel>מסונן:</RowLabel>
      {activeOptions.map((option) => (
        <Chip
          key={option.id}
          $color={SECTION_STATUS_COLOR[option.id]}
          data-testid={ACTIVE_FILTER_CHIPS_IDS.chip(option.id)}
        >
          <ChipDot $color={SECTION_STATUS_COLOR[option.id]} />
          {option.label}
          <ChipRemoveBtn
            type="button"
            aria-label={`הסרת סינון ${option.label}`}
            data-testid={ACTIVE_FILTER_CHIPS_IDS.removeBtn(option.id)}
            onClick={handleRemove(option.id)}
          >
            <X size={10} />
          </ChipRemoveBtn>
        </Chip>
      ))}
      <ClearAllBtn
        type="button"
        data-testid={ACTIVE_FILTER_CHIPS_IDS.clearAllBtn}
        onClick={handleClearAll}
      >
        נקה הכל
      </ClearAllBtn>
    </ChipsRow>
  );
};
