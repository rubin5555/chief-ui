import styled from 'styled-components';
import { catColors, docStatusColors, gray } from '@/styles/theme';

export const TrashHeader = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 12px;
`;

export const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: ${gray[500]};
  transition: color 0.15s;

  &:hover {
    color: ${gray[700]};
  }
`;

export const HeaderDivider = styled.div`
  width: 1px;
  height: 16px;
  background: ${gray[200]};
`;

export const TrashIcon = styled.span`
  display: flex;
  color: ${gray[400]};
`;

export const TrashTitle = styled.span`
  font-size: 16px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const TrashNote = styled.span`
  font-size: 12px;
  color: ${gray[400]};
`;

/* The countdown deepens from red-500 to the fix red inside the last week. */
export const DaysLeft = styled.span<{ $urgent: boolean }>`
  display: block;
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${({ $urgent }) => ($urgent ? docStatusColors.fix : catColors.dangerSoft)};
`;
