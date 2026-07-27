import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

/**
 * Which surface the row sits on. The hover wash follows it: grey inside the
 * sheet, amber on the emphasis card, where grey would read as a hole punched in
 * the tint.
 */
export type ActionTone = 'default' | 'amber';

/**
 * The small square button every control on this row is built from — including the
 * ones supplied as slots, which is why it lives in a `.shared.styles.ts` rather
 * than in NodeActionRow's own. A row where one button is a different size or
 * tints differently on hover reads as broken.
 */
export const ActionBtn = styled.button<{ $tone: ActionTone; $active?: boolean }>`
  ${resetButton}
  ${flexCenter}
  position: relative;
  flex-shrink: 0;
  padding: 4px;
  border-radius: ${radii.sm};
  color: ${({ $active }) => ($active ? colors.primary : gray[500])};
  transition: background-color ${transitions.normal}, color ${transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${({ $tone }) => ($tone === 'amber' ? docColors.amberHover : gray[100])};
    color: ${({ $active }) => ($active ? colors.primary : gray[700])};
  }

  // Disabled here means "there is nothing to refresh from", which is a fact about
  // the node rather than a passing state — so it stays visible and goes pale
  // rather than being hidden.
  &:disabled {
    color: ${gray[200]};
    cursor: not-allowed;
  }
`;

/** Icon size for every control on the row. main draws these at 12px throughout. */
export const ACTION_ICON_SIZE = 12;
