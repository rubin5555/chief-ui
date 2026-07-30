import styled from 'styled-components';
import { colors, docColors, radii, transitions } from '@/styles/theme';

/**
 * A section inside a topic (main's Edit.tsx:4394) — half a topic's bottom gap.
 *
 * The search outline sits 2px out rather than the topic's 4px, so a matching
 * section inside a matching topic reads as nested instead of as one thick band.
 */
export const SectionRoot = styled.div<{ $highlighted: boolean; $revealed: boolean }>`
  margin-bottom: 5mm;
  border-radius: ${radii.lg};
  outline: ${({ $highlighted }) => ($highlighted ? `2px solid ${docColors.searchHit}` : 'none')};
  outline-offset: 2px;

  /* The mark left after the outline sends you here. A wash rather than an
     outline, so it can't be mistaken for a search hit, and it fades on its own
     — this says "here" for a moment and then stops saying anything. A transition
     rather than a keyframe: the colour is applied on arrival and removed a
     moment later, and a transition already describes both halves of that. */
  background-color: ${({ $revealed }) => ($revealed ? colors.primaryLight : 'transparent')};
  box-shadow: ${({ $revealed }) =>
    $revealed ? `0 0 0 6px ${colors.primaryLight}` : '0 0 0 6px transparent'};
  transition:
    background-color ${transitions.slow},
    box-shadow ${transitions.slow};

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
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

// The header's action cluster is NodeActionRow now — the same row main draws on
// every node — so there is no local wrapper for it here any more.
