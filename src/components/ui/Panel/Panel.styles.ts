import styled from 'styled-components';
import { radii } from '@/styles/theme';
import { PANEL_IDS } from './Panel.testids';

export const PanelRoot = styled.div.attrs<{ 'data-testid'?: string }>((props) => ({
  'data-testid': props['data-testid'] ?? PANEL_IDS.root,
}))`
	display: flex;
	flex-direction: column;
	border-radius: ${radii['3xl']};
	gap: 16px;
`;

export const PanelToolbar = styled.div.attrs<{ 'data-testid'?: string }>((props) => ({
  'data-testid': props['data-testid'] ?? PANEL_IDS.toolbar,
}))`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const FilterChipRow = styled.div`
	direction: rtl;
`;
