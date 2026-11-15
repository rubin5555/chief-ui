import styled from 'styled-components';
import { dialogMotion, overlayMotion, widthMotion } from '@/styles/animations';
import { ellipsis, flexBetween, flexCenter, flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows } from '@/styles/theme';

export const Overlay = styled.div<{ $closing?: boolean }>`
  position: fixed;
  inset: 0;
  ${flexCenter}
  z-index: 9998;
  background-color: rgba(0,0,0,0.5);
  ${overlayMotion}
`;

export const ModalCard = styled.div<{
  $closing?: boolean;
  $width?: number;
  $maxWidth?: string;
  $height?: string;
  $maxHeight?: string;
}>`
  background-color: ${colors.surface};
  border-radius: ${radii['3xl']};
  box-shadow: ${shadows.xxl};
  width: ${({ $width }) => $width ?? 540}px;
  max-width: ${({ $maxWidth }) => $maxWidth ?? '90vw'};
  ${({ $height }) => ($height ? `height: ${$height};` : '')}
  max-height: ${({ $height, $maxHeight }) => $height ?? $maxHeight ?? '90vh'};
  display: flex;
  flex-direction: column;
  overflow: hidden;
  ${widthMotion}
  ${dialogMotion}
`;

export const ModalHeader = styled.div`
  flex-shrink: 0;
  ${flexBetween}
  padding: 16px 32px;
  background-color: ${colors.surface};
  border-bottom: 1px solid ${gray[100]};
`;

export const ModalHeaderLeft = styled.div`
  ${flexGap(8)}
  min-width: 0;
`;

export const ModalHeaderRight = styled.div`
  ${flexGap(12)}
  flex-shrink: 0;
`;

export const ModalTitleBlock = styled.div`
  min-width: 0;
  text-align: right;
`;

export const ModalSubtitle = styled.p`
  margin: 2px 0 0;
  font-size: 12px;
  color: ${gray[500]};
  ${ellipsis}
`;

export const ModalHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: ${radii.xl};
  background-color: ${gray[100]};
  ${flexCenter}
  color: ${colors.primary};
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const ConfirmHeader = styled.div`
  flex-shrink: 0;
  padding: 28px 32px 0;
`;

export const ConfirmTitle = styled.h2`
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: ${gray[900]};
  text-align: center;
`;

export const CloseButton = styled.button`
  color: ${gray[400]};
  transition: color 0.15s;
  cursor: pointer;
  ${flexCenter}
  &:hover { color: ${gray[600]}; }
`;

export const ModalBody = styled.div<{ $noPadding?: boolean }>`
  flex: 1;
  ${({ $noPadding }) =>
    $noPadding
      ? 'display: flex; flex-direction: column; overflow: hidden;'
      : 'overflow-y: auto; padding: 24px 32px;'}
`;

export const ModalFooter = styled.div<{ $align?: 'end' | 'between' }>`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: ${({ $align }) => ($align === 'between' ? 'space-between' : 'flex-end')};
  gap: 12px;
  padding: 16px 32px;
  border-top: 1px solid ${gray[100]};
`;
