import styled from 'styled-components';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import {
  flexCenter,
  flexGap,
  focusPrimaryBorder,
  resetButton,
  subtleScrollbar,
} from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const Trigger = styled.button<{ $isPlaceholder: boolean }>`
	${resetButton}
	${flexGap(8)}
	width: 100%;
	padding: 8px 12px;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.xl};
	background-color: ${colors.surface};
	font-size: 14px;
	text-align: right;
	direction: rtl;
	color: ${({ $isPlaceholder }) => ($isPlaceholder ? gray[400] : gray[800])};
	transition: border-color ${transitions.normal};

	&:hover {
		border-color: ${gray[300]};
	}

	${focusPrimaryBorder}
`;

export const Chevron = styled.span<{ $open: boolean }>`
	${flexCenter}
	flex-shrink: 0;
	color: ${gray[400]};
	transition: transform ${transitions.normal};
	transform: rotate(${({ $open }) => ($open ? '180deg' : '0deg')});
`;

export const Panel = styled(FloatingPanel)`
	${subtleScrollbar}
	padding: 4px 0;
	border-radius: ${radii.xl};
	overflow-y: auto;
	direction: rtl;
`;

export const PanelFooter = styled.div`
	display: flex;
	justify-content: flex-end;
	margin-top: 4px;
	padding: 8px 16px 4px;
	border-top: 1px solid ${gray[100]};
`;

export const DoneBtn = styled.button`
	${resetButton}
	${flexGap(4)}
	padding: 6px 16px;
	border-radius: ${radii.full};
	background-color: ${colors.primary};
	color: ${colors.surface};
	font-size: 12px;
	font-weight: 600;
	transition: opacity ${transitions.normal};

	&:hover {
		opacity: 0.9;
	}
`;
