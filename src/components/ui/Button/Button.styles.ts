import styled, { css } from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

const variantMap = {
  primary: css`
		background-color: ${colors.primary};
		color: ${colors.surface};
		&:hover:not(:disabled) {
			background-color: color-mix(in srgb, ${colors.primary} 85%, black);
		}
	`,
  secondary: css`
		background-color: ${gray[100]};
		color: ${gray[700]};
		&:hover:not(:disabled) {
			background-color: ${gray[200]};
		}
	`,
  outline: css`
		background-color: transparent;
		border: 1px solid ${colors.primary};
		color: ${colors.primary};
		&:hover:not(:disabled) {
			background-color: ${colors.primaryLight};
		}
	`,
  ghost: css`
		background-color: transparent;
		color: ${gray[600]};
		&:hover:not(:disabled) {
			background-color: ${gray[100]};
		}
	`,
} as const;

const sizeMap = {
  xs: css`
		padding: 6px 14px;
		font-size: 12px;
		border-radius: ${radii.lg};
	`,
  sm: css`
		padding: 8px 16px;
		font-size: 14px;
		border-radius: ${radii.xl};
	`,
  md: css`
		padding: 8px 16px;
		font-size: 14px;
		border-radius: ${radii.lg};
	`,
  lg: css`
		padding: 10px 24px;
		font-size: 14px;
		border-radius: ${radii.xl};
	`,
} as const;

export const StyledButton = styled.button<{
  $variant: ButtonVariant;
  $size: ButtonSize;
}>`
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-weight: 500;
	line-height: 1.5;
	border-radius: ${radii.lg};
	transition:
		background-color 0.15s,
		color 0.15s,
		border-color 0.15s;
	cursor: pointer;
	white-space: nowrap;
	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
	${(p) => variantMap[p.$variant]}
	${(p) => sizeMap[p.$size]}
`;
