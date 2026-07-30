import styled from 'styled-components';
import { ellipsis, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const VersionList = styled.div`
  display: flex;
  flex-direction: column;
`;

export const VersionRow = styled.button`
  ${resetButton}
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 20px;
  text-align: right;
  border-bottom: 1px solid ${gray[50]};
  transition: background-color ${transitions.normal};

  &:last-of-type {
    border-bottom: none;
  }

  &:hover {
    background-color: ${gray[50]};
  }
`;

export const VersionMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
`;

export const VersionLabel = styled.span`
  ${ellipsis}
  font-size: 13px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const VersionMeta = styled.span`
  ${ellipsis}
  font-size: 11px;
  color: ${gray[500]};
`;

export const CurrentTag = styled.span`
  flex-shrink: 0;
  padding: 2px 8px;
  border-radius: ${radii.full};
  background-color: ${colors.primaryLight};
  font-size: 10px;
  font-weight: 600;
  color: ${colors.primary};
`;
