import styled from 'styled-components';
import { colors, docColors, gray, radii } from '@/styles/theme';

// Amber card rather than the sheet's white: these are notes *about* writing the
// document, not part of it, and the tint is what says so (main, Edit.tsx:4158).
export const EmphasisRoot = styled.div`
  padding: 14px 16px;
  margin-bottom: 8mm;
  border: 1px solid ${docColors.amberBorder};
  border-radius: ${radii.xl};
  background-color: ${colors.warningLight};
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-bottom: 10px;
`;

export const HeaderIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${docColors.amberIcon};
`;

export const HeaderTitle = styled.span`
  flex: 1;
  font-size: 12px;
  font-weight: 700;
  color: ${docColors.amberInk};
`;

// Grows with its content instead of scrolling: the card is part of the page, and
// a scrollbar inside a printed sheet would hide half of what was written.
export const EmphasisTextarea = styled.textarea`
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  resize: none;
  overflow: hidden;
  font-family: inherit;
  font-size: 11px;
  line-height: 1.7;
  color: ${gray[700]};
  text-align: right;

  &::placeholder {
    color: ${docColors.amberBorder};
  }
`;
