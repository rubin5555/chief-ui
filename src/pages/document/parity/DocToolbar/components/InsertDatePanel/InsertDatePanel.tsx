import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { TOOLBAR_ICON_SIZE } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
import { ToolbarButton } from '../ToolbarButton';
import { CalendarMonthGrid } from './components/CalendarMonthGrid';
import { TimeRow } from './components/TimeRow';
import { PANEL_WIDTH } from './InsertDatePanel.constants';
import {
  FooterValue,
  PanelFooter,
  PanelRule,
  TimeCaption,
  TimeSection,
} from './InsertDatePanel.styles';
import type { CalendarDate, CalendarMonth } from './insertDatePanel.utils';
import { formatDateTime, nowAsTime } from './insertDatePanel.utils';

export interface InsertDatePanelProps {
  onInsert: (value: string) => void;
}

const now = new Date();
const TODAY: CalendarDate = {
  year: now.getFullYear(),
  month: now.getMonth(),
  day: now.getDate(),
};

// main's date-and-time picker (Edit.tsx:1592-1684), whose whole body is an IIFE
// inside the JSX. The month being *looked at* and the date *chosen* are two facts
// — you can page through October without picking anything — so they are two pieces
// of state here rather than main's six.
export const InsertDatePanel = ({ onInsert }: InsertDatePanelProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  const [view, setView] = useState<CalendarMonth>({ year: TODAY.year, month: TODAY.month });
  const [selected, setSelected] = useState<CalendarDate | null>(null);
  const [time, setTime] = useState(nowAsTime);

  const handleToggle = () => panel.toggle(PANEL_WIDTH);

  const handleConfirm = () => {
    if (!selected) return;
    panel.close();
    onInsert(formatDateTime(selected, time));
  };

  return (
    <>
      <ToolbarButton
        ref={panel.btnRef}
        title="הוסף תאריך ושעה"
        active={panel.open}
        onClick={handleToggle}
        data-testid={DOC_TOOLBAR_IDS.insertDateTrigger}
      >
        <CalendarDays size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          data-testid={DOC_TOOLBAR_IDS.insertDatePanel}
        >
          <CalendarMonthGrid
            view={view}
            selected={selected}
            today={TODAY}
            onViewChange={setView}
            onSelect={setSelected}
          />

          <PanelRule />
          <TimeSection>
            <TimeCaption>שעה</TimeCaption>
            <TimeRow value={time} onChange={setTime} />
          </TimeSection>

          {selected && (
            <>
              <PanelRule />
              <PanelFooter>
                <FooterValue>{formatDateTime(selected, time)}</FooterValue>
                <Button type="button" size="xs" onClick={handleConfirm}>
                  אישור
                </Button>
              </PanelFooter>
            </>
          )}
        </FloatingPanel>
      )}
    </>
  );
};
