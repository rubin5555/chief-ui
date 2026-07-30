import styled from 'styled-components';
import { flexCenter, flexFill, flexGap } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const TitleInput = styled.input`
  ${flexFill}
  background: transparent;
  border: none;
  font-size: 12px;
  color: ${gray[800]};
  text-align: right;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${gray[400]};
  }
`;

export const DragHandle = styled.span`
  ${flexCenter}
  flex-shrink: 0;
  color: ${gray[300]};
  cursor: grab;
  transition: color ${transitions.fast};

  &:hover {
    color: ${gray[500]};
  }

  &:active {
    cursor: grabbing;
  }
`;

export const SmallIconBtn = styled.button<{ $active?: boolean; $muted?: boolean }>`
  ${flexCenter}
  flex-shrink: 0;
  padding: 2px;
  border: none;
  background: ${({ $active }) => ($active ? colors.primaryLight : 'transparent')};
  color: ${({ $active, $muted }) => ($active || !$muted ? colors.primary : gray[300])};
  border-radius: 4px;
  cursor: pointer;
  transition: color ${transitions.fast};
  &:hover {
    color: ${colors.primary};
    background: ${colors.primaryLight};
  }
`;

export const AddNodeButton = styled.button`
  ${flexGap(6)}
  width: 100%;
  padding: 8px 12px;
  background: ${colors.surface};
  border: 1px dashed ${colors.primary};
  color: ${colors.primary};
  border-radius: ${radii.xl};
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: background ${transitions.fast};
  &:hover {
    background: ${colors.primaryLight};
  }
`;

export const AddChildLink = styled.button`
  ${flexGap(4)}
  background: none;
  border: none;
  padding: 4px 0;
  color: ${gray[400]};
  font-size: 11px;
  cursor: pointer;
  transition: color ${transitions.fast};
  &:hover {
    color: ${colors.primary};
  }
`;

export const NodeIndex = styled.span`
  font-size: 10px;
  font-weight: 700;
  color: ${colors.primary};
  flex-shrink: 0;
`;
