import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { BodyCell, HeaderCell } from './GridTable.styles';
import type { ColumnDef } from './GridTable.types';

// Grid children have to stay direct children of the grid, so an element cell is
// wrapped in a Fragment (no DOM) rather than a span. A spacer still emits an
// empty child — drop it and every later column slides a track to the left.
const isText = (content: ReactNode): content is string | number =>
  typeof content === 'string' || typeof content === 'number';

export const renderHeaderCells = <T,>(columns: ColumnDef<T>[]) =>
  columns.map(({ key, header, align }) => (
    <HeaderCell key={key} $align={align}>
      {header}
    </HeaderCell>
  ));

export const renderBodyCells = <T,>(columns: ColumnDef<T>[], item: T, index: number) =>
  columns.map(({ key, align, cell }) => {
    const content = cell?.(item, index);

    if (isText(content)) {
      return (
        <BodyCell key={key} $align={align}>
          {content}
        </BodyCell>
      );
    }

    return <Fragment key={key}>{content ?? <span />}</Fragment>;
  });
