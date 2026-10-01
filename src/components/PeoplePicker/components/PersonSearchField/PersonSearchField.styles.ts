import { Plus } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexFill, flexGap, subtleScrollbar } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';
import type { DropdownAnchor } from './useDropdownAnchor';

export const SearchFieldWrap = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchFieldRow = styled.div`
  ${flexGap(8)}
`;

export const SearchResultContent = styled.div`
  ${flexFill}
`;

export const SearchResultName = styled.p`
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  color: ${gray[800]};
  ${ellipsis}
`;

export const SearchResultId = styled.p`
  margin: 0;
  font-size: 12px;
  color: ${gray[400]};
`;

const DropdownSurface = styled.div.attrs<{ $anchor: DropdownAnchor }>(({ $anchor }) => ({
  style: {
    top: $anchor.top,
    bottom: $anchor.bottom,
    left: $anchor.left,
    width: $anchor.width,
    maxHeight: $anchor.maxHeight,
  },
}))<{ $anchor: DropdownAnchor }>`
  position: fixed;
  z-index: 99999;
  border-radius: ${radii.xl};
  border: 1px solid ${gray[100]};
  background: ${colors.surface};
  box-shadow: ${shadows.lg};
`;

export const SearchResultsDropdown = styled(DropdownSurface)`
  overflow-y: auto;
  ${subtleScrollbar}
`;

export const SearchResultRow = styled.button`
  width: 100%;
  ${flexGap(12)}
  padding: 12px 16px;
  border: none;
  border-bottom: 1px solid ${gray[50]};
  background: transparent;
  cursor: pointer;
  text-align: right;
  transition: background 0.1s;
  &:last-child { border-bottom: none; }
  &:hover { background: ${gray[50]}; }
`;

export const ResultAddIcon = styled(Plus)`
  flex-shrink: 0;
`;

export const NoResults = styled(DropdownSurface)`
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: ${gray[400]};
`;
