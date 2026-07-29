import type { FocusEvent, MouseEvent } from 'react';
import { useId, useState } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { Tip, TipBadge } from './StatusInfoTip.styles';
import { STATUS_INFO_TIP_IDS } from './StatusInfoTip.testids';

/** Vertical offset from the badge to the tip, so it clears the status row. */
const TIP_OFFSET = 48;

export interface StatusInfoTipProps {
  text: string;
}

// The `!` next to the document's status, and the tooltip it opens (main,
// Edit.tsx:3801). Both live here rather than the badge reporting hovers upward,
// because the tooltip is positioned from the badge's own rect — splitting them
// would mean passing that rect around.
//
// Anchored from the rect on each open rather than tracked continuously: it closes
// on the next pointer move away, so there is nothing to keep in sync. The badge is
// a real button and the tip also opens on focus, which is the one thing main's
// hover-only div can't do.
export const StatusInfoTip = ({ text }: StatusInfoTipProps) => {
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const tipId = useId();

  const openFrom = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setAnchor({ top: rect.top - TIP_OFFSET, right: window.innerWidth - rect.right });
  };

  const handleEnter = (event: MouseEvent<HTMLButtonElement>) => openFrom(event.currentTarget);
  const handleFocus = (event: FocusEvent<HTMLButtonElement>) => openFrom(event.currentTarget);
  const handleClose = () => setAnchor(null);

  return (
    <>
      <TipBadge
        type="button"
        aria-label="הסבר על סטטוס המסמך"
        aria-describedby={anchor ? tipId : undefined}
        data-testid={STATUS_INFO_TIP_IDS.badge}
        onMouseEnter={handleEnter}
        onMouseLeave={handleClose}
        onFocus={handleFocus}
        onBlur={handleClose}
      >
        !
      </TipBadge>

      {/* On the body for the same reason the floating panels are: the tip is
          placed in viewport coordinates, and any ancestor with a transform or a
          zoom quietly redefines what those mean. */}
      {anchor && (
        <ModalPortal>
          <Tip
            id={tipId}
            role="tooltip"
            dir="rtl"
            $top={anchor.top}
            $right={anchor.right}
            data-testid={STATUS_INFO_TIP_IDS.tip}
          >
            {text}
          </Tip>
        </ModalPortal>
      )}
    </>
  );
};
