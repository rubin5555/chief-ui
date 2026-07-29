import type { ComponentPropsWithRef } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import type { Pos } from '@/hooks/useFloatingPanel';
import { FloatingPanelRoot } from './FloatingPanel.styles';

export interface FloatingPanelProps extends ComponentPropsWithRef<'div'> {
  /** Viewport coordinates from useFloatingPanel. */
  pos?: Pos | null;
  width?: number;
}

/**
 * A panel that floats over the page, anchored to whatever opened it.
 *
 * Always mounted on `document.body`, never where it was written. `position:
 * fixed` means "relative to the viewport" only while no ancestor has taken the
 * job of being its containing block — and `transform`, `filter`, `contain` and
 * `zoom` all do, silently. The document page's A4 sheet is scaled with `zoom`, so
 * a menu opened on a section was placed against the viewport, then drawn against
 * the paper; ModalCard's closing animation is a `transform`, so a dropdown open
 * over a dialog would ride the dialog out. The measurements are taken in viewport
 * pixels, so the panel has to be somewhere those still mean what they say.
 *
 * `pos`/`width` are plain props, not the `$transient` ones the underlying styled
 * component takes: styled-components strips `$`-prefixed props before they reach
 * a wrapped component, so `styled(FloatingPanel)` would drop them on the floor.
 *
 * One consequence worth knowing: the panel is no longer next to its trigger in
 * the DOM, so Tab moves past it rather than into it. Anything that needs to be
 * keyboard-walkable has to move focus itself when it opens.
 */
export const FloatingPanel = ({ pos, width, ref, ...rest }: FloatingPanelProps) => (
  <ModalPortal>
    {/* tabIndex -1 so a panel with nothing focusable in it can still take focus
        itself; ahead of the spread, so a caller can say otherwise. */}
    <FloatingPanelRoot ref={ref} tabIndex={-1} $pos={pos} $width={width} {...rest} />
  </ModalPortal>
);
