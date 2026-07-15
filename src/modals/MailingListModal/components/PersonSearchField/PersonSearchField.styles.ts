import { Plus } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const SearchFieldWrap = styled.div`
  position: relative;
  flex: 1;
`;

export const SearchFieldRow = styled.div`
  ${flexGap(8)}
`;

export const SearchResultContent = styled.div`
  flex: 1;
  min-width: 0;
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

export const SearchResultsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  max-height: 280px;
  overflow-y: auto;
  border-radius: ${radii.xl};
  border: 1px solid ${gray[100]};
  background: ${colors.surface};
  box-shadow: ${shadows.lg};
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

export const NoResults = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  right: 0;
  z-index: 20;
  border-radius: ${radii.xl};
  border: 1px solid ${gray[100]};
  background: ${colors.surface};
  box-shadow: ${shadows.lg};
  padding: 24px;
  text-align: center;
  font-size: 14px;
  color: ${gray[400]};
`;
