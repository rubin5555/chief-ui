import styled from 'styled-components';
import { gray } from '@/styles/theme';

// Every section in the filter panel is titled the same way, so the heading
// sits at the level the sections share rather than inside whichever one was
// written first.
export const SectionTitle = styled.p`
  padding: 0 16px 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: ${gray[400]};
`;
