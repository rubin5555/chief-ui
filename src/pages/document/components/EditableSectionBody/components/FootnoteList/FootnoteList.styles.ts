import styled from 'styled-components';
import { gray } from '@/styles/theme';

export const ListRoot = styled.div`
  margin-top: 6px;
  padding: 0 14px 4px;
`;

// A third of the width, not the whole of it: the short rule above footnotes is a
// print convention, and a full-width line would read as a section divider.
export const FootnoteRule = styled.div`
  width: 33%;
  height: 1px;
  margin-bottom: 6px;
  background-color: ${gray[400]};
`;
