import styled from 'styled-components';
import { flexBetween, flexCenter, flexGap } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const Description = styled.p`
  font-size: 13px;
  color: ${gray[600]};
  line-height: 1.6;
`;

export const OrgList = styled.div`
  margin-top: 16px;
`;

export const OrgRow = styled.div`
  ${flexBetween}
  padding: 16px 0;
  border-top: 1px solid ${colors.border};
  &:first-child { border-top: none; }
`;

export const OrgName = styled.span`
  color: ${gray[800]};
`;

export const OrgActions = styled.div`
  ${flexGap(12)}
`;

export const OrgPhone = styled.span`
  font-size: 13px;
  color: ${gray[600]};
`;

export const ChatButton = styled.button`
  ${flexCenter}
  padding: 8px;
  border-radius: ${radii.full};
  transition: background-color 0.15s;
  &:hover { background-color: ${colors.accent}1a; }
`;
