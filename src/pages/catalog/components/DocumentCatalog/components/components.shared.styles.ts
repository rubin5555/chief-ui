import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

// main draws the same confirm dialog three times — a bold question, an optional
// line of consequence, then a cancel/confirm pair on one row. These are that
// shape, shared by the delete and cancel dialogs.

export const ConfirmBody = styled.div`
  display: flex;
  flex-direction: column;
  padding: 4px 24px 20px;
`;

export const ConfirmQuestion = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: ${gray[900]};
`;

export const ConfirmNote = styled.p`
  margin-bottom: 28px;
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
  color: ${gray[500]};
`;

export const ConfirmActions = styled.div`
  display: flex;
  gap: 12px;
`;

export const ConfirmCancelBtn = styled.button`
  flex: 1;
  padding: 10px 0;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.full};
  font-size: 14px;
  font-weight: 500;
  color: ${gray[700]};
  background: ${colors.surface};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const ConfirmPrimaryBtn = styled.button`
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

// A dialog whose header carries a second line naming the document it is about.
export const ModalSubtitle = styled.p`
  margin-top: 2px;
  font-size: 12px;
  color: ${gray[500]};
`;
