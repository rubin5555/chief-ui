import styled from 'styled-components';
import { flexScroll, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';
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

/** The tree scrolls; the action row below it stays put. */
export const TreeScroll = styled.div`
  ${flexScroll}
`;

export const ActionsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid ${gray[200]};
`;

export const ActionBtn = styled.button`
  ${resetButton}
  padding: 6px 10px;
  border-radius: ${radii.lg};
  font-size: 12px;
  color: ${gray[600]};
  text-align: right;
  transition: background-color ${transitions.fast};

  &:hover {
    background-color: ${gray[50]};
  }
`;
