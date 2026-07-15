import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { ellipsis, flexGap, resetButton } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const FilterBtnInline = styled.button<{ $active: boolean }>`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  ${resetButton}
  display: flex;
  align-items: center;
  padding: 0;
  color: ${(props) => (props.$active ? colors.primary : gray[400])};
  &:hover {
    color: ${gray[600]};
  }
`;

export const DateFilterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 12px 8px;
`;

export const DateRow = styled.div`
  ${flexGap(8)}
`;

export const DateLabel = styled.span`
  font-size: 12px;
  color: ${gray[400]};
  width: 20px;
  flex-shrink: 0;
  text-align: right;
`;

export const DateInput = styled.input`
  flex: 1;
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  outline: none;
  &:focus {
    border-color: ${colors.primary};
  }
`;

export const ClearFiltersBtn = styled.button`
  display: block;
  width: calc(100% - 32px);
  margin: 8px 16px 0;
  padding: 6px;
  font-size: 11px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  background: transparent;
  cursor: pointer;
  color: ${gray[500]};
  &:hover {
    background: ${gray[50]};
  }
`;

export const SubNameCell = styled.span`
  text-align: right;
  font-size: 11px;
  font-weight: 500;
  color: ${gray[700]};
  ${ellipsis}
`;

export const SubCell = styled.span<{ $tabular?: boolean; $dim?: boolean }>`
  text-align: center;
  font-size: 11px;
  color: ${({ $dim }) => ($dim ? gray[400] : gray[500])};
  ${({ $tabular }) => $tabular && 'font-variant-numeric: tabular-nums;'}
`;

export const FilterDropdown = styled(FloatingPanel)<{ $top: number; $left: number }>`
  top: ${(p) => p.$top}px;
  left: ${(p) => p.$left}px;
  max-height: calc(100vh - ${(p) => p.$top}px - 16px);
  padding: 12px 0;
  width: 288px;
  overflow-y: auto;
  direction: rtl;
`;

export const FilterSectionTitle = styled.p`
  font-size: 11px;
  font-weight: 600;
  color: ${gray[400]};
  padding: 0 16px 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0;
`;

export const FilterOption = styled.button<{ $active: boolean }>`
  width: 100%;
  ${flexGap(8)}
  padding: 6px 16px;
  font-size: 12px;
  text-align: right;
  border: none;
  background: transparent;
  cursor: pointer;
  color: ${gray[700]};
  transition: background 0.1s;
  &:hover { background: ${gray[50]}; }
`;

export const FilterDivider = styled.div`
  margin: 8px 0;
  border-top: 1px solid ${colors.border};
`;

export const ColCenter = styled.span<{ $color?: string }>`
  text-align: center;
  font-size: 12px;
  color: ${({ $color }) => $color ?? gray[600]};
`;
