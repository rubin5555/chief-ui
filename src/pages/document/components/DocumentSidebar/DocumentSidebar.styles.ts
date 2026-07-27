import styled from 'styled-components';
import { colors, gray } from '@/styles/theme';
import { SIDEBAR_WIDTH } from '../../document.measurements';

// main's outline sidebar (Edit.tsx:3793). It is the first child of the body row
// and the page is `dir="rtl"`, so it lands on the right without any ordering
// property — do not "fix" that with an explicit order/float.
export const SidebarRoot = styled.aside`
  display: flex;
  flex-direction: column;
  width: ${SIDEBAR_WIDTH}px;
  flex-shrink: 0;
  padding: 20px 16px;
  position: relative;
  z-index: 1;

  // A 1px rule inset 24px from top and bottom, so it reads as a column
  // separator rather than a full-height border. Physical "left" rather than
  // inline-start is deliberate: the divider belongs on the side facing the
  // paper, which in this RTL page is the left edge.
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    bottom: 24px;
    width: 1px;
    background: ${colors.border};
  }
`;

// Status line and progress bars are one block in main, with the 8px gap between
// them coming from the header and 16px below the pair (Edit.tsx:3796).
export const StatusBlock = styled.div`
  margin-bottom: 16px;
`;

/** Separates the document's own controls from its contents. */
export const SidebarDivider = styled.div`
  height: 1px;
  margin-bottom: 16px;
  background-color: ${gray[200]};
`;
