import styled from 'styled-components';
import { colors, gray, radii, transitions } from '@/styles/theme';

/**
 * A sub-section (main's Edit.tsx:4638). Indented from its parent section by
 * `padding-inline-end` — the page is RTL, so the indent belongs on the right.
 * Spacing is in px, not mm: sub-sections are a list within one section rather
 * than page-level structure.
 */
export const SubSectionRoot = styled.div<{ $revealed: boolean }>`
  margin-bottom: 5px;
  padding-inline-end: 14px;
  border-radius: ${radii.lg};

  /* The same landing mark a section gets, at a sub-section's smaller bleed —
     see SectionBlock.styles.ts for why it is a wash and not an outline. */
  background-color: ${({ $revealed }) => ($revealed ? colors.primaryLight : 'transparent')};
  box-shadow: ${({ $revealed }) =>
    $revealed ? `0 0 0 4px ${colors.primaryLight}` : '0 0 0 4px transparent'};
  transition:
    background-color ${transitions.slow},
    box-shadow ${transitions.slow};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const SubSectionHeaderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.3em;
  margin-bottom: 4px;
  direction: rtl;
`;

/** The Hebrew letter marker — `א.`, `ב.`, … */
export const SubSectionMarker = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  line-height: 1.5;
  color: ${gray[500]};
`;

// The header's action cluster is NodeActionRow now — the same row main draws on
// every node — so there is no local wrapper for it here any more.
