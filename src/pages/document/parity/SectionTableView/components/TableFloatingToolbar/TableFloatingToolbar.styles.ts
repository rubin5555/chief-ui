import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ToolbarRoot = styled.div`
  position: fixed;
  z-index: 9990;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
  padding: 2px 6px;
  direction: rtl;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
`;

// A CSS triangle pointing back at the table, so the strip reads as belonging to
// it rather than floating over the page (main, Edit.tsx:1007).
export const ToolbarArrow = styled.span`
  position: absolute;
  top: -6px;
  right: 16px;
  width: 10px;
  height: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    margin-top: 3px;
    background: ${colors.surface};
    border: 1px solid ${gray[200]};
    transform: rotate(45deg);
    transform-origin: bottom left;
  }
`;

export const ToolbarAction = styled.button<{ $danger?: boolean }>`
  ${resetButton}
  ${flexCenter}
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  color: ${({ $danger }) => ($danger ? colors.danger : gray[600])};
  transition: background ${transitions.normal}, color ${transitions.normal};

  &:hover {
    background: ${({ $danger }) => ($danger ? colors.dangerLight : gray[100])};
  }
`;

export const ToolbarDivider = styled.span`
  width: 1px;
  height: 16px;
  margin: 0 2px;
  flex-shrink: 0;
  background: ${gray[200]};
`;
