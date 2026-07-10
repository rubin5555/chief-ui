import styled from 'styled-components';
import { colors, gray, shadows } from '@/styles/theme';

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9998;
  background-color: rgba(0,0,0,0.5);
`;

export const ModalCard = styled.div`
  background-color: ${colors.surface};
  border-radius: 24px;
  box-shadow: ${shadows.xxl};
  width: 540px;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

export const ModalHeader = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 32px;
  background-color: ${colors.surface};
  border-bottom: 1px solid ${gray[100]};
`;

export const ModalHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ModalHeaderIcon = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 12px;
  background-color: ${gray[100]};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.primary};
`;

export const ModalTitle = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${gray[900]};
  margin: 0;
`;

export const CloseButton = styled.button`
  color: ${gray[400]};
  transition: color 0.15s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover { color: ${gray[600]}; }
`;

export const ModalBody = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px 32px;
`;
