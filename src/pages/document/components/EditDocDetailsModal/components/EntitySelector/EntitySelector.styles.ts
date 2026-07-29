import styled from 'styled-components';

/** Level and node side by side, each taking half the row (main, Edit.tsx:2182). */
export const SelectorRow = styled.div`
	display: flex;
	gap: 8px;

	> * {
		flex: 1;
		min-width: 0;
	}
`;
