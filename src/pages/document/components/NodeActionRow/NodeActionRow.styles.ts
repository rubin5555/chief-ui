import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { docColors, gray, radii, transitions } from '@/styles/theme';

export type ActionTone = 'default' | 'amber';

export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;

// 9px and grey: the stamp is provenance, not a label — main sizes it below every
// other piece of text on the row so it reads as a footnote to the heading.
export const Stamp = styled.span`
  margin-inline-start: 6px;
  margin-inline-end: 2px;
  white-space: nowrap;
  font-size: 9px;
  color: ${gray[500]};
`;

// The hover wash follows what the row sits on: grey inside the sheet, amber on
// the emphasis card, where grey would read as a hole punched in the tint.
export const ActionBtn = styled.button<{ $tone: ActionTone }>`
  ${resetButton}
  ${flexCenter}
  flex-shrink: 0;
  padding: 4px;
  border-radius: ${radii.sm};
  color: ${gray[500]};
  transition: background-color ${transitions.normal}, color ${transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${(props) => (props.$tone === 'amber' ? docColors.amberHover : gray[100])};
    color: ${gray[700]};
  }

  // Disabled here means "there is nothing to refresh from", which is a fact about
  // the node rather than a temporary state — so it stays visible and goes pale
  // rather than being hidden.
  &:disabled {
    color: ${gray[200]};
    cursor: not-allowed;
  }
`;
