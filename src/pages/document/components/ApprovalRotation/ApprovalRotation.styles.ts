import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const TimelineRow = styled.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;

export const TimelineItem = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
	min-width: 64px;
`;

export const TimelineDot = styled.span<{ $state: 'approved' | 'active' | 'idle' }>`
	width: 14px;
	height: 14px;
	border-radius: ${radii.full};
	background-color: ${(props) =>
    props.$state === 'approved'
      ? colors.accent
      : props.$state === 'active'
        ? colors.primary
        : gray[300]};
`;

export const TimelineLabel = styled.span<{ $state: 'approved' | 'active' | 'idle' }>`
	font-size: 10px;
	font-weight: 600;
	white-space: nowrap;
	color: ${(props) =>
    props.$state === 'approved'
      ? colors.accent
      : props.$state === 'active'
        ? colors.primary
        : gray[400]};
`;

export const TimelineConnector = styled.div`
	flex: 1;
	height: 1px;
	min-width: 16px;
	background-color: ${colors.border};
`;

export const HmlList = styled.div`
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
`;

export const HmlChip = styled.span`
	padding: 3px 10px;
	border-radius: ${radii.full};
	background-color: ${gray[50]};
	color: ${gray[600]};
	font-size: 11px;
`;

export const Card = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
	padding: 14px;
	border-radius: ${radii.xl};
	border: 1px solid ${colors.border};
`;

export const CarouselHeader = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
`;

export const CarouselNavBtn = styled.button`
	display: flex;
	padding: 4px;
	border: none;
	background: none;
	border-radius: ${radii.lg};
	color: ${gray[400]};
	cursor: pointer;

	&:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}
`;

export const CarouselTitle = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
`;

export const StageLabel = styled.span`
	font-size: 13px;
	font-weight: 700;
	color: ${gray[800]};
`;

export const UserLabel = styled.span`
	font-size: 10px;
	color: ${gray[400]};
`;

export const Notes = styled.textarea`
	width: 100%;
	min-height: 70px;
	padding: 10px 12px;
	border-radius: ${radii.lg};
	border: 1px solid ${colors.border};
	font-size: 13px;
	color: ${gray[800]};
	resize: none;

	&:focus {
		outline: none;
	}
`;

export const SignatureSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 6px;
`;

export const SignatureLabel = styled.span`
	font-size: 11px;
	font-weight: 600;
	color: ${gray[600]};
`;

export const SignatureBox = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	height: 70px;
	border-radius: ${radii.lg};
	background-color: ${gray[50]};
	color: ${gray[400]};
	font-size: 13px;
	font-weight: 600;
`;

export const SignatureActions = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	position: relative;
`;

export const SignatureActionBtn = styled.button`
	border: none;
	background: none;
	font-size: 11px;
	color: ${gray[500]};
	cursor: pointer;

	&:hover {
		color: ${colors.primary};
	}
`;

export const RejectBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: 10px;
`;

export const DistributePromptBox = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 10px;
	text-align: center;
	padding: 10px 0;
`;

export const DistributePromptTitle = styled.p`
	font-size: 15px;
	font-weight: 700;
	color: ${gray[900]};
	margin: 0;
`;

export const DistributePromptBody = styled.p`
	font-size: 13px;
	color: ${gray[600]};
	margin: 0;
`;

export const FooterActions = styled.div`
	display: flex;
	gap: 10px;
`;

export const OutlineBtn = styled.button`
	padding: 8px 18px;
	border-radius: ${radii.full};
	border: 1px solid ${colors.border};
	background: none;
	font-size: 13px;
	font-weight: 600;
	color: ${gray[700]};
	cursor: pointer;
`;

export const SolidBtn = styled.button<{ $danger?: boolean }>`
	padding: 8px 20px;
	border-radius: ${radii.full};
	border: none;
	font-size: 13px;
	font-weight: 600;
	color: ${colors.surface};
	background-color: ${(props) => (props.$danger ? colors.danger : colors.primary)};
	cursor: pointer;
`;

export const TextBtn = styled.button`
	padding: 8px 18px;
	border: none;
	background: none;
	font-size: 13px;
	font-weight: 500;
	color: ${gray[500]};
	cursor: pointer;
`;
