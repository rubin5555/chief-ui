import styled from 'styled-components';
import { colors } from '@/styles/theme';

export const SectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35em;
  margin-bottom: 5px;
  direction: rtl;
`;

export const SectionNumber = styled.span`
  flex-shrink: 0;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
  color: ${colors.primary};
`;

export const TitleSlot = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  direction: rtl;
`;
