import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const OptionsCard = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	border: 1px solid ${gray[100]};
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
`;
