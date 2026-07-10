import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const PickerCard = styled.div`
  margin: 0 12px 8px;
  border-radius: ${radii.xl};
  overflow: hidden;
  border: 1px solid ${gray[200]};
  background: ${colors.surface};
  box-shadow: ${shadows.sm};
`;

export const SearchSection = styled.div`
  padding: 10px 12px 8px;
`;

export const InstanceList = styled.div`
  overflow-y: auto;
  max-height: 118px;
  border-top: 1px solid ${gray[100]};
`;

export const InstanceRow = styled.button<{ $isChecked: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  font-size: 11px;
  transition: background ${transitions.fast};
  background: ${({ $isChecked }) => ($isChecked ? colors.primaryLight : 'transparent')};
  color: ${({ $isChecked }) => ($isChecked ? colors.primary : gray[600])};
  font-weight: ${({ $isChecked }) => ($isChecked ? 600 : 400)};
  border-bottom: 1px solid ${gray[50]};

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: ${({ $isChecked }) => ($isChecked ? colors.primaryLight : gray[50])};
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
  }
`;

export const CheckBox = styled.span<{ $isChecked: boolean }>`
  width: 16px;
  height: 16px;
  border-radius: 6px;
  flex-shrink: 0;
  border: 1.5px solid ${({ $isChecked }) => ($isChecked ? colors.primary : gray[300])};
  background: ${({ $isChecked }) => ($isChecked ? colors.primary : colors.surface)};
  display: flex;
  align-items: center;
  justify-content: center;
  transition:
    background ${transitions.fast},
    border-color ${transitions.fast};
  color: ${colors.surface};
`;

export const EmptyResults = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;

  p {
    font-size: 10px;
    color: ${gray[400]};
  }
`;

export const ConfirmSection = styled.div`
  padding: 8px 12px 10px;
  border-top: 1px solid ${gray[100]};
`;

export const ConfirmBtn = styled.button<{ $isEnabled: boolean }>`
  width: 100%;
  padding: 8px 0;
  border-radius: ${radii.xl};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.025em;
  transition: background ${transitions.fast};
  background: ${({ $isEnabled }) => ($isEnabled ? colors.primary : gray[100])};
  color: ${({ $isEnabled }) => ($isEnabled ? colors.surface : gray[400])};
  cursor: ${({ $isEnabled }) => ($isEnabled ? 'pointer' : 'default')};

  &:hover {
    ${({ $isEnabled }) =>
      $isEnabled && `background: color-mix(in srgb, ${colors.primary} 85%, black);`}
  }
`;
