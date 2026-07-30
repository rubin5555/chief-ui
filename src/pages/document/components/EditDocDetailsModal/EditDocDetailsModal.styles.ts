import styled from 'styled-components';
import { colors, docStatusColors, gray, radii } from '@/styles/theme';

export const Body = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
`;

export const FullWidthField = styled.div`
  grid-column: 1 / -1;
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${gray[500]};
`;

export const NameInput = styled.input<{ $needsRename?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border-radius: ${radii.lg};
  border: 1.5px solid ${({ $needsRename }) => ($needsRename ? docStatusColors.fix : gray[200])};
  background-color: ${colors.surface};
  font-size: 13px;
  color: ${gray[700]};
  transition: border-color 0.15s;

  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const DirtyWarning = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: ${radii.lg};
  background-color: ${colors.warningLight};
  color: ${colors.warning};
  font-size: 12px;
  line-height: 1.6;
`;

export const FieldHint = styled.span`
  font-size: 10px;
  font-weight: 400;
  color: ${docStatusColors.fix};
`;

export const LabelRow = styled.span`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const ReadOnlyValue = styled.span`
  padding: 6px 12px;
  border-radius: ${radii.lg};
  border: 1px solid ${gray[100]};
  background-color: ${gray[50]};
  font-size: 13px;
  color: ${gray[400]};
  text-align: right;
  cursor: default;
  user-select: none;
`;

export const ReadOnlyLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${gray[400]};
`;
