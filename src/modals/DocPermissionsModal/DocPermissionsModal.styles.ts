import styled from 'styled-components';
import { revealMotion, widthMotion } from '@/styles/animations';
import { colors, gray } from '@/styles/theme';

export const PermissionBody = styled.div`
  display: flex;
  flex: 1;
  min-height: 0;
`;

export const SideColumn = styled.div<{ $width: number }>`
  width: ${({ $width }) => $width}px;
  ${widthMotion}
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow-y: auto;
  border-right: 1px solid ${gray[100]};
  background: ${colors.surface};

  > * {
    ${revealMotion}
  }
`;
