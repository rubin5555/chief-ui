import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { gray, radii, transitions } from '@/styles/theme';

export const SwatchGroup = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// Icon over a colour bar — Word's convention, and main's (Edit.tsx:1229-1234).
// Pressing the face applies the colour it shows; the chevron beside it chooses a
// different one.
export const SwatchFace = styled.button`
  ${resetButton}
  ${flexCenter}
  flex-direction: column;
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  color: ${gray[700]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;

export const SwatchLetter = styled.span<{ $color: string }>`
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  color: ${({ $color }) => $color};
`;

export const SwatchBar = styled.span<{ $color: string; $outlined: boolean }>`
  width: 14px;
  height: 3px;
  margin-top: 1px;
  border-radius: 1px;
  background: ${({ $color }) => $color};
  border: ${({ $outlined }) => ($outlined ? `1px solid ${gray[300]}` : 'none')};
`;

export const ChevronButton = styled.button`
  ${resetButton}
  ${flexCenter}
  width: 14px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  color: ${gray[500]};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;
