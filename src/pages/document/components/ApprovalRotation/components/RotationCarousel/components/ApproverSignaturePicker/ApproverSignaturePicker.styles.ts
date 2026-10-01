import styled from 'styled-components';
import { colors, gray, radii } from '@/styles/theme';

export const SignatureSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SignatureLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: ${gray[600]};
`;

export const SignatureBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 70px;
  border-radius: ${radii.lg};
  background-color: ${gray[50]};
  color: ${gray[400]};
  font-size: 13px;
  font-weight: 600;
`;

export const SignatureActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
`;

export const SignatureActionBtn = styled.button`
  border: none;
  background: none;
  font-size: 11px;
  color: ${gray[500]};
  cursor: pointer;

  &:hover {
    color: ${colors.primary};
  }
`;
