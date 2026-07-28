import { ChevronLeft } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexBetween } from '@/styles/mixins';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const TreeRoot = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const TreeHeader = styled.div`
  ${flexBetween}
  flex-shrink: 0;
  padding: 10px 16px;
  border-bottom: 1px solid ${gray[100]};
`;

export const TreeTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${gray[700]};
`;

export const ClearButton = styled.button`
  font-size: 11px;
  color: ${colors.primary};
  &:hover {
    text-decoration: underline;
  }
`;

export const TreeBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 12px;
  overflow-y: auto;
`;

export const SubjectRow = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 8px;
  border-radius: ${radii.xl};
  text-align: right;
  transition: background-color 0.15s;
  &:hover {
    background: ${colors.surface};
  }
`;

export const Chevron = styled(ChevronLeft)<{ $open: boolean }>`
  flex-shrink: 0;
  color: ${colors.primary};
  opacity: 0.5;
  transition: transform 0.2s;
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '0deg')});
`;

export const SubjectTitle = styled.span`
  flex: 1;
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
  ${ellipsis}
`;

/** main indents the sections under a chapter by 30px (TopNavbar.tsx:840). */
export const SectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 4px;
  padding-right: 30px;
`;

export const SectionRow = styled.button<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 6px 10px;
  border-radius: ${radii.xl};
  text-align: right;
  transition: background-color 0.15s;
  background: ${({ $selected }) => ($selected ? docColors.selectionBg : 'transparent')};
  &:hover {
    background: ${({ $selected }) => ($selected ? docColors.selectionBg : colors.surface)};
  }
`;

export const SectionIndex = styled.span`
  width: 16px;
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  text-align: right;
  color: ${gray[500]};
`;

export const SectionTitle = styled.span<{ $selected: boolean }>`
  flex: 1;
  font-size: 12px;
  color: ${({ $selected }) => ($selected ? colors.primary : gray[700])};
  font-weight: ${({ $selected }) => ($selected ? 600 : 400)};
  ${ellipsis}
`;

/** The count of people already assigned to a section, and a way to see who. */
export const SectionCount = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: ${radii.full};
  font-size: 10px;
  font-weight: 600;
  background: ${({ $open }) => ($open ? docColors.selectionBg : gray[100])};
  color: ${({ $open }) => ($open ? colors.primary : gray[400])};
`;

export const AssignedList = styled.div`
  margin: 2px 0 4px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  overflow: hidden;
  background: ${colors.surface};
`;

export const AssignedRow = styled.div`
  ${flexBetween}
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid ${gray[50]};
  &:last-child {
    border-bottom: none;
  }
`;

export const AssignedName = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${gray[700]};
  ${ellipsis}
`;

export const AssignedId = styled.span`
  font-size: 11px;
  color: ${gray[400]};
  font-variant-numeric: tabular-nums;
`;

export const RemoveButton = styled.button`
  display: flex;
  flex-shrink: 0;
  padding: 2px;
  border-radius: ${radii.md};
  color: ${gray[400]};
  &:hover {
    color: ${colors.danger};
  }
`;

/**
 * Anyone picked while no section was selected. main drops them into the level's
 * list where the tree cannot show them, so they are silently granted a
 * per-section permission over no section at all; naming them is the fix.
 */
export const UnassignedNotice = styled.p`
  margin: 8px 0 0;
  padding: 8px 12px;
  border-radius: ${radii.lg};
  background: ${colors.warningLight};
  font-size: 11px;
  line-height: 1.6;
  color: ${colors.warning};
`;
