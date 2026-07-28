import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

/**
 * main lays this dialog out as three columns (TopNavbar.tsx:417): the permission
 * levels, the sources people come from, and — depending on the permission — either
 * the people chosen or the sections they were chosen for.
 *
 * The page is RTL, so the first child is the rightmost. Nothing here sets `order`:
 * the levels are first because they are read first.
 */
export const PermissionBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

/** Fixed-width flank holding the members list or the section tree. */
export const SideColumn = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  border-right: 1px solid ${gray[100]};
  background: ${colors.surface};
`;
