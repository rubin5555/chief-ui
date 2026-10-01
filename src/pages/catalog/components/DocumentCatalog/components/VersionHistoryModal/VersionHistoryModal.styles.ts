import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { catColors, colors, gray, radii, transitions } from '@/styles/theme';

export const HistoryTable = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 240px;
  overflow: hidden;

  /* Same hover reveal the catalog table uses — the virtualiser's row wrapper is
     the only element that spans a whole row. */
  [data-row-actions] {
    opacity: 0;
  }
  [data-index]:hover [data-row-actions] {
    opacity: 1;
  }
`;

export const NoVersions = styled.div`
  ${flexCenter}
  flex: 1;
  padding: 40px 0;
  font-size: 14px;
  color: ${gray[400]};
`;

export const ViewBtnCell = styled.span`
  ${flexCenter}
  width: 100%;
`;

export const ViewBtn = styled.button`
  padding: 4px 12px;
  border-radius: ${radii.lg};
  font-size: 12px;
  font-weight: 500;
  color: ${colors.primary};
  background: ${colors.primaryLight};
  transition: opacity ${transitions.normal};
`;

export const FilterBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${radii.full};
  font-size: 12px;
  font-weight: 500;
  transition: all ${transitions.normal};
  background: ${({ $active }) => ($active ? colors.primaryLight : gray[50])};
  color: ${({ $active }) => ($active ? colors.primary : gray[500])};
  border: 1px solid
    ${({ $active }) => ($active ? catColors.primarySoftBorder : gray[200])};

  &:hover {
    border-color: ${({ $active }) => ($active ? catColors.primarySoftBorder : gray[300])};
  }
`;

export const FilterClear = styled.span`
  display: flex;
  transition: opacity ${transitions.normal};

  &:hover {
    opacity: 0.7;
  }
`;
