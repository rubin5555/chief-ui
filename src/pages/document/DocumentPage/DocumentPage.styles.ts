import styled from 'styled-components';
import { docColors } from '@/styles/theme';

/**
 * main's page root (Edit.tsx:3665) minus the navbar, which AppLayout already
 * renders above this.
 *
 * `overflow: hidden` and the column layout are load-bearing: the document page
 * does not scroll as a page. The chrome bars are fixed height and the editor
 * column inside the body row does the scrolling, which is what lets the toolbar
 * stick to the top of the paper.
 *
 * `background-attachment: fixed` keeps the diagonal gradient anchored to the
 * viewport, so the paper appears to move across a still backdrop rather than
 * dragging the gradient with it. No padding — the bars are meant to reach the
 * viewport edges.
 */
export const PageRoot = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	background: ${docColors.canvasGradient};
	background-attachment: fixed;
`;
