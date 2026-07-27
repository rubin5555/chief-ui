import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, radii, shadows, transitions } from '@/styles/theme';

// The round filled button both of this row's actions use (main, Edit.tsx:4087 and
// 4094). Shared here rather than in SidebarFabRow.styles.ts because AddMenu owns
// its own trigger — a popover has to be anchored by the component that renders it
// — and the two buttons must be indistinguishable side by side.
export const FabButton = styled.button`
  ${resetButton}
  ${flexCenter}
  padding: 8px;
  border-radius: ${radii.full};
  background-color: ${colors.primary};
  color: ${colors.surface};
  box-shadow: ${shadows.primary};
  transition: opacity ${transitions.normal};

  &:hover {
    opacity: 0.9;
  }
`;
