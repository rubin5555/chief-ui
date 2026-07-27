import styled from 'styled-components';

/**
 * The real file input, kept out of sight but not out of the accessibility tree.
 *
 * `display: none` would take it out of both, and a screen reader would then find
 * no file control at all — only a paperclip button whose click opens a native
 * dialog it can't describe. Clipped to nothing instead, which hides it visually
 * and leaves it focusable and labelled.
 */
export const HiddenFileInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
`;
