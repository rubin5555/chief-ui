import styled from 'styled-components';

// `flex-shrink: 0` because this trails a title that can be arbitrarily long: the
// controls keep their size and the title takes the squeeze.
export const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;
