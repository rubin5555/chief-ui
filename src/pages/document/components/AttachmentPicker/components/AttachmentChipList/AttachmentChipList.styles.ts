import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, radii, transitions } from '@/styles/theme';

// Stacked, not wrapped: main lists attachments one per line under the content box
// so long filenames stay readable (Edit.tsx:4587).
export const ChipList = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
  margin-top: 5px;
`;

export const Chip = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  padding: 2px 4px;
  border-radius: ${radii.md};
  font-size: 10px;
  font-weight: 500;
  color: ${colors.primary};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${colors.primaryLight};
  }
`;
