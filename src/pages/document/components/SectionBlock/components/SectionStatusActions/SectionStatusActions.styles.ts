import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// `flex-end` in this RTL row puts the buttons at the left edge, opposite the
// text they follow — main's placement (Edit.tsx:4601).
export const ActionsRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 6px;
  margin-bottom: 4px;
`;

const StatusBtn = styled.button`
  ${resetButton}
  padding: 3px 10px;
  border-radius: ${radii.sm};
  white-space: nowrap;
  font-size: 10px;
  font-weight: 600;
  transition: opacity ${transitions.normal}, background-color ${transitions.normal};
`;

/** The step forward — filled, because it is the one thing to do next. */
export const PrimaryStatusBtn = styled(StatusBtn)`
  background-color: ${colors.primary};
  color: ${colors.surface};

  &:hover {
    opacity: 0.9;
  }
`;

/** Sending back, in either direction. Outlined so it doesn't compete with the step forward. */
export const SecondaryStatusBtn = styled(StatusBtn)`
  border: 1px solid ${gray[300]};
  color: ${gray[700]};

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const ButtonPair = styled.div`
  display: flex;
  gap: 4px;
`;
