import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { docColors, gray, radii, shadows } from '@/styles/theme';

// A 16px outlined circle holding a bold `!` (main, Edit.tsx:3808). Not an icon:
// main draws it as a bordered circle around the character itself, which is why
// line-height is pinned to 1 — anything larger and the glyph sits off-centre.
export const TipBadge = styled.button`
  ${resetButton}
  ${flexCenter}
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border: 1px solid ${gray[400]};
  border-radius: ${radii.full};
  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  color: ${gray[500]};
  cursor: default;
`;

// Fixed-position and anchored off the badge's own rect, so the tip escapes the
// sidebar's overflow instead of being clipped by it.
//
// `right`, not `left`: the tip's right edge lines up with the badge's, and it
// grows leftward into the page — the only direction with room, since the badge is
// already near the viewport's right edge in this RTL layout.
export const Tip = styled.div<{ $top: number; $right: number }>`
  position: fixed;
  z-index: 9999;
  top: ${(props) => props.$top}px;
  right: ${(props) => props.$right}px;
  width: 220px;
  padding: 5px 9px;
  border-radius: ${radii.md};
  background-color: ${docColors.neutralBar};
  color: ${gray[800]};
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  text-align: right;
  box-shadow: ${shadows.tooltip};
  // The tip can overlap the badge that opened it; without this, the pointer
  // entering the tip would count as leaving the badge and close it mid-read.
  pointer-events: none;
`;
