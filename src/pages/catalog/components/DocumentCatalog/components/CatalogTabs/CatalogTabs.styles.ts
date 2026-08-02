import styled from 'styled-components';
import { gray, radii, transitions } from '@/styles/theme';

export const TabsRow = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 4px;
  padding: 0 4px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  position: relative;
  padding: 8px 16px;
  border-radius: ${radii.xl};
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  color: ${({ $active }) => ($active ? gray[900] : gray[400])};
  transition: color ${transitions.normal};

  &:focus {
    outline: none;
  }
`;

export const TabUnderline = styled.span`
  position: absolute;
  right: 16px;
  left: 16px;
  bottom: 4px;
  height: 2px;
  border-radius: ${radii.full};
  background: ${gray[900]};
`;
