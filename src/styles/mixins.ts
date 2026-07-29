import { css } from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ellipsis = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const flexCenter = css`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const flexBetween = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const flexGap = (gap: number) => css`
  display: flex;
  align-items: center;
  gap: ${gap}px;
`;

export const flexColumn = (gap: number) => css`
  display: flex;
  flex-direction: column;
  gap: ${gap}px;
`;

export const resetButton = css`
  background: transparent;
  border: none;
  cursor: pointer;
`;

export const flexFill = css`
  flex: 1;
  min-width: 0;
`;

export const flexScroll = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
`;

// A scrollbar for something small and floating — a menu, a popover — where the
// platform's own is nearly as wide as the content and sits on top of the rounded
// corner it is meant to be inside.
//
// Thin with a transparent track rather than hidden altogether: a menu that
// scrolls with no sign that it scrolls is a menu whose last option nobody finds.
export const subtleScrollbar = css`
  scrollbar-width: thin;
  scrollbar-color: ${gray[300]} transparent;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: ${radii.full};
    background: ${gray[300]};
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${gray[400]};
  }
`;

export const rtlTextInput = css`
  font-size: 14px;
  text-align: right;
  direction: rtl;
`;

export const focusPrimaryBorder = css`
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

// One of main's navbar action icons (TopNavbar.tsx:1254): a 16px glyph in a
// circular hit area that only tints on hover — no active/selected state, since
// what's active is shown in the page itself rather than on the button.
//
// It lives here rather than in DocActionToolbar.styles.ts because the document
// page's FilterPanel renders its own trigger *into* that toolbar and has to be
// indistinguishable from the buttons beside it, and src/styles is the nearest
// common ancestor of a layout component and a page one.
export const navIconAction = css`
  padding: 6px;
  border-radius: ${radii.full};
  transition: background-color ${transitions.normal};
  ${flexCenter}
  color: ${gray[500]};

  &:hover {
    background-color: ${gray[100]};
  }
`;

export const dashedActionButton = css`
  ${flexGap(6)}
  color: color-mix(in srgb, ${colors.primary} 50%, transparent);
  border: 1px dashed color-mix(in srgb, ${colors.primary} 20%, transparent);
  border-radius: ${radii.xl};
  font-size: 12px;
  transition:
    color ${transitions.fast},
    border-color ${transitions.fast};

  &:hover {
    color: ${colors.primary};
    border-color: color-mix(in srgb, ${colors.primary} 40%, transparent);
  }
`;
