import styled from 'styled-components';
import { docColors } from '@/styles/theme';

export const PageRoot = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	overflow: hidden;
	background: ${docColors.canvasGradient};
	background-attachment: fixed;
`;
