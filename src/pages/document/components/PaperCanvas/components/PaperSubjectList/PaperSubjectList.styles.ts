import styled from 'styled-components';

/**
 * Holds the full height of every topic, measured or estimated, so the sheet is
 * as tall as the document even while most of it isn't rendered — which is what
 * keeps the scrollbar honest and the page-break lines landing where they would
 * have anyway.
 */
export const VirtualList = styled.div<{ $height: number }>`
	position: relative;
	width: 100%;
	height: ${({ $height }) => $height}px;
`;

/**
 * Absolutely positioned, so a topic's height can change — a section opening, a
 * comment thread appearing — without moving anything until it is re-measured.
 * Being out of flow also means it establishes a block formatting context, so the
 * 10mm gap `SubjectRoot` carries below itself is inside the measured height
 * rather than collapsing out of it.
 */
export const VirtualSubject = styled.div<{ $top: number }>`
	position: absolute;
	top: 0;
	inset-inline-start: 0;
	width: 100%;
	transform: translateY(${({ $top }) => $top}px);
`;
