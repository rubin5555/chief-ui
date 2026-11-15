import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const SubTabsRow = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: flex-end;
  border-bottom: 1px solid ${gray[200]};
`;

// The active sub-tab is a folder tab: it sits 1px lower and paints over the
// rule beneath it with its own background.
export const SubTabButton = styled.button<{ $active: boolean }>`
  position: relative;
  bottom: ${({ $active }) => ($active ? '-1px' : '0')};
  padding: 8px 20px;
  white-space: nowrap;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? colors.primary : gray[400])};
  background: ${({ $active }) => ($active ? colors.surface : 'transparent')};
  border: ${({ $active }) => ($active ? `1px solid ${gray[200]}` : 'none')};
  border-bottom-color: ${({ $active }) => ($active ? colors.surface : 'transparent')};
  border-radius: ${({ $active }) => ($active ? `${radii.md} ${radii.md} 0 0` : '0')};
  transition: color ${transitions.normal};

  &:focus {
    outline: none;
  }
`;
