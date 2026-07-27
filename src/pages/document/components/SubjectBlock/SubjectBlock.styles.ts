import styled from 'styled-components';
import { gray, radii } from '@/styles/theme';

/**
 * A topic block inside the paper (main's Edit.tsx:4219). The generous 10mm gap
 * below is what separates topics on a printed page — sections inside one topic
 * sit half that far apart.
 */
export const SubjectRoot = styled.section`
  margin-bottom: 10mm;
  border-radius: ${radii.lg};
`;

/**
 * The topic heading rule. Unlike the section and sub-section header rows, this
 * one carries an underline — it is the only level main gives a visible divider.
 */
export const SubjectHeaderRow = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 1.5mm;
  margin-bottom: 4mm;
  border-bottom: 1px solid ${gray[200]};
  direction: rtl;
`;
