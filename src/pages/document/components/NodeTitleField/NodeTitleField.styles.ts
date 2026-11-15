import styled, { css } from 'styled-components';
import { docColors, gray, radii, transitions } from '@/styles/theme';
import type { NodeTitleVariant } from './NodeTitleField.types';

const VARIANT: Record<NodeTitleVariant, { size: number; weight: number; color: string }> = {
  subject: { size: 14, weight: 700, color: docColors.ink },
  section: { size: 12, weight: 600, color: gray[700] },
  subSection: { size: 11, weight: 600, color: gray[500] },
};

const titleTypography = (variant: NodeTitleVariant) => css`
  font-size: ${VARIANT[variant].size}px;
  font-weight: ${VARIANT[variant].weight};
`;

export const Input = styled.input<{ $variant: NodeTitleVariant; $autoWidth: boolean }>`
  ${({ $variant }) => titleTypography($variant)}
  padding: 2px 4px;
  border: none;
  border-radius: ${radii.sm};
  background: transparent;
  color: ${({ $variant }) => VARIANT[$variant].color};
  text-align: right;
  direction: rtl;
  transition: background-color ${transitions.fast};

  ${({ $autoWidth }) =>
    $autoWidth
      ? css`
          position: absolute;
          inset: 0;
          width: 100%;
        `
      : css`
          flex: 1;
          min-width: 0;
        `}

  &::placeholder {
    color: ${docColors.placeholderInk};
  }

  &:hover,
  &:focus {
    outline: none;
    background-color: ${gray[50]};
  }
`;

export const AutoWidthWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  min-width: 20px;
`;

export const Ghost = styled.span<{ $variant: NodeTitleVariant }>`
  ${({ $variant }) => titleTypography($variant)}
  visibility: hidden;
  display: inline-block;
  max-width: 100%;
  padding: 2px 4px;
  overflow: hidden;
  white-space: pre;
`;
