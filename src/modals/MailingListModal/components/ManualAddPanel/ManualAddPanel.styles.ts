import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

// Shared styles for floating popover panels (add member, create group, manual entry, etc.)
export const PopoverHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px 8px;
  flex-shrink: 0;
`;

export const PopoverTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${gray[800]};
  margin: 0;
`;

export const PopoverCloseBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: ${radii.lg};
  display: flex;
  align-items: center;
`;

export const PopoverBodySection = styled.div<{ $pad?: string }>`
  padding: ${({ $pad }) => $pad ?? '0 12px 12px'};
  flex-shrink: 0;
`;

export const PopoverForm = styled.form`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PopoverLabel = styled.label`
  display: block;
  font-size: 11px;
  font-weight: 600;
  color: ${gray[500]};
  margin-bottom: 4px;
`;

export const PopoverInput = styled.input`
  width: 100%;
  padding: 6px 12px;
  font-size: 12px;
  border: 1px solid ${gray[200]};
  border-radius: 8px;
  background: ${gray[50]};
  text-align: right;
  direction: rtl;
  outline: none;
  box-sizing: border-box;
  &:focus { border-color: ${colors.primary}; }
`;

export const PopoverSaveBtn = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  background: ${colors.primary};
  color: ${colors.surface};
  font-size: 12px;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  &:hover { background: color-mix(in srgb, ${colors.primary} 80%, black); }
  &:disabled { background: ${gray[200]}; color: ${gray[400]}; cursor: not-allowed; }
`;

export const PopoverPickedRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  border-bottom: 1px solid ${gray[50]};
  direction: ltr;
`;

export const PickedList = styled.div`
  flex: 1;
  overflow-y: auto;
  border-top: 1px solid ${gray[100]};
`;

export const PickedListLabel = styled.p`
  margin: 0;
  padding: 6px 12px;
  font-size: 10px;
  font-weight: 600;
  color: ${gray[400]};
  background: ${gray[100]};
`;

export const PickedMemberName = styled.span`
  flex: 1;
  font-size: 11px;
  font-weight: 500;
  color: ${gray[800]};
  text-align: right;
`;

export const PickedRemoveBtn = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 2px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;
