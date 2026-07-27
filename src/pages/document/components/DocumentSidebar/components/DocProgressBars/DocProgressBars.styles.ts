import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';

export const ProgressList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 4px;
`;

export const ProgressRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

// `nowrap` is what makes the bar, not the text, absorb the width the sidebar has
// left: a count like `10/12` must not wrap onto a second line.
export const ProgressLabel = styled.span`
  flex-shrink: 0;
  white-space: nowrap;
  font-size: 11px;
  color: ${gray[500]};
`;

export const Track = styled.div`
  flex: 1;
  height: 6px;
  border-radius: ${radii.full};
  background-color: ${gray[200]};
  overflow: hidden;
`;

const Fill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${(props) => props.$percent}%;
  border-radius: ${radii.full};
`;

export const PreparingFill = styled(Fill)`
  background-color: ${docColors.progressAmber};
`;

export const ApprovedFill = styled(Fill)`
  background-color: ${colors.primary};
`;
