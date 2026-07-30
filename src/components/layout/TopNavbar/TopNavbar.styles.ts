import styled from 'styled-components';
import { flexBetween, flexGap } from '@/styles/mixins';

export const Nav = styled.nav`
  ${flexBetween}
  padding: 24px;
  position: relative;
  flex-shrink: 0;
  z-index: 100;
`;

// 16px, main's `gap-4` on the leading group (TopNavbar.tsx:1217) — brand, reality
// mode, then whatever toolbar the page portals in. The document toolbar keeps its
// own tighter 4px between icons and adds main's 4px lead-in of its own.
export const NavStart = styled.div`
  ${flexGap(16)}
`;

export const NavCenter = styled.div`
  ${flexGap(16)}
`;

export const NavEnd = styled.div`
  ${flexGap(8)}
`;
