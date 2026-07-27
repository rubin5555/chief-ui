import styled from 'styled-components';
import { docColors, radii, shadows } from '@/styles/theme';

// The tooltip is a child of this, positioned against it — so the wrapper is what
// establishes the containing block and what the hover is detected on.
export const TipRoot = styled.span`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  margin-inline-end: 3px;
  color: ${docColors.amberBorder};
  cursor: default;
`;

/**
 * Shown by CSS on hover and focus rather than by React state.
 *
 * There is nothing to position at runtime — the tip hangs off its own trigger, so
 * a rect measurement would only reproduce what the layout already knows. That
 * makes this the one tooltip on the page with no state behind it, unlike the
 * sidebar's, which has to escape an overflow.
 */
export const Tip = styled.span`
  position: absolute;
  bottom: 120%;
  right: 50%;
  transform: translateX(50%);
  z-index: 99999;
  display: none;
  width: max-content;
  max-width: 220px;
  padding: 6px 10px;
  border-radius: ${radii.lg};
  background-color: ${docColors.ink};
  color: ${docColors.inkInverse};
  font-size: 11px;
  font-weight: 400;
  line-height: 1.5;
  text-align: right;
  // Instructions are written in a textarea, so their line breaks are the author's
  // and have to survive into the tip.
  white-space: pre-wrap;
  box-shadow: ${shadows.lg};
  pointer-events: none;

  ${TipRoot}:hover &,
  ${TipRoot}:focus-within & {
    display: block;
  }
`;

// A triangle drawn from borders, pointing back at the icon.
export const TipArrow = styled.span`
  position: absolute;
  top: 100%;
  right: 50%;
  transform: translateX(50%);
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-top: 6px solid ${docColors.ink};
`;
