import styled from 'styled-components';
import { flexColumn } from '@/styles/mixins';
import { colors, docColors, gray, radii, shadows } from '@/styles/theme';

export const SpecimenRoot = styled.section`
  ${flexColumn(10)}
  padding: 20px;
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: ${radii['2xl']};
  box-shadow: ${shadows.md};
`;

export const SpecimenTitle = styled.h2`
  font-size: 16px;
  font-weight: 700;
  color: ${gray[900]};
`;

export const SpecimenSource = styled.code`
  font-size: 12px;
  direction: ltr;
  text-align: right;
  color: ${gray[400]};
`;

export const SpecimenNote = styled.p`
  font-size: 13px;
  line-height: 1.8;
  color: ${gray[600]};
`;

// A neutral tray, so a component's own surface is visible against something that
// isn't the same white it is.
export const SpecimenStage = styled.div`
  padding: 16px;
  overflow-x: auto;
  background: ${docColors.surfaceSubtle};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
`;
