import styled from 'styled-components';
import { gray } from '@/styles/theme';

// 9px and grey: the stamp is provenance, not a label — main sizes it below every
// other piece of text on the row so it reads as a footnote to the heading.
export const Stamp = styled.span`
  margin-inline-start: 6px;
  margin-inline-end: 2px;
  white-space: nowrap;
  font-size: 9px;
  color: ${gray[500]};
`;
