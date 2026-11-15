import styled from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, radii, shadows, transitions } from '@/styles/theme';

export const CatalogBody = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  overflow: hidden;
`;

export const ToolbarRow = styled.div`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
`;

// main draws the search field and the filter funnel as one white pill.
export const SearchPill = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: ${radii.full};
  background: ${colors.surface};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05);
`;

export const SearchFieldWrap = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  align-items: center;
`;

export const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  display: flex;
  color: ${gray[400]};
  pointer-events: none;
`;

export const SearchInput = styled.input`
  width: 100%;
  padding: 6px 36px 6px 12px;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  text-align: right;
  color: ${gray[800]};
`;

export const PillDivider = styled.div`
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background: ${gray[200]};
`;

export const RoundIconButton = styled.button`
  ${flexCenter}
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: ${radii.full};
  background: ${colors.surface};
  color: ${gray[500]};
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.07), 0 0 0 1px rgba(0, 0, 0, 0.05);
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[100]};
  }
`;

export const ChipsRow = styled.div`
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

// The card clips the header bar's corners, which is why the bar itself needs no
// radius of its own.
export const TableCard = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  overflow: hidden;
  border-radius: ${radii['2xl']};
  background: ${colors.surface};
  box-shadow: ${shadows.card};

  /* The per-row action buttons only appear under the pointer. The hook is the
     virtualiser's own \`data-index\` wrapper, since a row's markup comes from
     GridTable and takes no attributes of its own. */
  [data-index]:hover [data-row-actions] {
    opacity: 1;
  }
`;

export const NoDocs = styled.div`
  ${flexCenter}
  flex: 1;
  padding: 32px 0;
  font-size: 14px;
  color: ${gray[400]};
`;
