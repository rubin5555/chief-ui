import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';
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
 * `padding-right: SIDEBAR_WIDTH` is what optically centres the bar over the
 * paper. The row spans the whole viewport, but the paper below it is pushed left
 * by the sidebar, so a plain `justify-content: center` would leave every bar
 * ~128px off-centre. main does exactly this (Edit.tsx:3688) — it looks like a
 * hack and it is load-bearing.
 *
 * Physical `right`, not `inline-end`: the sidebar is the body row's first child
 * on an RTL page, so it sits on the physical right, and the padding has to be on
 * the same side it is. `inline-end` resolves to the left here and pushes every
 * bar a full sidebar's width the wrong way — the same reason the sidebar's own
 * divider is pinned with `left: 0`.
 */
export const BarRow = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  flex-shrink: 0;
  padding-right: ${SIDEBAR_WIDTH}px;
`;

/**
 * A topic block inside the paper (main's Edit.tsx:4219). The generous 10mm gap
 * below is what separates topics on a printed page — sections inside one topic
 * sit half that far apart.
 *
 * `outline` rather than `border` for a search hit: an outline is drawn outside the
 * box and takes no space, so highlighting a topic can't reflow the page under it.
 * The 4px offset holds it clear of the heading rule; a section's sits closer.
 *
 * Shared because two components draw a topic: SubjectBlock for all of them, and
 * SignaturesSection for `חתימות`, which main renders as its own case.
 */
export const SubjectRoot = styled.section<{ $highlighted: boolean }>`
  margin-bottom: 10mm;
  border-radius: ${radii.lg};
  outline: ${({ $highlighted }) => ($highlighted ? `2px solid ${docColors.searchHit}` : 'none')};
  outline-offset: 4px;
`;

/**
 * The topic heading rule. Unlike the section and sub-section header rows, this one
 * carries an underline — it is the only level main gives a visible divider.
 */
export const SubjectHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.5mm;
  margin-bottom: 4mm;
  border-bottom: 1px solid ${gray[200]};
  direction: rtl;
`;
