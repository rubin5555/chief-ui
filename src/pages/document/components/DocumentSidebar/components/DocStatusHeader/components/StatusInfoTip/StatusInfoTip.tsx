import type { FocusEvent, MouseEvent } from 'react';
import { useId, useState } from 'react';
import { ModalPortal } from '@/components/ui/ModalPortal';
import { Tip, TipBadge } from './StatusInfoTip.styles';
import { STATUS_INFO_TIP_IDS } from './StatusInfoTip.testids';

const TIP_OFFSET = 48;

export interface StatusInfoTipProps {
  text: string;
}

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
