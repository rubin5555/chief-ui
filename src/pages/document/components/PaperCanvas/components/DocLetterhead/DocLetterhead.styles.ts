import styled from 'styled-components';
import { docColors, gray, radii } from '@/styles/theme';

// `align-items: stretch` is what lets the divider run the full height of the
// block regardless of which side is taller (main, Edit.tsx:553).
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

/** Pushes the emblem and the fields to opposite edges of the letterhead. */
export const Spacer = styled.div`
  flex: 1;
`;

export const Divider = styled.div`
  flex-shrink: 0;
  width: 1px;
  margin-left: 24px;
  background-color: ${gray[200]};
`;

// A percentage rather than a fixed width: the letterhead spans the sheet, and at
// 55% the field rules stay long enough to write on when the page is zoomed out.
export const FieldColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 12px;
  width: 55%;
`;
