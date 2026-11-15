import styled from 'styled-components';

/* Three across, so the six identity fields land as two tidy rows and the
   classification tag slots in beside the level it belongs to. */
export const IdentityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
`;
