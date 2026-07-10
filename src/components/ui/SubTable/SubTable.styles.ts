import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const SubTableHeader = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  padding: 4px 12px;
  font-size: 10px;
  font-weight: 600;
  color: ${gray[400]};
  user-select: none;
  column-gap: 6px;
`;

export const SubTableScrollViewport = styled.div<{ $maxHeight: number }>`
  max-height: ${({ $maxHeight }) => $maxHeight}px;
  overflow-y: auto;
`;

export const SubTableVirtualSpacer = styled.div<{ $totalSize: number }>`
  position: relative;
  width: 100%;
  height: ${({ $totalSize }) => $totalSize}px;
`;

export const SubTableVirtualRow = styled.div<{ $start: number }>`
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  width: 100%;
  transform: translateY(${({ $start }) => $start}px);
`;

export const SubTableRowRoot = styled.div<{ $columns: string }>`
  display: grid;
  grid-template-columns: ${({ $columns }) => $columns};
  align-items: center;
  padding: 6px 12px;
  column-gap: 6px;
  border-bottom: 1px solid rgba(219,234,254,0.4);
`;
