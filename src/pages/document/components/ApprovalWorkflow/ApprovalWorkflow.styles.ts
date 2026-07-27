import styled from 'styled-components';

// Sits where StatusFlowNav's buttons would be. A distributed document has no
// status moves left, so the two never appear together — hence the same bottom gap
// to the divider below that the flow buttons carry.
export const AcceptanceRow = styled.div`
  display: flex;
  margin-bottom: 20px;
`;
