import { Link } from '@tanstack/react-router';
import styled from 'styled-components';
import { colors } from '@/styles/theme';

// main's brand is a click target that navigates home (TopNavbar.tsx:1218), so this
// is a real router Link rather than a span — it's also the document page's only way
// back, since dev has no catalog page to have arrived from.
export const BrandLink = styled(Link)`
  color: ${colors.primary};
  text-decoration: none;
`;

// `display: contents` so an empty slot contributes no box at all: NavStart is a
// flex row with a gap, and a zero-width host would still leave that gap dangling
// after the reality-mode pill on every page that has no toolbar. With `contents`,
// whatever the current page portals in becomes the flex item itself and brings its
// own spacing — which is how main's markup reads too (TopNavbar.tsx:1251).
export const NavToolbarHost = styled.div`
  display: contents;
`;
