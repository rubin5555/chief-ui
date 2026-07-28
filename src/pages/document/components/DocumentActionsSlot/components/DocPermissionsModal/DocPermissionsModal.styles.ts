import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const PermissionBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const LevelHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const LevelIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${colors.primary};
`;

export const LevelName = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${gray[900]};
`;

// The description is the point of this dialog: it is the only place that states
// what a permission actually grants, so it gets a panel rather than a caption.
export const LevelDescription = styled.p`
  margin: 0;
  padding: 12px 14px;
  border-radius: ${radii.lg};
  background-color: ${gray[50]};
  font-size: 12px;
  line-height: 1.7;
  color: ${gray[600]};
`;

export const MembersLabel = styled.span`
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${gray[700]};
`;

export const MemberCount = styled.span`
  font-size: 11px;
  font-weight: 400;
  color: ${gray[400]};
`;
