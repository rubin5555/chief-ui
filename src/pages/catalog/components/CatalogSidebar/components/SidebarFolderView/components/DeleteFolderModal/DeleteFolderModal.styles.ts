import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Warning = styled.p`
  padding: 0 32px 20px;
  font-size: 14px;
  color: ${gray[400]};
  text-align: center;
`;

export const ButtonRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 24px 24px;
`;

export const CancelBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: ${radii.full};
  border: 1px solid ${gray[200]};
  font-size: 14px;
  font-weight: 500;
  color: ${gray[600]};
  background: ${colors.surface};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const ConfirmBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border-radius: ${radii.full};
  font-size: 14px;
  font-weight: 700;
  color: ${colors.surface};
  background: ${colors.primary};
  transition: opacity ${transitions.slow};

  &:hover {
    opacity: 0.9;
  }
`;
