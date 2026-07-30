import styled, { css } from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, docColors, gray, radii, shadows } from '@/styles/theme';

const richTextContent = css`
	p {
		margin: 0 0 6px;
		&:last-child {
			margin-bottom: 0;
		}
	}

	ul,
	ol {
		margin: 0 0 6px;
		padding-right: 20px;
		padding-left: 0;
		&:last-child {
			margin-bottom: 0;
		}
	}

	a {
		color: ${colors.primary};
		text-decoration: underline;
	}

	img {
		max-width: 100%;
		height: auto;
		border-radius: ${radii.lg};
	}

	table {
		border-collapse: collapse;
		width: 100%;
		td,
		th {
			border: 1px solid ${gray[200]};
			padding: 6px 10px;
		}
		th {
			background: ${gray[50]};
			font-weight: 600;
		}
	}

	caption.jt-caption {
		caption-side: top;
		text-align: right;
		font-weight: 600;
		padding: 0 0 6px;
		color: ${gray[700]};
	}
	.jt-num {
		text-align: left;
		font-variant-numeric: tabular-nums;
	}
	.jt-null {
		opacity: 0.4;
	}
	.jt-true,
	.jt-false {
		font-weight: 600;
	}
	.jt-true {
		color: ${colors.accent};
	}
	tfoot .jt-num,
	tfoot td {
		background: ${gray[50]};
		font-weight: 600;
	}
	.jt-ul.jt-empty {
		opacity: 0.5;
		list-style: none;
		padding-right: 0;
	}
`;

export const EditorWrapper = styled.div<{ $inset: boolean }>`
	display: flex;
	flex-direction: column;
	border: 1px solid ${({ $inset }) => ($inset ? docColors.hairline : gray[200])};
	border-radius: ${radii.xl};
	overflow: hidden;
	box-shadow: ${({ $inset }) => ($inset ? 'none' : shadows.sm)};
	background: ${({ $inset }) => ($inset ? gray[50] : colors.surface)};
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;

	&:focus-within {
		border-color: ${({ $inset }) => ($inset ? gray[300] : colors.primary)};
		box-shadow: ${({ $inset }) =>
      $inset ? 'none' : `0 0 0 3px color-mix(in srgb, ${colors.primaryLight} 30%, transparent)`};
	}
`;

export const EditorBody = styled.div`
	position: relative;
`;

export const PreviewContent = styled.div<{
  $minHeight: number;
  $isEmpty: boolean;
  $disabled: boolean;
  $overlay?: boolean;
  $isDragOver?: boolean;
}>`
	${({ $overlay }) =>
    $overlay &&
    `
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
  `}
	${({ $isDragOver }) =>
    $isDragOver &&
    css`
      outline: 1.5px dashed ${colors.primary};
      outline-offset: -2px;
      background: color-mix(in srgb, ${colors.primaryLight} 60%, transparent);
    `}
	padding: 10px 14px;
	min-height: ${({ $minHeight }) => $minHeight}px;
	direction: rtl;
	font-size: 13px;
	line-height: 1.75;
	color: ${gray[700]};
	cursor: ${({ $disabled }) => ($disabled ? 'default' : 'text')};
	word-break: break-word;

	${({ $isEmpty }) =>
    $isEmpty &&
    `
    &::before {
      content: attr(data-placeholder);
      color: inherit;
      opacity: 0.4;
      pointer-events: none;
      font-size: 13px;
    }
  `}

	${richTextContent}
`;

export const PreviewWrapper = styled.div`
	position: relative;
`;

export const CursorBar = styled.div`
	position: absolute;
	width: 2px;
	background: ${colors.accent};
	pointer-events: none;
	z-index: 2;
`;

export const CursorLabel = styled.span`
	position: absolute;
	top: -18px;
	right: -2px;
	background: ${colors.accent};
	color: ${colors.surface};
	font-size: 10px;
	font-weight: 600;
	padding: 1px 6px;
	border-radius: ${radii.lg};
	white-space: nowrap;
	pointer-events: none;
`;

export const LockBadge = styled.div`
	position: absolute;
	top: 6px;
	left: 8px;
	z-index: 2;
	${flexGap(4)}
	background: color-mix(in srgb, ${colors.accent} 12%, ${colors.surface});
	color: ${colors.accent};
	font-size: 10.5px;
	font-weight: 600;
	padding: 3px 8px;
	border-radius: ${radii.full};
	pointer-events: none;
`;

export const EditorContent = styled.div<{ $minHeight: number }>`
	position: relative;
	min-height: ${({ $minHeight }) => $minHeight}px;
	background: ${colors.surface};
	direction: rtl;
	padding: 10px 14px;

	.mce-content-body {
		outline: none;
		font-size: 13px;
		line-height: 1.75;
		color: ${gray[700]};
		font-family: inherit;
		word-break: break-word;

		&[data-mce-placeholder]:not(.mce-visualblocks)::before {
			content: attr(data-mce-placeholder);
			right: 0;
			color: ${gray[400]};
			position: absolute;
			pointer-events: none;
			font-size: 13px;
		}

		${richTextContent}
	}
`;
