import styled from 'styled-components';
import { colors, gray, shadows } from '@/styles/theme';

export const StepList = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  & > * + * { margin-top: 20px; }
`;

export const StepItem = styled.li`
  display: flex;
  align-items: flex-start;
  gap: 12px;
`;

export const StepNumber = styled.span`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background-color: ${colors.primary};
  color: ${colors.surface};
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 2px;
`;

export const StepText = styled.div`
  flex: 1;
  font-size: 14px;
  color: ${gray[700]};
  line-height: 1.625;
`;

export const MenuIconBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  margin: 0 6px;
  padding: 2px 8px;
  background-color: ${gray[100]};
  border-radius: 6px;
  vertical-align: middle;
  border: 1px solid ${gray[200]};
`;

export const MenuDot = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background-color: ${gray[500]};
`;

export const ToggleWidget = styled.div`
  display: inline-flex;
  width: 36px;
  height: 20px;
  border-radius: 9999px;
  align-items: center;
  padding: 0 2px;
  background-color: ${colors.primary};
  vertical-align: middle;
  margin: 0 8px;
  flex-shrink: 0;
`;

export const ToggleKnob = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 9999px;
  background-color: ${colors.surface};
  box-shadow: ${shadows.sm};
  margin-left: auto;
`;
