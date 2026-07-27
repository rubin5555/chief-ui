import styled from 'styled-components';
import { flexScroll } from '@/styles/mixins';

// The tree is the one part of the sidebar that scrolls: the status block above it
// and the button row below it stay put while the outline grows.
export const TreeRoot = styled.nav`
  ${flexScroll}
  display: flex;
  flex-direction: column;
  padding-bottom: 4px;
`;

export const SubjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;
