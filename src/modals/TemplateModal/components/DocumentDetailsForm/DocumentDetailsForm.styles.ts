import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const DetailsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 24px;
`;

export const FieldGroup = styled.div<{ $grow?: boolean }>`
  display: flex;
  flex-direction: column;
  ${(p) => p.$grow && 'flex: 1;'}
`;

export const FieldLabel = styled.label`
  font-size: 12px;
  font-weight: 500;
  color: ${gray[500]};
  margin-bottom: 3px;
  text-align: right;
`;

export const FieldRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const NameInput = styled.input<{ $warn?: boolean }>`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid ${({ $warn }) => ($warn ? colors.dangerLight : gray[200])};
  background: ${({ $warn }) => ($warn ? colors.dangerLight : colors.surface)};
  border-radius: ${radii.xl};
  font-size: 14px;
  text-align: right;
  direction: rtl;
  box-sizing: border-box;
  transition: border-color ${transitions.fast};
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;

export const WarnText = styled.p`
  font-size: 11px;
  color: ${colors.danger};
  margin: 4px 0 0;
  text-align: right;
`;

export const ApprovalRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 12px;
  height: 34px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
`;

export const ApprovalLabel = styled.span`
  font-size: 12px;
  color: ${gray[600]};
`;
