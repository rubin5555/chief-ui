import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

// Cell primitives shared by the parent rows and the expanded child rows. Both
// are driven by the same `ColumnDef` array, so their cells live together too.

export const NameCell = styled.span<{ $child?: boolean }>`
  ${ellipsis}
  text-align: right;
  font-size: ${({ $child }) => ($child ? '12px' : '14px')};
  font-weight: ${({ $child }) => ($child ? 400 : 500)};
  color: ${({ $child }) => ($child ? gray[600] : gray[800])};
`;

export const MetaCell = styled.span<{ $size?: 'sm' | 'xs'; $muted?: boolean }>`
  ${ellipsis}
  text-align: center;
  font-size: ${({ $size }) => ($size === 'sm' ? '14px' : '12px')};
  color: ${({ $muted }) => ($muted ? gray[400] : gray[500])};
`;

// main leaves the status text left-aligned inside its track while every other
// cell centres, so the dot lines up down the column.
export const StatusCell = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  width: 100%;
`;

export const StatusDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background: ${({ $color }) => $color};
`;

export const StatusText = styled.span<{ $child?: boolean }>`
  white-space: nowrap;
  font-size: ${({ $child }) => ($child ? '12px' : '14px')};
  color: ${gray[800]};
`;

export const ExpandButton = styled.button<{ $expanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border-radius: ${radii.sm};
  color: ${gray[400]};
  transform: rotate(${({ $expanded }) => ($expanded ? '0deg' : '90deg')});
  transition: all ${transitions.normal};

  &:hover {
    color: ${gray[600]};
  }
`;

export const CellCenter = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const ReceiptLink = styled.button`
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`;

export const ReceiptEmpty = styled.span`
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: ${gray[400]};
`;

// The label swaps for a button on hover. main does it with a Tailwind group;
// here the wrapper owns the rule so the two children stay one cell.
export const ReshareCell = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover span[data-reshare-label] {
    display: none;
  }
  &:hover button[data-reshare-btn] {
    display: flex;
  }
`;

export const ReshareLabel = styled.span`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  color: ${catColors.dangerSoft};
`;

export const ReshareButton = styled.button`
  display: none;
  padding: 4px 10px;
  border-radius: ${radii.lg};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  background: ${colors.primaryLight};
  color: ${colors.primary};
`;

// Only visible while the row is hovered, which is why the reveal rule lives on
// the row and this just declares the starting state.
export const RowActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  opacity: 0;
  transition: opacity ${transitions.normal};
`;

export const RowActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: all ${transitions.normal};

  &:hover {
    color: ${gray[600]};
    background: ${gray[100]};
  }
`;
