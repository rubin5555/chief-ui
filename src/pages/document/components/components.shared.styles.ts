import styled from 'styled-components';
import { SIDEBAR_WIDTH } from '../document.measurements';

// Styled parts with consumers in more than one sibling directory under
// components/. Per .claude/skills/system-assembly.md these belong at the
// consumers' common ancestor rather than in whichever component happened to
// need them first — a `.styles.ts` is private to its own directory.
//
// Anything used by exactly one component stays in that component's own
// `.styles.ts`. Keep this file small; it is not a global stylesheet.

/**
 * Full-viewport row holding one of the three chrome bars above the document:
 * the metadata pill, the source-systems notice, and the comparison bar.
 *
 * `padding-inline-end: SIDEBAR_WIDTH` is what optically centres the bar over the
 * paper. The row spans the whole viewport, but the paper below it is pushed left
 * by the sidebar, so a plain `justify-content: center` would leave every bar
 * ~128px off-centre. main does exactly this (Edit.tsx:3688) — it looks like a
 * hack and it is load-bearing.
 */
export const BarRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  padding-inline-end: ${SIDEBAR_WIDTH}px;
`;
