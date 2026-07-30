import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, shadows, transitions } from '@/styles/theme';

export const FlowNavRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
`;

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

export const RevertIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
  transform: rotate(180deg);
`;
