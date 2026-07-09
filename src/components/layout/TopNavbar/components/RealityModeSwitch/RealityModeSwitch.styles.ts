import styled from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const SwitchRoot = styled.div`
  position: relative;
`;

export const SwitchTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  background: ${colors.muted};
  padding: 6px 16px;
  border-radius: ${radii.full};
  box-shadow: ${shadows.sm};
  cursor: pointer;
  transition: box-shadow 0.15s;
  &:hover { box-shadow: ${shadows.md}; }
`;

export const SwitchLabel = styled.span`
  font-size: 12px;
  color: ${gray[700]};
`;

export const SwitchMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: ${colors.muted};
  border-radius: ${radii['3xl']};
  box-shadow: ${shadows.lg};
  z-index: 10;
  min-width: 100px;
  overflow: hidden;
`;

export const SwitchOption = styled.button`
  display: block;
  width: 100%;
  text-align: right;
  padding: 6px 16px;
  font-size: 12px;
  color: ${gray[700]};
  &:hover { background: rgba(255, 255, 255, 0.3); }
`;
