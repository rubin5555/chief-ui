import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, docColors, gray, radii, transitions } from '@/styles/theme';

export const ChipsRow = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  padding: 6px 12px;
  border-bottom: 1px solid ${docColors.hairline};
  background: ${colors.surface};
  direction: rtl;
`;

export const RowLabel = styled.span`
  flex-shrink: 0;
  font-size: 10px;
  color: ${gray[400]};
`;

// main tints the chip from the status colour with hex alpha suffixes
// (`s.color + '18'` / `+ '40'`, Edit.tsx:4113). Those can't be concatenated onto
// a `var(--token)`, so the same ~9%/25% opacities come from color-mix, which
// also keeps the tint correct when the token changes in dark mode.
export const Chip = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px 2px 4px;
  border: 1px solid ${({ $color }) => `color-mix(in srgb, ${$color} 25%, transparent)`};
  border-radius: ${radii.full};
  background: ${({ $color }) => `color-mix(in srgb, ${$color} 9%, transparent)`};
  font-size: 10px;
  font-weight: 500;
  color: ${({ $color }) => $color};
`;

export const ChipDot = styled.span<{ $color: string }>`
  width: 6px;
  height: 6px;
  flex-shrink: 0;
  border-radius: ${radii.full};
  background: ${({ $color }) => $color};
`;

export const ChipRemoveBtn = styled.button`
  ${resetButton}
  display: flex;
  flex-shrink: 0;
  margin-inline-start: 2px;
  padding: 0;
  color: inherit;
  opacity: 0.6;
  transition: opacity ${transitions.fast};

  &:hover {
    opacity: 1;
  }
`;

export const ClearAllBtn = styled.button`
  ${resetButton}
  margin-inline-start: 4px;
  font-size: 10px;
  color: ${gray[400]};
  transition: color ${transitions.fast};

  &:hover {
    color: ${gray[600]};
  }
`;
