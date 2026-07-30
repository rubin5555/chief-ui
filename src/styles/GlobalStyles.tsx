import { createGlobalStyle } from 'styled-components';
import { colors, gray } from './theme';

export const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }

  body {
    margin: 0;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 16px;
    background: ${colors.surface};
    color-scheme: light dark;
  }

  button {
    font-weight: 500;
    line-height: 1.5;
    cursor: pointer;
    border: none;
    background: none;
    padding: 0;
    font-family: inherit;
  }

  /* A form control's font does not inherit — left alone, a textarea is drawn in
     the browser's monospace default, which is why main sets fontFamily: inherit
     by hand on the ones it writes outside a Tailwind class
     (Edit.tsx:3111, 4377). Tailwind's preflight does this for it everywhere
     else; this is that line. */
  input,
  textarea,
  select {
    font-family: inherit;
  }

  /*
   * Keyboard focus, drawn once and drawn deliberately.
   *
   * :focus-visible rather than :focus — the browser lights the latter on every
   * mouse click as well, which is the "focus ring appears for no reason" noise
   * the default styling is blamed for. This is the app's own colour at a weight
   * that reads on a light and a dark surface alike, and an outline (not a
   * border) so it takes no space and follows whatever radius the element has.
   *
   * Components that already answer focus themselves override this: the
   * focusPrimaryBorder mixin's &:focus is a class-plus-pseudo selector and
   * outranks a bare pseudo-class, so a field that tints its border on focus
   * doesn't also get a ring around it.
   */
  :focus-visible {
    outline: 2px solid ${colors.primary};
    outline-offset: 2px;
  }

  p,h1,h2,h3,h4,h5,h6 {
    margin: 0;
  }

  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; margin: 6px; }
  ::-webkit-scrollbar-thumb {
    background-color: ${gray[300]};
    border-radius: 9999px;
    transition: background-color 0.2s;
  }
  ::-webkit-scrollbar-thumb:hover,
  ::-webkit-scrollbar-thumb:active { background-color: ${gray[500]}; }
  * { scrollbar-width: thin; scrollbar-color: ${gray[300]} transparent; }

  /* TinyMCE's image/link/table dialogs portal to document.body outside any component's
     scoped styles, and the oxide skin hardcodes them to a white panel. */
  .tox-dialog-wrap__backdrop {
    background: rgba(0, 0, 0, 0.5) !important;
  }

  .tox-dialog {
    background: ${colors.surface} !important;
    color: ${gray[700]} !important;
  }

  .tox-dialog__header,
  .tox-dialog__footer {
    background: ${colors.surface} !important;
    border-color: ${gray[100]} !important;
  }

  .tox-dialog__title,
  .tox-label,
  .tox-form__group {
    color: ${gray[700]} !important;
  }

  .tox-textfield,
  .tox-textarea,
  .tox-selectfield select {
    background: ${colors.surface} !important;
    border-color: ${gray[200]} !important;
    color: ${gray[900]} !important;
  }

  .tox-button--icon:not(.tox-button--naked) svg,
  .tox-icon svg {
    fill: currentColor !important;
  }
`;
