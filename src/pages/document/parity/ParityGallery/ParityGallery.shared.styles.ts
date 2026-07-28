import styled from 'styled-components';
import { flexColumn } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

// Shared by the specimens rather than by the gallery itself, which is why it sits
// at their common ancestor per .claude/skills/system-assembly.md.

/** What the specimen's last interaction did — these components report, they don't apply. */
export const ActionLog = styled.p`
  margin-top: 10px;
  font-size: 12px;
  color: ${gray[500]};
`;

export const SpecimenStack = styled.div`
  ${flexColumn(10)}
`;

export const SpecimenSurface = styled.div`
  padding: 12px;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
`;
