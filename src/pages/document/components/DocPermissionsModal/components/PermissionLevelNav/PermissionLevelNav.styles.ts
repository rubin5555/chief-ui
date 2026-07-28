import styled from 'styled-components';
import { colors, gray, shadows } from '@/styles/theme';

/**
 * main's `w-52` rail (TopNavbar.tsx:420): the five permissions at the top and the
 * active one's description held at the bottom of the column, so the explanation
 * sits in the same place whichever permission is being read.
 */
export const NavRoot = styled.nav`
  width: 208px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${gray[100]};
  background: ${gray[50]};
`;

export const LevelList = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`;

export const LevelButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  text-align: right;
  transition: background-color 0.15s;
  background: ${({ $active }) => ($active ? colors.surface : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};
  &:hover {
    background: ${({ $active }) => ($active ? colors.surface : colors.surface)};
  }
`;

export const LevelIcon = styled.span<{ $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $active }) => ($active ? colors.primary : gray[400])};
`;

export const LevelLabel = styled.span<{ $active: boolean }>`
  flex: 1;
  font-size: 14px;
  line-height: 1.25;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? gray[900] : gray[500])};
`;

/**
 * The description is the substance of this dialog — it is the only place that
 * states what a permission actually grants — but main keeps it quiet at the foot
 * of the rail rather than making it the headline.
 */
export const LevelDescription = styled.p`
  flex: 1;
  display: flex;
  align-items: flex-end;
  margin: 0;
  padding: 12px 16px;
  border-top: 1px solid ${gray[100]};
  font-size: 11px;
  line-height: 1.7;
  text-align: right;
  color: ${gray[400]};
`;
