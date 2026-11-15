import styled from 'styled-components';
import { ellipsis, flexFill, flexGap, rtlTextInput } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const Row = styled.div<{ $depth: number }>`
  ${flexGap(8)}
  padding: 6px 8px;
  padding-right: ${({ $depth }) => $depth * 12 + 8}px;
  border-radius: ${radii.lg};
  cursor: pointer;
  text-align: right;
  transition: background ${transitions.normal};
  font-size: ${({ $depth }) => ($depth > 0 ? '12px' : '14px')};
  color: ${({ $depth }) => ($depth > 0 ? gray[500] : gray[700])};

  &:hover {
    background: ${docColors.translucentHover};
  }
`;

export const Chevron = styled.span<{ $open: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${gray[400]};
  transition: transform ${transitions.normal};
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '0deg')});
`;

export const ChevronSpacer = styled.span`
  width: 12px;
  height: 12px;
  flex-shrink: 0;
`;

export const RowTitle = styled.span`
  ${flexFill}
  ${ellipsis}
`;

export const RenameInput = styled.input`
  ${rtlTextInput}
  ${flexFill}
  background: transparent;
  border: none;
  border-bottom: 1px solid ${colors.primary};
  outline: none;
  color: ${gray[800]};
`;
