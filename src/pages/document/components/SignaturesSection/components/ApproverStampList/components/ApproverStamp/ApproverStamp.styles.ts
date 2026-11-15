import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const StampRoot = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

export const StampArea = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100px;
  height: 100px;
`;

export const StampRing = styled.svg`
  position: absolute;
  opacity: 0.6;
`;

export const StampMark = styled.svg`
  position: relative;
  z-index: 1;
`;

export const StampCaption = styled.span`
  font-size: 10px;
  color: ${gray[500]};
`;
