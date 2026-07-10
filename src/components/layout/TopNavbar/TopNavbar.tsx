import type { ReactNode } from 'react';
import { Nav, NavCenter, NavEnd, NavStart } from './TopNavbar.styles';
import { TOP_NAVBAR_IDS } from './TopNavbar.testids';

interface TopNavbarProps {
  start?: ReactNode;
  center?: ReactNode;
  end?: ReactNode;
}

export const TopNavbar = ({ start, center, end }: TopNavbarProps) => {
  return (
    <Nav data-testid={TOP_NAVBAR_IDS.root}>
      <NavStart data-testid={TOP_NAVBAR_IDS.start}>{start}</NavStart>
      <NavCenter data-testid={TOP_NAVBAR_IDS.center}>{center}</NavCenter>
      <NavEnd data-testid={TOP_NAVBAR_IDS.end}>{end}</NavEnd>
    </Nav>
  );
};
