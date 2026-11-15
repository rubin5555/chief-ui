import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

// The app's one checkbox. main draws every one of them the same way — a 14px
// square with a navy tick, no margin of its own, never allowed to shrink in a
// flex row — so a bare `<input type="checkbox">` is not a lighter variant of
// this, it is the browser's default sitting where a designed control belongs.
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  /* Tailwind's reset zeroes this, so main's controls carry no UA margin and
     their rows are spaced by the flex gap alone. */
  margin: 0;
  border-radius: ${radii.sm};
  accent-color: ${colors.primary};
  cursor: pointer;
`;
