import { ChevronDown, Users } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexBetween, flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

/**
 * Fills whatever column it is given. The panel is a header over a scrolling
 * table, so it has to be a flex column in its own right rather than leaning on
 * its consumer to be one — the mailing-list form and the permissions dialog hand
 * it differently shaped space.
 */
export const PanelRoot = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ExpandBtn = styled.button`
  ${flexCenter}
  ${resetButton}
  padding: 0;
  color: ${gray[400]};
`;

export const ExpandIcon = styled(ChevronDown)<{ $isExpanded: boolean }>`
  transition: transform 0.15s;
  transform: ${(p) => (p.$isExpanded ? 'rotate(180deg)' : 'none')};
`;

export const RemoveBtn = styled.button`
  ${flexCenter}
  padding: 4px;
  ${resetButton}
  border-radius: 4px;
  color: ${gray[400]};
`;

export const MemberNameCell = styled.div`
  min-width: 0;
`;

export const MemberName = styled.span<{ $weight?: number }>`
  display: block;
  font-size: 12px;
  font-weight: ${(p) => p.$weight ?? 500};
  color: ${gray[800]};
  ${ellipsis}
`;

export const MemberSublabel = styled.span`
  display: block;
  font-size: 10px;
  color: ${gray[400]};
`;

export const CellText = styled.span<{ $tabular?: boolean }>`
  text-align: center;
  font-size: 12px;
  color: ${gray[600]};
  ${(p) => (p.$tabular ? 'font-variant-numeric: tabular-nums;' : '')}
`;

export const SubMemberName = styled.span`
  text-align: right;
  font-size: 11px;
  font-weight: 500;
  color: ${gray[700]};
  ${ellipsis}
`;

export const SubMemberCell = styled.span<{ $tabular?: boolean }>`
  text-align: center;
  font-size: 11px;
  color: ${gray[500]};
  ${(p) => (p.$tabular ? 'font-variant-numeric: tabular-nums;' : '')}
`;

export const PanelHeader = styled.div`
  flex-shrink: 0;
  ${flexBetween}
  padding: 12px 20px;
  border-bottom: 1px solid ${colors.border};
`;

export const PanelTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${gray[700]};
  margin: 0;
  direction: rtl;
`;

export const MemberCount = styled.span`
  font-size: 12px;
  color: ${gray[400]};
  font-weight: 400;
`;

export const EmptyMembersState = styled.div`
  padding: 64px 16px;
  text-align: center;
`;

export const EmptyMembersIcon = styled(Users)`
  width: 40px;
  height: 40px;
  color: ${gray[300]};
  margin: 0 auto 12px;
`;

export const EmptyMembersText = styled.p`
  font-size: 13px;
  line-height: 1.6;
  color: ${gray[400]};
  margin: 0;
`;
