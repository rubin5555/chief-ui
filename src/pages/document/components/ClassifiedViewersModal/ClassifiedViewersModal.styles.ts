import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

// main puts the search in its own strip above the table, ruled off from it —
// the dialog reads as header / search / list rather than two floating parts.
export const SearchStrip = styled.div`
  flex-shrink: 0;
  padding-bottom: 12px;
  border-bottom: 1px solid ${gray[100]};
`;

export const TableWrap = styled.div`
  flex: 1;
  min-height: 240px;
`;

// The size comes from the table's density; this column only says which of its
// columns carries the weight.
export const NameCell = styled.span`
  font-weight: 500;
  color: ${gray[800]};
`;

export const MutedCell = styled.span<{ $tabular?: boolean }>`
  color: ${gray[500]};
  font-size: 12px;
  ${({ $tabular }) => $tabular && 'font-variant-numeric: tabular-nums;'}
`;

export const EmptyState = styled.div`
  padding: 24px 0;
  text-align: center;
  color: ${gray[400]};
  font-size: 13px;
`;
