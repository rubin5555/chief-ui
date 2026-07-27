import styled from 'styled-components';
import { flexCenter, flexGap, navIconAction } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const ToolbarRoot = styled.div`
  ${flexGap(4)}
  margin-right: 4px;
`;

export const IconAction = styled.button`
  ${navIconAction}
`;

export const Divider = styled.span`
  width: 1px;
  height: 16px;
  background: ${gray[200]};
  margin: 0 2px;
`;

export const ZoomControlRoot = styled.div`
  display: flex;
  align-items: center;
`;

export const ZoomButton = styled.button`
  width: 24px;
  height: 24px;
  ${flexCenter}
  border-radius: ${radii.full};
  transition: background-color 0.15s;
  color: ${gray[600]};
  font-weight: 700;
  font-size: 16px;
  line-height: 1;
  user-select: none;
  &:hover { background-color: ${gray[100]}; }
`;

export const ZoomValue = styled.span`
  font-size: 12px;
  color: ${gray[600]};
  width: 40px;
  text-align: center;
  font-variant-numeric: tabular-nums;
`;

export const SearchField = styled.div`
  ${flexGap(6)}
  background: ${gray[100]};
  border-radius: ${radii.full};
  padding: 4px 12px;
`;

export const SearchFieldInput = styled.input`
  font-size: 12px;
  background: transparent;
  outline: none;
  width: 128px;
  text-align: right;
  color: ${gray[700]};
  &::placeholder { color: ${gray[400]}; }
`;

export const SearchCloseButton = styled.button`
  padding: 2px;
  border-radius: ${radii.full};
  transition: background-color 0.15s;
  ${flexCenter}
  &:hover { background-color: ${gray[200]}; }
`;

export const SpinningLoader = styled.span`
  display: inline-flex;
  animation: spin 1s linear infinite;
  color: ${colors.primary};
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
