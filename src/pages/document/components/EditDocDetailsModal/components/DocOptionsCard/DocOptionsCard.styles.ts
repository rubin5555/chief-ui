import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

/**
 * The four distribution options as one bordered card rather than four loose rows
 * (main, Edit.tsx:2362): they are settings about what happens to the document
 * after it leaves, and reading as a group is what distinguishes them from the
 * fields above, which describe what the document *is*.
 */
export const OptionsCard = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid ${gray[100]};
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
`;

export const OptionRow = styled.div<{ $locked?: boolean }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	padding: 12px 16px;
	transition: background-color 0.15s;
	opacity: ${({ $locked }) => ($locked ? 0.5 : 1)};

	&:not(:first-child) {
		border-top: 1px solid ${gray[100]};
	}

	&:hover {
		background-color: ${({ $locked }) => ($locked ? 'transparent' : gray[50])};
	}
`;

export const OptionLabel = styled.span<{ $locked?: boolean }>`
	font-size: 14px;
	color: ${({ $locked }) => ($locked ? gray[400] : gray[700])};
`;
