import { css } from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { gray, radii, transitions } from '@/styles/theme';

export const squareToolButton = css`
  ${resetButton}
  ${flexCenter}
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  transition:
    background ${transitions.normal},
    color ${transitions.normal};

  &:disabled {
    color: ${gray[300]};
    cursor: not-allowed;
  }
`;
