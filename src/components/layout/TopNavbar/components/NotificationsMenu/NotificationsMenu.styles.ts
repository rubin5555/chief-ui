import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 1px solid ${colors.border};
  flex-shrink: 0;
`;

export const PanelTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const MarkAllReadBtn = styled.button`
  font-size: 11px;
  font-weight: 600;
  color: ${colors.primary};
  &:hover { text-decoration: underline; }
`;

export const NotificationList = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

export const NotificationItemRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid ${gray[50]};
  &:last-child { border-bottom: none; }
  &:hover { background: ${gray[50]}; }
`;

export const NotificationIconWrap = styled.span`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  background: ${colors.primaryLight};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NotificationBody = styled.div`
  flex: 1;
  min-width: 0;
`;

export const NotificationText = styled.p`
  font-size: 12px;
  color: ${gray[700]};
  line-height: 1.4;
`;

export const NotificationTime = styled.span`
  font-size: 11px;
  color: ${gray[400]};
`;

export const EmptyState = styled.div`
  padding: 32px 16px;
  text-align: center;
  font-size: 12px;
  color: ${gray[400]};
`;
