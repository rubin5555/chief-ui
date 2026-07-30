import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';

/**
 * A single non-wrapping row: main lets the ribbon run past the paper's edge
 * rather than reflow, because a toolbar that changes height moves everything
 * below it every time the window is resized (Edit.tsx:1209-1219).
 *
 * `$flush` is the ribbon drawn inside a field's own frame rather than as the
 * page's toolbar. The frame already draws the outer edge and casts the lift, so
 * repeating either puts a second line 1px inside the first.
 */
export const ToolbarRoot = styled.div<{ $flush: boolean }>`
  display: flex;
  align-items: center;
  gap: 1px;
  padding: 4px 8px;
  background: ${({ $flush }) => ($flush ? gray[50] : colors.surface)};
  border-top: ${({ $flush }) => ($flush ? 'none' : `1px solid ${gray[200]}`)};
  border-bottom: 1px solid ${({ $flush }) => ($flush ? gray[100] : gray[200])};
  box-shadow: ${({ $flush }) => ($flush ? 'none' : '0 2px 6px rgba(0, 0, 0, 0.06)')};
  direction: rtl;
  flex-wrap: nowrap;
  overflow: visible;
`;

export const ToolbarSeparator = styled.span`
  width: 1px;
  height: 18px;
  margin: 0 4px;
  flex-shrink: 0;
  background: ${gray[300]};
`;

export const ToolbarGroup = styled.div`
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

// "AB¹" drawn in type rather than an icon, because no icon set has a footnote
// marker and main draws it the same way (Edit.tsx:1386).
export const FootnoteGlyph = styled.span`
  display: inline-flex;
  align-items: flex-end;
  font-size: 9px;
  font-weight: 700;
  line-height: 1;

  sup {
    font-size: 6px;
    font-weight: 600;
    line-height: 1;
  }
`;
