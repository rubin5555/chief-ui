import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const SectionSearch = styled.div`
  position: relative;
  margin: 0 12px 6px;
`;

export const SectionSearchIcon = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  color: ${gray[300]};
  pointer-events: none;
`;

export const SectionSearchInput = styled.input`
  width: 100%;
  padding: 4px 28px 4px 8px;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.md};
  background: ${gray[50]};
  font-size: 12px;
  text-align: right;
  color: ${gray[700]};
  outline: none;

  &:focus {
    border-color: ${gray[200]};
  }
`;

export const OptionList = styled.div<{ $tall: boolean }>`
  max-height: ${({ $tall }) => ($tall ? '144px' : '112px')};
  overflow-y: auto;
`;

export const OptionRow = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 16px;
  cursor: pointer;
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const OptionCheckbox = styled.input`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  border-radius: ${radii.sm};
  accent-color: ${colors.primary};
`;

export const OptionLabel = styled.span<{ $checked: boolean }>`
  flex: 1;
  text-align: right;
  font-size: 14px;
  font-weight: ${({ $checked }) => ($checked ? 600 : 400)};
  color: ${({ $checked }) => ($checked ? colors.primary : gray[700])};
`;

export const NoOptions = styled.p`
  padding: 6px 16px;
  text-align: right;
  font-size: 12px;
  color: ${gray[300]};
`;
