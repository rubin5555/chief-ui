import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const TimeInputs = styled.div`
  ${flexGap(8)}
  justify-content: center;
  /* hh:mm reads left-to-right even on an RTL page. */
  direction: ltr;
`;

export const TimeInput = styled.input`
  width: 36px;
  height: 36px;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
  background: ${docColors.surfaceSubtle};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  outline: none;
  transition: border-color ${transitions.normal};

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const TimeColon = styled.span`
  font-size: 18px;
  font-weight: 300;
  color: ${gray[400]};
`;
