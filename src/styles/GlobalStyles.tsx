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

  input {
    font-family: inherit;
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
