import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

export const SearchWrap = styled.div`
  position: relative;
`;

export const SearchIconSlot = styled.span`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: inline-flex;
  color: ${gray[400]};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 6px 32px 6px 12px;
  font-size: 11px;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  color: ${gray[700]};
  transition: border-color ${transitions.fast};

  &:focus {
    outline: none;
    border-color: color-mix(in srgb, ${colors.primary} 50%, transparent);
    box-shadow: 0 0 0 1px color-mix(in srgb, ${colors.primary} 15%, transparent);
  }

  &::placeholder {
    color: ${gray[300]};
  }
`;
