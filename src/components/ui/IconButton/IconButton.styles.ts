import styled, { css } from 'styled-components';
import { flexCenter } from '@/styles/mixins';
import { colors, gray, radii, transitions } from '@/styles/theme';

// Shared so a link can wear the same chrome as a button: the navbar's profile
// entry is an anchor pointing at /profile, every other icon in that row is a
// button. Only the element type differs.
//
// The idle ink is gray[500], not gray[400]. The gray ramp is mirrored in dark
// mode (see theme.css) so that low numbers stay backgrounds and high numbers
// stay text — which means gray[400] resolves *darker* against a dark surface
// and the icon all but disappears. gray[500] reads in both modes, and matches
// the mock's text-gray-500.
export const iconButtonBase = css<{ $isActive: boolean }>`
  position: relative;
  padding: 6px;
  border-radius: ${radii.full};
  transition: background-color ${transitions.normal}, color ${transitions.normal};
  cursor: pointer;
  ${flexCenter}
  background-color: ${(p) => (p.$isActive ? colors.primary : 'transparent')};
  color: ${(p) => (p.$isActive ? colors.surface : gray[500])};
  &:hover { background-color: ${(p) => (p.$isActive ? colors.primary : gray[100])}; }
`;

export const IconButtonRoot = styled.button<{ $isActive: boolean }>`
  ${iconButtonBase}
`;

export const IconButtonBadge = styled.span`
  position: absolute;
  top: 4px;
  right: 4px;
  width: 8px;
  height: 8px;
  border-radius: ${radii.full};
  background-color: ${colors.primary};
`;
