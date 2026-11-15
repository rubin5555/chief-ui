import styled from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { catColors, colors, gray, radii, shadows, transitions } from '@/styles/theme';

// The `···` menu trigger only appears on hover, and it is a grandchild, so the
// reveal has to come from the card root.
export const CardRoot = styled.div`
  &:hover button[data-folder-menu] {
    opacity: 1;
  }
`;

export const CardRow = styled.div<{ $selected: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  height: 38px;
  padding: 0 8px;
  border-radius: ${radii.full};
  cursor: pointer;
  user-select: none;
  background: ${({ $selected }) => ($selected ? colors.primary : 'transparent')};
  transition: background ${transitions.normal};

  &:hover {
    background: ${({ $selected }) => ($selected ? colors.primary : catColors.hoverVeilStrong)};
  }
`;

export const FolderIcon = styled.span<{ $selected: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $selected }) => ($selected ? colors.surface : colors.primary)};
`;

// Always occupies its slot, even with no sub-folders, so names stay aligned
// down the column.
export const SubsToggle = styled.button<{
  $selected: boolean;
  $expanded: boolean;
  $shown: boolean;
}>`
  display: flex;
  flex-shrink: 0;
  visibility: ${({ $shown }) => ($shown ? 'visible' : 'hidden')};
  color: ${({ $selected }) => ($selected ? catColors.hoverVeilStrong : gray[400])};
  transform: rotate(${({ $expanded }) => ($expanded ? '-90deg' : '0deg')});
  transition: transform ${transitions.normal};

  &:hover {
    color: ${({ $selected }) => ($selected ? colors.surface : colors.primary)};
  }
`;

export const NameWrap = styled.div`
  display: flex;
  flex: 1;
  min-width: 0;
  align-items: baseline;
  gap: 6px;
`;

export const Name = styled.span<{ $selected: boolean }>`
  ${ellipsis}
  font-size: 14px;
  font-weight: 700;
  color: ${({ $selected }) => ($selected ? colors.surface : gray[800])};
`;

export const DocCount = styled.span<{ $selected: boolean }>`
  flex-shrink: 0;
  font-size: 11px;
  color: ${({ $selected }) => ($selected ? catColors.hoverVeilStrong : gray[400])};
`;

export const RenameInput = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  border-bottom: 2px solid ${colors.primary};
  background: transparent;
  font-size: 14px;
  font-weight: 700;
  color: ${gray[800]};
  outline: none;
`;

export const SubList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 4px;
  margin-right: 12px;
  padding-right: 8px;
  border-right: 2px solid ${gray[300]};
`;

export const SubRow = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: ${radii.full};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all ${transitions.slow};
  background: ${({ $active }) => ($active ? colors.surface : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};
  color: ${({ $active }) => ($active ? colors.primary : gray[700])};

  &:hover {
    background: ${({ $active }) => ($active ? colors.surface : catColors.hoverVeilStrong)};
  }
`;

export const SubIcon = styled.span`
  display: flex;
  flex-shrink: 0;
  color: ${colors.primary};
`;

export const SubName = styled.span`
  ${ellipsis}
`;
