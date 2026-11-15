import styled from 'styled-components';
import { resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 32px 28px;
`;

export const Question = styled.p`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${gray[600]};
  text-align: center;
`;

export const DocName = styled.span`
  font-weight: 600;
`;

export const Consequence = styled.p`
  margin: -8px 0 0;
  font-size: 12px;
  color: ${gray[400]};
  text-align: center;
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 12px;
  width: 100%;
`;

const ConfirmButton = styled.button`
  ${resetButton}
  flex: 1;
  padding: 10px 0;
  border-radius: ${radii.xl};
  font-size: 14px;
  text-align: center;
  transition: all ${transitions.normal};
`;

export const LaterBtn = styled(ConfirmButton)`
  font-weight: 500;
  color: ${gray[500]};
  border: 1px solid ${gray[200]};

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const DistributeBtn = styled(ConfirmButton)`
  font-weight: 600;
  color: ${colors.surface};
  background-color: ${colors.primary};

  &:hover {
    opacity: 0.9;
  }
`;
