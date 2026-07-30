import styled from 'styled-components';

export const VirtualList = styled.div<{ $height: number }>`
	position: relative;
	width: 100%;
	height: ${({ $height }) => $height}px;
`;

export const VirtualSubject = styled.div<{ $top: number }>`
	position: absolute;
	top: 0;
	inset-inline-start: 0;
	width: 100%;
	transform: translateY(${({ $top }) => $top}px);
`;
