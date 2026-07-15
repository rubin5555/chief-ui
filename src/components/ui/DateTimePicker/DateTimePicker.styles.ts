import { Calendar } from 'lucide-react';
import styled from 'styled-components';
import { ellipsis, flexGap, focusPrimaryBorder, rtlTextInput } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Trigger = styled.button<{ $isPlaceholder?: boolean }>`
	width: 100%;
	${flexGap(8)}
	padding: 8px 12px;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.xl};
	${rtlTextInput}
	background: ${colors.surface};
	color: ${({ $isPlaceholder }) => ($isPlaceholder ? gray[400] : gray[800])};
	cursor: pointer;
	transition: border-color ${transitions.normal};
	box-sizing: border-box;
	${focusPrimaryBorder}
	&:hover {
		border-color: ${gray[300]};
	}
`;

export const CalendarIcon = styled(Calendar)`
	flex-shrink: 0;
	color: ${gray[400]};
`;

export const TriggerText = styled.span`
	flex: 1;
	${ellipsis}
`;
