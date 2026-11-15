import styled, { css } from 'styled-components';
import { ellipsis } from '@/styles/mixins';
import { catColors, colors, gray, radii, shadows, transitions } from '@/styles/theme';

// The 1px rule down the sidebar's outer edge. main draws it as a `before:`
// pseudo-element inset 24px top and bottom so it stops short of the corners.
export const Aside = styled.aside`
  position: relative;
  z-index: 10;
  flex-shrink: 0;
  width: 256px;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 24px;
    bottom: 24px;
    width: 1px;
    background: ${colors.border};
  }
`;

export const AsideScroll = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding: 24px 16px;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${gray[300]};
    border-radius: ${radii.full};
  }
`;

export const rowBase = css`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: ${radii.full};
  cursor: pointer;
  text-align: right;
  transition: all ${transitions.normal};
`;

export const SectionButton = styled.button<{ $active: boolean }>`
  ${rowBase}
  gap: 12px;
  padding: 6px 16px;
  background: ${({ $active }) => ($active ? colors.primary : 'transparent')};
  color: ${({ $active }) => ($active ? colors.surface : gray[700])};

  &:hover {
    background: ${({ $active }) => ($active ? colors.primary : catColors.hoverVeil)};
  }
`;

export const SectionLabel = styled.span`
  flex: 1;
  text-align: right;
`;

export const SectionChevron = styled.span<{ $expanded: boolean; $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $active }) => ($active ? colors.surface : gray[400])};
  transform: rotate(${({ $expanded }) => ($expanded ? '-90deg' : '0deg')});
  transition: transform ${transitions.normal};
`;

export const SubList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  margin-top: 4px;
  margin-right: 16px;
  padding: 0 8px;
`;

export const SubItem = styled.div<{ $active: boolean }>`
  ${rowBase}
  gap: 8px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: ${({ $active }) => ($active ? 600 : 400)};
  background: ${({ $active }) => ($active ? colors.surface : 'transparent')};
  box-shadow: ${({ $active }) => ($active ? shadows.sm : 'none')};
  color: ${({ $active }) => ($active ? colors.primary : gray[600])};

  &:hover {
    background: ${({ $active }) => ($active ? colors.surface : catColors.hoverVeil)};
  }
`;

export const SubItemIcon = styled.span<{ $active: boolean }>`
  display: flex;
  flex-shrink: 0;
  color: ${({ $active }) => ($active ? colors.primary : gray[400])};
`;

export const SubItemLabel = styled.span`
  ${ellipsis}
  flex: 1;
  text-align: right;
`;

// Shared by the new-folder form and the sub-folder form: a text field, then a
// confirm/cancel pair on one row.
export const InlineForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const InlineInput = styled.input`
  border: 1px solid ${gray[200]};
  border-radius: ${radii.xl};
  padding: 8px 12px;
  font-size: 14px;
  text-align: right;
  background: ${colors.surface};
  color: ${gray[800]};
  outline: none;

  &:focus {
    border-color: ${colors.primary};
  }
`;

export const InlineActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const InlineConfirmBtn = styled.button`
  flex: 1;
  padding: 6px 0;
  border-radius: ${radii.full};
  font-size: 12px;
  font-weight: 600;
  color: ${colors.surface};
  background: ${colors.primary};
  transition: opacity ${transitions.normal};

  &:hover {
    opacity: 0.9;
  }
`;

export const InlineCancelBtn = styled.button`
  flex: 1;
  padding: 6px 0;
  border-radius: ${radii.full};
  border: 1px solid ${gray[200]};
  font-size: 12px;
  font-weight: 500;
  color: ${gray[600]};
  background: ${colors.surface};
  transition: background ${transitions.normal};

  &:hover {
    background: ${gray[50]};
  }
`;
