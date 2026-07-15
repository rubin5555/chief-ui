import styled from 'styled-components';
import { ellipsis, flexBetween, flexGap } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const ParamsBody = styled.div`
  padding: 0 12px 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${colors.surface};
`;

export const NameField = styled.div`
  position: relative;
  padding-top: 8px;
`;

export const NameDropdown = styled.div`
  position: absolute;
  top: 100%;
  margin-top: 2px;
  left: 0;
  right: 0;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  box-shadow: ${shadows.md};
  z-index: 50;
  overflow: hidden;
`;

export const NameDropdownScroll = styled.div`
  max-height: 120px;
  overflow-y: auto;
`;

export const NameOption = styled.button<{ $isSelected: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-size: 11px;
  transition: background ${transitions.fast};
  background: ${({ $isSelected }) => ($isSelected ? colors.primaryLight : 'transparent')};
  color: ${({ $isSelected }) => ($isSelected ? colors.primary : gray[700])};
  font-weight: ${({ $isSelected }) => ($isSelected ? 600 : 400)};
  border-bottom: 1px solid ${gray[50]};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${({ $isSelected }) => ($isSelected ? colors.primaryLight : gray[50])};
  }

  span {
    ${ellipsis}
  }
`;

export const NoResults = styled.div`
  padding: 12px 0;
  text-align: center;
  font-size: 10px;
  color: ${gray[400]};
`;

export const SelectedName = styled.div`
  margin-top: 6px;
  ${flexBetween}
  padding: 6px 10px;
  background: ${colors.primaryLight};
  border-radius: ${radii.lg};

  span {
    font-size: 11px;
    font-weight: 600;
    color: ${colors.primary};
    ${ellipsis}
  }
`;

export const ClearNameBtn = styled.button`
  color: color-mix(in srgb, ${colors.primary} 40%, transparent);
  transition: color ${transitions.fast};
  margin-left: 4px;
  flex-shrink: 0;
  display: inline-flex;

  &:hover {
    color: ${colors.primary};
  }
`;

export const ParamLabel = styled.p`
  font-size: 10px;
  font-weight: 700;
  color: ${gray[500]};
  margin-bottom: 4px;
`;

export const QuantityRow = styled.div`
  ${flexGap(8)}

  ${ParamLabel} {
    margin-bottom: 0;
    flex-shrink: 0;
  }
`;

export const QuantityInput = styled.input`
  flex: 1;
  padding: 4px 8px;
  font-size: 12px;
  border-radius: ${radii.lg};
  border: 1px solid ${gray[200]};
  background: ${colors.surface};
  color: ${gray[700]};
  text-align: center;

  &:focus {
    outline: none;
    border-color: color-mix(in srgb, ${colors.primary} 50%, transparent);
    box-shadow: 0 0 0 1px color-mix(in srgb, ${colors.primary} 15%, transparent);
  }

  &::placeholder {
    color: ${gray[300]};
  }
`;

export const ToggleRow = styled.div`
  ${flexBetween}
  padding: 2px 0;

  ${ParamLabel} {
    margin-bottom: 0;
  }
`;
