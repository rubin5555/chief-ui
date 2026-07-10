import styled from 'styled-components';

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  position: relative;
  flex-shrink: 0;
  z-index: 100;
`;

export const NavStart = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const NavCenter = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const NavEnd = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;
