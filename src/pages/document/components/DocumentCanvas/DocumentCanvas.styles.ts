import styled from 'styled-components';

/**
 * The row below the chrome bars: sidebar plus editor, filling what's left of the
 * viewport. `overflow: hidden` is what confines scrolling to the editor column —
 * without it the whole page scrolls and the sticky toolbar has nothing to stick
 * to.
 *
 * The sidebar is this row's *first* child and the page is `dir="rtl"`, which is
 * what puts it on the right.
 */
export const BodyRow = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;
