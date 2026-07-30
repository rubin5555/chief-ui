import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export type ActionTone = 'default' | 'amber';

export const ActionBtn = styled.button<{ $tone: ActionTone; $active?: boolean }>`
  ${resetButton}
  ${flexCenter}
  position: relative;
  flex-shrink: 0;
  padding: 4px;
  border-radius: ${radii.sm};
  color: ${({ $active }) => ($active ? colors.primary : gray[500])};
  transition: background-color ${transitions.normal}, color ${transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${({ $tone }) => ($tone === 'amber' ? docColors.amberHover : gray[100])};
    color: ${({ $active }) => ($active ? colors.primary : gray[700])};
  }

  &:disabled {
    color: ${gray[200]};
    cursor: not-allowed;
  }
`;

export const ACTION_ICON_SIZE = 12;
