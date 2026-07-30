import { CalendarDays } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { RIBBON_MARKER_ATTR, TOOLBAR_ICON_SIZE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
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
  disabled: boolean;
  onInsert: (value: string) => void;
}

const now = new Date();
const TODAY: CalendarDate = {
  year: now.getFullYear(),
  month: now.getMonth(),
  day: now.getDate(),
};

export const InsertDatePanel = ({ disabled, onInsert }: InsertDatePanelProps) => {
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
        disabled={disabled}
        onClick={handleToggle}
        data-testid={EDITOR_RIBBON_IDS.insertDateTrigger}
      >
        <CalendarDays size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          {...{ [RIBBON_MARKER_ATTR]: '' }}
          data-testid={EDITOR_RIBBON_IDS.insertDatePanel}
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
