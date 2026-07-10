import styled from 'styled-components';

export const ContentRoot = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	gap: 24px;
	min-height: 0;
`;

export const TabGrid = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 16px;
`;
