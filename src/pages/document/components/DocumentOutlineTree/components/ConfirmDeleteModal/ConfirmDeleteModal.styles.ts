import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 32px 28px;
`;

export const Warning = styled.p`
  margin: 0;
  font-size: 14px;
  color: ${gray[500]};
  text-align: center;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
  margin-top: 4px;
`;

const ConfirmButton = styled.button`
  ${resetButton}
  flex: 1;
  padding: 10px 0;
  border-radius: ${radii['2xl']};
  font-size: 14px;
  text-align: center;
  transition: all ${transitions.normal};
`;

export const CancelBtn = styled(ConfirmButton)`
  font-weight: 500;
  color: ${gray[600]};
  background-color: ${colors.surface};
  border: 1px solid ${gray[200]};

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const ConfirmBtn = styled(ConfirmButton)`
  font-weight: 600;
  color: ${colors.surface};
  background-color: ${colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;
