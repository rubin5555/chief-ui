import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

// Shared across AppendixList/SubjectTree/SectionRow/TemplateModalBody — these
// are the common building blocks of the subject/section/appendix tree UI, not
// any single component's own concern. See src/modals/MailingListModal/tabs/tabs.shared.styles.ts
// for the same pattern used elsewhere in the codebase.

export const TitleInput = styled.input`
  flex: 1;
  min-width: 0;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
  align-items: center;
  gap: 6px;
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
  display: flex;
  align-items: center;
  gap: 4px;
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
