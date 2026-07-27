import styled from 'styled-components';
import { colors, radii } from '@/styles/theme';

/** A section inside a topic (main's Edit.tsx:4394) — half a topic's bottom gap. */
export const SectionRoot = styled.div`
  margin-bottom: 5mm;
  border-radius: ${radii.lg};
`;

/**
 * No underline at this level, and a much tighter gap than the topic row. The
 * `0.35em` is main's, and being em-based it tracks the row's font size.
 */
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

/** Holds the title field and lets it size itself, keeping the row's tail free. */
export const TitleSlot = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  direction: rtl;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
`;
