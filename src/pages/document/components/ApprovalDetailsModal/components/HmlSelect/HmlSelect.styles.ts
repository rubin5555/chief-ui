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

/**
 * Styled here rather than taken from `ui/Select`: main draws both of this
 * dialog's fields identically (Edit.tsx:2944/3016), but this one opens a
 * checklist with its own expandable rows, not a list of options — a shared
 * control that answered both would be a control with a mode.
 *
 * The chevron-then-label order is `ui/Select`'s, not main's (which puts the
 * chevron on the far side). These two fields sit one above the other, and them
 * differing from each other would read as a defect in a way that both differing
 * from the mock in the same small way does not.
 */
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

/**
 * main's `הוסף` (Edit.tsx:3044). It confirms nothing — each checkbox has already
 * taken effect — it is just the way out of the list without hunting for
 * somewhere neutral to click, which on a checklist you are meant to tick several
 * things in is worth having.
 */
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
