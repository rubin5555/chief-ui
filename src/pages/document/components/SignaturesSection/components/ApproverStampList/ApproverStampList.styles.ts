import styled from 'styled-components';

// Wraps, because a document can collect more approvers than fit across the sheet
// and a stamp must never be cut off by the paper's edge.
export const StampRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding: 8px 0;
`;
