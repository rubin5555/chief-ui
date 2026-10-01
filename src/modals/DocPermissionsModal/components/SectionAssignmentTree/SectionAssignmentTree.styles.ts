import { ChevronLeft } from 'lucide-react';
import styled from 'styled-components';
import { revealMotion } from '@/styles/animations';
import { ellipsis, flexBetween, subtleScrollbar } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';

const CHOSEN_TINT = `color-mix(in srgb, ${colors.primary} 7.8%, transparent)`;
const OPEN_COUNT_TINT = `color-mix(in srgb, ${colors.primary} 12.2%, transparent)`;

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
  ${subtleScrollbar}
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

export const SectionList = styled.div`
  ${revealMotion}
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
  background: ${({ $selected }) => ($selected ? CHOSEN_TINT : 'transparent')};
  box-shadow: ${({ $selected }) => ($selected ? shadows.sm : 'none')};
  &:hover {
    background: ${({ $selected }) => ($selected ? CHOSEN_TINT : colors.surface)};
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

export const SectionCount = styled.span<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: ${radii.full};
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s;
  background: ${({ $open }) => ($open ? OPEN_COUNT_TINT : gray[100])};
  color: ${({ $open }) => ($open ? colors.primary : gray[400])};

  &:hover {
    background: ${({ $open }) => ($open ? OPEN_COUNT_TINT : gray[200])};
  }
`;

export const CountChevron = styled(ChevronLeft)<{ $open: boolean }>`
  flex-shrink: 0;
  transition: transform 0.2s;
  transform: rotate(${({ $open }) => ($open ? '-90deg' : '0deg')});
`;

export const AssignedTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  table-layout: fixed;
  text-align: right;
`;

export const AssignedList = styled.div`
  ${revealMotion}
  margin: 2px 0 4px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  overflow: hidden;
  background: ${colors.surface};
`;

export const AssignedHeadCell = styled.th<{ $narrow?: boolean }>`
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 500;
  color: ${gray[400]};
  text-align: right;
  background: color-mix(in srgb, ${gray[50]} 80%, transparent);
  border-bottom: 1px solid ${gray[100]};
  ${({ $narrow }) => ($narrow ? 'width: 24px;' : '')}
`;

export const AssignedRow = styled.tr`
  border-bottom: 1px solid ${gray[50]};
  transition: background-color 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: color-mix(in srgb, ${gray[50]} 60%, transparent);
  }
`;

export const AssignedCell = styled.td<{ $muted?: boolean; $tabular?: boolean }>`
  padding: 6px 12px;
  font-size: 11px;
  font-weight: ${({ $muted }) => ($muted ? 400 : 500)};
  color: ${({ $muted }) => ($muted ? gray[400] : gray[700])};
  ${({ $tabular }) => ($tabular ? 'font-variant-numeric: tabular-nums;' : '')}
  ${ellipsis}
`;

export const RemoveCell = styled.td`
  width: 24px;
  padding: 6px 6px 6px 12px;
`;

export const RemoveButton = styled.button`
  display: flex;
  padding: 2px;
  border-radius: ${radii.sm};
  color: ${gray[400]};
  opacity: 0;
  transition: opacity 0.15s, background-color 0.15s, color 0.15s;

  ${AssignedRow}:hover &,
  &:focus-visible {
    opacity: 1;
  }

  &:hover {
    background: ${colors.dangerLight};
    color: ${colors.danger};
  }
`;

export const UnassignedNotice = styled.p`
  margin: 8px 0 0;
  padding: 8px 12px;
  border-radius: ${radii.lg};
  background: ${colors.warningLight};
  font-size: 11px;
  line-height: 1.6;
  color: ${colors.warning};
`;
