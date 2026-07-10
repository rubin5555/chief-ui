import { ChevronDown, Users } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { colors, gray } from '@/styles/theme';

export const ExpandBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  color: ${gray[400]};
`;

export const ExpandIcon = styled(ChevronDown)<{ $isExpanded: boolean }>`
  transition: transform 0.15s;
  transform: ${(p) => (p.$isExpanded ? 'rotate(180deg)' : 'none')};
`;

export const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  background: transparent;
  border: none;
  cursor: pointer;
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

export const ColHeader = styled.span<{ $align?: 'right' | 'center' }>`
  display: block;
  width: 100%;
  text-align: ${(p) => p.$align ?? 'center'};
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
  display: flex;
  align-items: center;
  justify-content: space-between;
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

export const ExpandedBlock = styled.div`
  background: color-mix(in srgb, ${colors.primaryLight} 40%, transparent);
  border-top: 1px solid color-mix(in srgb, ${colors.primary} 25%, transparent);
  padding: 4px 0;
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
