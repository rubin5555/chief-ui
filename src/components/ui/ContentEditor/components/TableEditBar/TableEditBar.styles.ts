import styled from 'styled-components';
import { flexCenter, resetButton } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

/**
 * main's row/column strip (Edit.tsx:984-1073), which hangs under the table it
 * acts on.
 *
 * `position: fixed` and portalled onto the body, because the table it points at
 * lives inside the paper's `zoom` — an absolutely-positioned bar written next to
 * it would be laid out in zoomed pixels while its measurements are in real ones.
 * FloatingPanel is portalled for the same reason and explains it at length.
 */
export const BarRoot = styled.div`
  position: fixed;
  z-index: 9990;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 1px;
  padding: 2px 6px;
  direction: rtl;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii.lg};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
`;

// A CSS triangle pointing back at the table, so the strip reads as belonging to
// it rather than floating over the page (main, Edit.tsx:1007).
export const BarArrow = styled.span`
  position: absolute;
  top: -6px;
  right: 16px;
  width: 10px;
  height: 6px;
  overflow: hidden;

  &::after {
    content: '';
    display: block;
    width: 10px;
    height: 10px;
    margin-top: 3px;
    background: ${colors.surface};
    border: 1px solid ${gray[200]};
    transform: rotate(45deg);
    transform-origin: bottom left;
  }
`;

export const BarAction = styled.button<{ $danger?: boolean }>`
  ${resetButton}
  ${flexCenter}
  width: 26px;
  height: 26px;
  padding: 0;
  flex-shrink: 0;
  border-radius: ${radii.sm};
  color: ${({ $danger }) => ($danger ? colors.danger : gray[600])};
  transition: background ${transitions.normal}, color ${transitions.normal};

  &:hover:not(:disabled) {
    background: ${({ $danger }) => ($danger ? colors.dangerLight : gray[100])};
  }

  &:disabled {
    color: ${gray[300]};
    cursor: not-allowed;
  }
`;

export const BarDivider = styled.span`
  width: 1px;
  height: 16px;
  margin: 0 2px;
  flex-shrink: 0;
  background: ${gray[200]};
`;
