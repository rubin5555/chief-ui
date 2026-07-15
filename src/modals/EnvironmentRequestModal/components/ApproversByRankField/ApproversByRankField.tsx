import { memo } from 'react';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import type { ApproverRank } from '../../EnvironmentRequestModal.constants';
import { APPROVER_RANKS } from '../../EnvironmentRequestModal.constants';
import { RankField, RankLabel, RankRow, RanksList } from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';

interface ApproversByRankFieldProps {
  value: Record<ApproverRank, string[]>;
  onChange: (rank: ApproverRank, selected: string[]) => void;
  options: string[];
}

const ApproversByRankFieldComponent = ({ value, onChange, options }: ApproversByRankFieldProps) => {
  const onRankChange = (rank: ApproverRank) => (selected: string[]) => onChange(rank, selected);

  return (
    <RanksList>
      {APPROVER_RANKS.map((rank) => (
        <RankRow key={rank}>
          <RankLabel>{rank}</RankLabel>
          <RankField>
            <SearchableMultiSelect
              data-testid={ENV_REQUEST_MODAL_IDS.approverSelect(rank)}
              options={options}
              selected={value[rank]}
              onChange={onRankChange(rank)}
              placeholder="בחר מאשרים..."
              noBorder
            />
          </RankField>
        </RankRow>
      ))}
    </RanksList>
  );
};

export const ApproversByRankField = memo(ApproversByRankFieldComponent);
