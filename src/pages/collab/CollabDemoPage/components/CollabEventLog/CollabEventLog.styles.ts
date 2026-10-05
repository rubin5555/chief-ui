import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const LogDrawer = styled.section`
  display: flex;
  flex-direction: column;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radii.xl};
  box-shadow: ${shadows.sm};
  overflow: hidden;
  transition: all ${transitions.normal};
`;

export const LogHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  background: ${gray[50]};
  border-bottom: 1px solid ${colors.border};
  direction: rtl;
`;

export const LogTitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LogTitle = styled.h3`
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: ${gray[800]};
`;

export const LogCount = styled.span`
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: ${radii.full};
  background: ${gray[200]};
  color: ${gray[700]};
`;

export const LogActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const SmallActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11.5px;
  font-weight: 500;
  color: ${gray[600]};
  background: transparent;
  border: 1px solid ${gray[300]};
  border-radius: ${radii.md};
  padding: 3px 8px;
  cursor: pointer;
  transition: all ${transitions.fast};

  &:hover {
    background: ${gray[100]};
    color: ${gray[900]};
  }
`;

export const LogList = styled.div<{ $isCollapsed: boolean }>`
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  max-height: 220px;
  overflow-y: auto;
  direction: ltr;
  background: ${gray[900]};
  padding: 8px;
  gap: 4px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 11.5px;
`;

export const LogEmpty = styled.div`
  padding: 16px;
  text-align: center;
  color: ${gray[400]};
  font-family: inherit;
  font-size: 12px;
`;

export const LogRow = styled.div<{ $direction: 'in' | 'out' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: ${radii.sm};
  background: ${({ $direction }) =>
    $direction === 'in' ? 'rgba(59, 130, 246, 0.08)' : 'rgba(16, 185, 129, 0.08)'};
  border-right: 3px solid
    ${({ $direction }) => ($direction === 'in' ? '#3b82f6' : '#10b981')};
  color: ${gray[200]};
  line-height: 1.4;
`;

export const TimeStamp = styled.span`
  color: ${gray[500]};
  font-size: 10.5px;
  flex-shrink: 0;
`;

export const UserTag = styled.span<{ $userId: string }>`
  padding: 1px 6px;
  border-radius: ${radii.sm};
  font-weight: 600;
  font-size: 10px;
  text-transform: uppercase;
  background: ${({ $userId }) =>
    $userId === 'alice' ? 'rgba(37, 99, 235, 0.25)' : 'rgba(5, 150, 105, 0.25)'};
  color: ${({ $userId }) => ($userId === 'alice' ? '#93c5fd' : '#6ee7b7')};
`;

export const DirectionTag = styled.span<{ $direction: 'in' | 'out' }>`
  color: ${({ $direction }) => ($direction === 'in' ? '#60a5fa' : '#34d399')};
  font-weight: 700;
  font-size: 11px;
`;

export const TypeTag = styled.span`
  color: #fbbf24;
  font-weight: 600;
`;

export const DetailsSpan = styled.span`
  color: ${gray[300]};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
`;
