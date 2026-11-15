import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, docStatusColors, gray, radii } from '@/styles/theme';

// main tints a confirmed row with the palest of its two greens and the tick's
// disc with the stronger one, which are the `הסתיימה` and `מבצעית` pill
// backgrounds. Read straight off the custom properties rather than through the
// status map, because these are not statuses — they are a read receipt.
const SEEN_ROW_BG = 'var(--cat-status-finished-bg)';
const SEEN_ICON_BG = 'var(--cat-status-active-bg)';

export const SeenCount = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.primary};
`;

export const ReceiptList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const ReceiptRow = styled.div<{ $seen: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px;
  border-radius: ${radii.xl};
  background: ${({ $seen }) => ($seen ? SEEN_ROW_BG : gray[50])};
`;

export const ReceiptIcon = styled.div<{ $seen: boolean }>`
  ${flexCenter}
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  margin-top: 2px;
  border-radius: ${radii.full};
  background: ${({ $seen }) => ($seen ? SEEN_ICON_BG : gray[200])};
  color: ${docStatusColors.approved};
`;

export const ReceiptDot = styled.span`
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background: ${gray[400]};
`;

export const ReceiptName = styled.span<{ $seen: boolean }>`
  font-size: 14px;
  font-weight: 500;
  color: ${({ $seen }) => ($seen ? gray[900] : gray[400])};
`;

export const ReceiptDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin-top: 2px;
`;

export const ReceiptDetail = styled.span`
  font-size: 12px;
  color: ${gray[400]};
`;

/* Separated from the timestamps by a hairline, as main draws it. */
export const ReceiptNote = styled.span`
  font-size: 12px;
  color: ${gray[500]};
  padding-right: 8px;
  border-right: 1px solid ${gray[300]};
`;
