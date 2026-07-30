import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, radii, transitions } from '@/styles/theme';
import { BAR_WIDTH } from '../../document.measurements';

// main's comparison bar (Edit.tsx:3734): the same 230mm as the metadata pill and
// the source notice, on the pale blue that marks the whole page as being in
// comparison mode.
export const Bar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: ${BAR_WIDTH};
  padding: 8px 16px;
  border-radius: ${radii['2xl']};
  background-color: ${docColors.compareBg};
`;

export const VersionLabel = styled.span`
  white-space: nowrap;
  font-size: 12px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const Controls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

/**
 * A view preference, filled once it is on. Pills rather than checkboxes because
 * they sit in a bar rather than in a form, and their state has to read at a glance
 * from across the sheet.
 */
export const TogglePill = styled.button<{ $active: boolean }>`
  ${resetButton}
  padding: 4px 10px;
  border-radius: ${radii.full};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  transition: background-color ${transitions.normal}, color ${transitions.normal};

  ${({ $active }) =>
    $active
      ? `
        background-color: ${colors.primary};
        color: ${colors.surface};
        border: 1px solid ${colors.primary};
      `
      : `
        background-color: ${colors.surface};
        color: ${colors.primary};
        border: 1px solid ${docColors.compareBorder};
      `}
`;

export const Divider = styled.div`
  width: 1px;
  height: 16px;
  background-color: ${docColors.compareBorder};
`;

// main sets `dir="ltr"` on this group: the up/down chevrons and the `n/total`
// between them read as a numeric control rather than as text, so they keep their
// order regardless of the page's direction.
export const NavGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
`;

export const IconBtn = styled.button`
  ${resetButton}
  display: flex;
  padding: 4px;
  border-radius: ${radii.sm};
  color: ${colors.primary};
  transition: background-color ${transitions.normal};

  &:hover:not(:disabled) {
    background-color: ${docColors.compareBorder};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

// `tabular-nums` so the counter doesn't jitter as it counts past 9, and a minimum
// width so the chevrons either side of it stay put.
export const NavCounter = styled.span`
  min-width: 28px;
  text-align: center;
  font-size: 12px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  color: ${colors.primary};
`;
