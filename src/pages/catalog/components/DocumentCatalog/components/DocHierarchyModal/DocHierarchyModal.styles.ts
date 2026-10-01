import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const SectionTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${gray[500]};
`;

export const EmptyHint = styled.p`
  padding: 12px 0;
  text-align: center;
  font-size: 12px;
  color: ${gray[400]};
`;

// The current document, and the chosen main document, both sit in a bordered
// card. The plain companion rows below are deliberately quieter.
export const DocCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: 2px solid ${colors.primary};
  border-radius: ${radii.xl};
  background: ${catColors.selectedTileBg};
`;

export const DocIcon = styled.span<{ $muted?: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $muted }) => ($muted ? gray[400] : colors.primary)};
`;

export const DocText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const DocName = styled.p<{ $strong?: boolean }>`
  ${ellipsis}
  font-size: 14px;
  font-weight: ${({ $strong }) => ($strong ? 600 : 400)};
  color: ${({ $strong }) => ($strong ? gray[800] : gray[700])};
`;

export const DocOrderNum = styled.p`
  font-size: 12px;
  color: ${gray[400]};
`;

export const RoleBadge = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: ${radii.full};
  font-size: 11px;
  font-weight: 500;
  background: ${colors.primary};
  color: ${colors.surface};
`;

export const RemoveBtn = styled.button`
  display: flex;
  flex-shrink: 0;
  padding: 4px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[200]};
  }
`;

// Two segments sharing one outline, so the pair reads as a single control.
export const ModeToggle = styled.div`
  display: flex;
  flex-shrink: 0;
  overflow: hidden;
  border: 1px solid ${colors.primary};
  border-radius: ${radii.lg};
`;

export const ModeButton = styled.button<{ $active: boolean; $divided: boolean }>`
  padding: 4px 12px;
  font-size: 11px;
  font-weight: 600;
  transition: background ${transitions.normal};
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? colors.surface : colors.primary)};
  border-right: ${({ $divided }) => ($divided ? `1px solid ${colors.primary}` : 'none')};
`;

export const CompanionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background: ${gray[50]};
`;

export const CompanionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 4px;
`;
