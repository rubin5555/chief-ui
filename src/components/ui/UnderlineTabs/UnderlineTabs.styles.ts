import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const UnderlineTabsRoot = styled.div`
  display: flex;
  gap: 16px;
`;

export const TabItem = styled.div`
  position: relative;
`;

export const TabButton = styled.button<{ $active: boolean; $disabled: boolean }>`
  font-size: 14px;
  padding-bottom: 8px;
  transition: color 0.15s;
  cursor: ${(p) => (p.$disabled ? 'default' : 'pointer')};
  color: ${(p) => (p.$disabled ? gray[400] : p.$active ? gray[900] : gray[500])};
  font-weight: ${(p) => (p.$active ? '500' : 'inherit')};
  border-bottom: ${(p) => (p.$active ? `2px solid ${colors.primary}` : '2px solid transparent')};
`;

export const Tooltip = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  right: 50%;
  transform: translateX(50%);
  background-color: ${gray[800]};
  color: ${colors.surface};
  font-size: 12px;
  border-radius: 8px;
  padding: 6px 10px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 50;

  ${TabItem}:hover & { opacity: 1; }

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    right: 50%;
    transform: translateX(50%);
    border: 4px solid transparent;
    border-top-color: ${gray[800]};
  }
`;
