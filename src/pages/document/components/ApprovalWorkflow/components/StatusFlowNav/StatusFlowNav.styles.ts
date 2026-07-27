import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, shadows, transitions } from '@/styles/theme';

// main's status navigation (Edit.tsx:3845): a filled primary button for the step
// forward, an outlined secondary one for the step back, stacked full-width in the
// sidebar with a 20px gap below the pair.
export const FlowNavRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

// Both buttons put their label in a `flex: 1` span and the chevron after it, so
// the label is right-aligned in this RTL column and the chevron pins to the far
// (left) edge regardless of how long the status name is.
const FlowBtn = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
  border-radius: ${radii.xl};
  text-align: right;
  transition: all ${transitions.slow};
`;

export const AdvanceBtn = styled(FlowBtn)`
  padding: 8px 12px;
  font-size: 14px;
  font-weight: 600;
  background-color: ${colors.primary};
  color: ${colors.surface};
  box-shadow: ${shadows.primary};

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const RevertBtn = styled(FlowBtn)`
  padding: 6px 12px;
  font-size: 12px;
  color: ${gray[500]};
  border: 1px solid ${gray[200]};

  &:hover {
    background-color: ${docColors.translucentHover};
  }
`;

export const FlowLabel = styled.span`
  flex: 1;
  text-align: right;
`;

// The back button's chevron is the forward one rotated, so both point the way
// the press moves the document — in RTL that is leftward for "next".
export const RevertIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
  transform: rotate(180deg);
`;
