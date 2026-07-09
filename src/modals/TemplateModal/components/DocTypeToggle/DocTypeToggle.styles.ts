import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Row = styled.div`
  display: flex;
  border-radius: ${radii.xl};
  overflow: hidden;
  border: 1px solid ${colors.border};
`;

export const OptionWrap = styled.div`
  position: relative;
  flex: 1;

  &:not(:last-child) {
    border-left: 1px solid ${colors.border};
  }
`;

export const OptionButton = styled.button<{ $isActive: boolean; $disabled: boolean }>`
  width: 100%;
  padding: 9px 12px;
  font-size: 13px;
  font-weight: ${(props) => (props.$isActive ? 600 : 400)};
  background: ${(props) =>
    props.$disabled ? gray[50] : props.$isActive ? colors.primary : colors.surface};
  color: ${(props) => (props.$disabled ? gray[300] : props.$isActive ? colors.surface : gray[500])};
  cursor: ${(props) => (props.$disabled ? 'default' : 'pointer')};
  transition:
    background ${transitions.fast},
    color ${transitions.fast};
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
  transition: opacity ${transitions.normal};
  z-index: 50;

  ${OptionWrap}:hover & {
    opacity: 1;
  }

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
