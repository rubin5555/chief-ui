import styled from 'styled-components';
import { flexGap } from '@/styles/mixins';
import { colors, gray, radii } from '@/styles/theme';

export const PickerCard = styled.div`
  position: fixed;
  z-index: 99999;
  width: 272px;
  padding: 14px;
  direction: rtl;
  background: ${colors.surface};
  border: 1px solid ${gray[200]};
  border-radius: ${radii['2xl']};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
`;

export const SliderRow = styled.div`
  ${flexGap(10)}
  margin-bottom: 12px;
  /* The hue ramp runs red→red left-to-right in every colour picker ever built,
     so this row opts out of the page's RTL. */
  direction: ltr;
`;

export const PreviewDot = styled.span<{ $color: string }>`
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: ${radii.full};
  border: 1.5px solid ${gray[200]};
  background: ${({ $color }) => $color};
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: 8px;

  /* main's two footer buttons split the width evenly (Edit.tsx:736-743); ui/Button
     sizes to its label, so the split is asked for here rather than by a prop no
     other consumer of Button wants. */
  > button {
    flex: 1;
    justify-content: center;
  }
`;
