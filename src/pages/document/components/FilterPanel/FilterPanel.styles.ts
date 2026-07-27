import styled from 'styled-components';
import { flexBetween, flexCenter, flexGap, navIconAction } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// The trigger renders into the navbar's document-actions toolbar, so it has to be
// indistinguishable from the buttons beside it — hence the shared mixin rather than
// a local approximation. It's a plain styled.button (not `ui/IconButton`) because
// useFloatingPanel needs the ref, and because main's filter icon has no
// active/selected state: what's filtered is shown by the chips over the paper.
export const FilterTrigger = styled.button`
  ${navIconAction}
`;

export const PanelHeader = styled.div`
  ${flexBetween}
  padding: 16px 16px 12px;
  border-bottom: 1px solid ${gray[100]};
`;

export const PanelTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${gray[800]};
`;

export const CloseButton = styled.button`
  ${flexCenter}
  padding: 4px;
  border-radius: ${radii.lg};
  color: ${gray[400]};
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${gray[100]};
  }
`;

export const OptionList = styled.div`
  padding: 8px 0;
`;

export const OptionRow = styled.button`
  ${flexGap(12)}
  width: 100%;
  padding: 10px 16px;
  text-align: right;
  transition: background-color ${transitions.normal};

  &:hover {
    background-color: ${gray[50]};
  }
`;

// Unchecked is a 2px outline, checked a filled navy square — the box changes weight
// and not just colour, so it stays distinguishable from the status dot beside it.
export const CheckBox = styled.span<{ $checked: boolean }>`
  ${flexCenter}
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  border-radius: ${radii.md};
  color: ${colors.surface};
  transition: background-color ${transitions.normal};
  background-color: ${({ $checked }) => ($checked ? colors.primary : colors.surface)};
  border: ${({ $checked }) => ($checked ? 'none' : `2px solid ${gray[300]}`)};
`;

export const StatusDot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background-color: ${({ $color }) => $color};
`;

export const OptionLabel = styled.span`
  font-size: 14px;
  color: ${gray[700]};
`;

export const FooterRow = styled.div`
  ${flexGap(8)}
  padding: 8px 16px 16px;
  border-top: 1px solid ${gray[100]};
`;

export const ApplyButton = styled.button<{ $hasFilters: boolean }>`
  flex: 1;
  padding: 6px 0;
  border-radius: ${radii.full};
  font-size: 14px;
  font-weight: 600;
  transition:
    background-color ${transitions.slow},
    color ${transitions.slow};
  background-color: ${({ $hasFilters }) => ($hasFilters ? colors.primary : gray[200])};
  color: ${({ $hasFilters }) => ($hasFilters ? colors.surface : gray[400])};
`;

export const ClearButton = styled.button`
  padding: 0 4px;
  font-size: 12px;
  color: ${gray[400]};
  transition: color ${transitions.normal};

  &:hover {
    color: ${gray[600]};
  }
`;
