import styled from 'styled-components';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const SearchAnchor = styled.div`
  position: relative;
`;

export const SearchBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
  transition: border-color ${transitions.normal};

  &:focus-within {
    border-color: ${colors.primary};
  }
`;

export const SearchInput = styled.input`
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  text-align: right;
  color: ${gray[800]};
`;

export const ResultsPanel = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  top: 100%;
  z-index: 10;
  margin-top: 4px;
  overflow: hidden;
  border: 1px solid ${gray[100]};
  border-radius: ${radii.xl};
  background: ${colors.surface};
  box-shadow: ${shadows.lg};
`;

export const ResultRow = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  border-bottom: 1px solid ${gray[50]};
  transition: background ${transitions.normal};

  &:last-child {
    border-bottom: none;
  }
  &:hover {
    background: ${gray[50]};
  }
`;

export const AddIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${gray[300]};
`;
