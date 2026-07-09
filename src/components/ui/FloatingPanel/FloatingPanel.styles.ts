import styled from 'styled-components';
import { colors, shadows } from '@/styles/theme';
import { FLOATING_PANEL_IDS } from './FloatingPanel.testids';

export const FloatingPanel = styled.div.attrs<{ 'data-testid'?: string }>((props) => ({
  'data-testid': props['data-testid'] ?? FLOATING_PANEL_IDS.root,
}))`
  position: fixed;
  background: ${colors.surface};
  border-radius: 16px;
  box-shadow: ${shadows.xl};
  border: 1px solid ${colors.border};
  z-index: 99999;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;
