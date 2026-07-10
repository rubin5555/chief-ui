import styled, { css } from 'styled-components';
import { colors, gray, radii, shadows } from '@/styles/theme';

// Shared between the live TinyMCE body and the inactive-state preview (see
// ContentEditor.tsx) so both render identical typography for the same HTML string.
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
`;

export const EditorWrapper = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid ${gray[200]};
	border-radius: ${radii.xl};
	overflow: hidden;
	box-shadow: ${shadows.sm};
	background: ${colors.surface};
	transition:
		border-color 0.15s ease,
		box-shadow 0.15s ease;

	&:focus-within {
		border-color: ${colors.primary};
		box-shadow: 0 0 0 3px color-mix(in srgb, ${colors.primaryLight} 30%, transparent);
	}
`;

export const ToolbarContainer = styled.div`
	min-height: 42px;
	background: ${gray[50]};
	border-bottom: 1px solid ${gray[100]};
	direction: rtl;

	/* Strip TinyMCE's own wrapper chrome so it blends into our container */
	.tox.tox-tinymce-inline,
	.tox.tox-tinymce-aux,
	.tox .tox-editor-header {
		border: none !important;
		box-shadow: none !important;
		background: transparent !important;
	}

	.tox .tox-toolbar,
	.tox .tox-toolbar__primary,
	.tox .tox-toolbar-overlord {
		background: transparent !important;
		border: none !important;
		padding: 2px 4px !important;
	}

	/* Toolbar buttons */
	.tox .tox-tbtn {
		border-radius: ${radii.lg} !important;
		color: ${gray[600]} !important;
		background: transparent !important;

		&:hover {
			background: ${gray[200]} !important;
			color: ${gray[900]} !important;
		}

		&.tox-tbtn--enabled,
		&.tox-tbtn--active {
			background: ${colors.primaryLight} !important;
			color: ${colors.primary} !important;
		}

		svg {
			fill: currentColor !important;
		}
	}

	/* Dividers between groups */
	.tox .tox-toolbar__group:not(:last-of-type) {
		border-right: 1px solid ${gray[200]} !important;
		border-left: none !important;
	}

	/* Color picker swatches */
	.tox .tox-split-button {
		border-radius: ${radii.lg} !important;

		&:hover > .tox-tbtn {
			background: ${gray[200]} !important;
		}
	}

	/* Floating menus/popups (color swatches, table grid picker, overflow toolbar) render
	   into a portalled sink rather than staying nested under the toolbar chrome above, but
	   TinyMCE's oxide skin still hardcodes them to a white panel — override to match. */
	.tox .tox-menu {
		background: ${colors.surface} !important;
		border-color: ${gray[200]} !important;
		box-shadow: ${shadows.md} !important;
	}

	.tox .tox-collection__item {
		color: ${gray[700]} !important;
	}

	.tox .tox-collection__item--active,
	.tox .tox-collection__item:hover {
		background: ${gray[100]} !important;
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

export const EditorContent = styled.div<{ $minHeight: number }>`
	position: relative;
	min-height: ${({ $minHeight }) => $minHeight}px;
	background: ${colors.surface};
	direction: rtl;
	padding: 10px 14px;

	/* The contenteditable div TinyMCE creates in inline mode */
	.mce-content-body {
		outline: none;
		font-size: 13px;
		line-height: 1.75;
		color: ${gray[700]};
		font-family: inherit;
		word-break: break-word;

		/* Placeholder */
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
