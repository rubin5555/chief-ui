import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

export const Description = styled.p`
  font-size: 13px;
  color: ${gray[600]};
  line-height: 1.6;
`;

export const OrgList = styled.div`
  margin-top: 16px;
`;

export const OrgRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0;
  border-top: 1px solid ${colors.border};
  &:first-child { border-top: none; }
`;

export const OrgName = styled.span`
  color: ${gray[800]};
`;

export const OrgActions = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const OrgPhone = styled.span`
  font-size: 13px;
  color: ${gray[600]};
`;

export const ChatButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 9999px;
  transition: background-color 0.15s;
  &:hover { background-color: ${colors.accent}1a; }
`;
