import styled from 'styled-components';
import { flexBetween, flexGap } from '@/styles/mixins';

export const Nav = styled.nav`
  ${flexBetween}
  padding: 24px;
  position: relative;
  flex-shrink: 0;
  z-index: 100;
`;

export const NavStart = styled.div`
  ${flexGap(16)}
`;

export const NavCenter = styled.div`
  ${flexGap(16)}
`;

export const NavEnd = styled.div`
  ${flexGap(8)}
`;
