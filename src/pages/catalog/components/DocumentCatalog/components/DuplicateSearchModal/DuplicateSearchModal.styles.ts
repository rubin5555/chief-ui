import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const SearchField = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid ${gray[100]};
`;

export const SearchFieldWrap = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

export const SearchFieldIcon = styled.span`
  position: absolute;
  right: 12px;
  display: flex;
  color: ${gray[400]};
  pointer-events: none;
`;

export const SearchFieldInput = styled.input`
  width: 100%;
  padding: 10px 40px 10px 12px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  font-size: 14px;
  text-align: right;
  color: ${gray[800]};
  outline: none;

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const ResultList = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`;

export const ResultRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border-radius: ${radii.xl};
  text-align: right;
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;

export const ResultText = styled.div`
  flex: 1;
  min-width: 0;
`;

export const ResultName = styled.p`
  ${ellipsis}
  font-size: 14px;
  font-weight: 500;
  color: ${gray[800]};
`;

export const ResultMeta = styled.p`
  ${ellipsis}
  margin-top: 2px;
  font-size: 12px;
  color: ${gray[400]};
`;

export const StatusBadge = styled.span<{ $bg: string; $ink: string }>`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  padding: 3px 10px;
  border-radius: ${radii.full};
  white-space: nowrap;
  font-size: 12px;
  font-weight: 500;
  background: ${({ $bg }) => $bg};
  color: ${({ $ink }) => $ink};
`;

export const StatusBadgeDot = styled.span<{ $ink: string }>`
  flex-shrink: 0;
  width: 6px;
  height: 6px;
  border-radius: ${radii.full};
  background: ${({ $ink }) => $ink};
`;

export const NoResults = styled.div`
  padding: 40px 0;
  text-align: center;
  font-size: 14px;
  color: ${gray[400]};
`;
