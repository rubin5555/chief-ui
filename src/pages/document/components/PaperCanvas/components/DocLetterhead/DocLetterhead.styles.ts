import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';

export const LetterheadRoot = styled.div`
  display: flex;
  align-items: stretch;
  padding: 22px 24px;
  margin-bottom: 8mm;
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  background-color: ${docColors.letterheadBg};
`;

export const LogoBox = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 140px;
`;

export const Logo = styled.img`
  width: 130px;
  height: 130px;
  object-fit: contain;
`;

export const Spacer = styled.div`
  flex: 1;
`;

export const Divider = styled.div`
  flex-shrink: 0;
  width: 1px;
  margin-left: 24px;
  background-color: ${gray[200]};
`;

export const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  width: 55%;
`;
