import styled from 'styled-components';
import { flexBetween } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const BodySection = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
`;

export const Sidebar = styled.div`
  width: 256px;
  flex-shrink: 0;
  border-left: 1px solid ${colors.border};
  background: ${gray[50]};
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const SidebarScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding: 12px;
  gap: 8px;
`;

export const SidebarFooter = styled.div`
  padding-top: 8px;
  border-top: 1px solid ${gray[100]};
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: auto;
`;

export const EmphasisBox = styled.div`
  ${flexBetween}
  padding: 6px 8px;
  background: color-mix(in srgb, ${colors.accent} 12%, ${colors.surface});
  border: 1px solid ${colors.accent};
  border-radius: ${radii.lg};
`;

export const EmphasisLabel = styled.span`
  font-size: 11px;
  font-weight: 500;
  color: ${gray[700]};
`;
