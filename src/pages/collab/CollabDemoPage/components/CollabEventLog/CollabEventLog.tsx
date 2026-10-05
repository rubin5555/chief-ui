import { ChevronDown, ChevronUp, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { CollabEventLogItem } from '@/context/CollabContext';
import { COLLAB_DEMO_IDS } from '../../CollabDemoPage.testids';
import {
  DetailsSpan,
  DirectionTag,
  LogActions,
  LogCount,
  LogDrawer,
  LogEmpty,
  LogHeader,
  LogList,
  LogRow,
  LogTitle,
  LogTitleGroup,
  SmallActionBtn,
  TimeStamp,
  TypeTag,
  UserTag,
} from './CollabEventLog.styles';

export interface CollabEventLogProps {
  events: CollabEventLogItem[];
  onClear: () => void;
}

const formatTime = (ts: number): string => {
  const d = new Date(ts);
  const pad = (n: number) => String(n).padStart(2, '0');
  const ms = String(d.getMilliseconds()).padStart(3, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}.${ms}`;
};

const describeMessage = (msg: CollabEventLogItem['message']): string => {
  switch (msg.type) {
    case 'join':
      return `fieldId: "${msg.fieldId}"`;
    case 'leave':
      return `fieldId: "${msg.fieldId}"`;
    case 'lock:acquire':
      return `בקשת נעילה לסעיף: "${msg.fieldId}"`;
    case 'lock:release':
      return `שחרור נעילה לסעיף: "${msg.fieldId}"`;
    case 'lock:heartbeat':
      return `heartbeat בסעיף: "${msg.fieldId}"`;
    case 'lock:granted':
      return `נעילה הוענקה למשתמש: ${msg.holderId} [${msg.fieldId}]`;
    case 'lock:denied':
      return `נעילה נדחתה [${msg.fieldId}], מוחזק ע״י: ${msg.holderId} (סיבה: ${msg.reason})`;
    case 'lock:released':
      return `נעילה שוחררה מסעיף: "${msg.fieldId}" (שוחרר ע״י: ${msg.holderId})`;
    case 'content':
      return `שידור תוכן מעודכן (${msg.html.length} תווים) [${msg.fieldId}]`;
    case 'cursor':
      return `שידור סמן [${msg.fieldId}]`;
    case 'yjs:update':
      return `CRDT Update (${Array.isArray(msg.update) ? msg.update.length : (msg.update as Uint8Array).length} bytes) [${msg.fieldId}]`;
    case 'yjs:sync':
      return `CRDT State Sync request [${msg.fieldId}]`;
    case 'db:autosave':
      return `💾 Autosaved to SQLite database [${msg.fieldId}]`;
    default:
      return JSON.stringify(msg);
  }
};

export const CollabEventLog = ({ events, onClear }: CollabEventLogProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleToggleCollapse = () => setIsCollapsed((prev) => !prev);

  return (
    <LogDrawer data-testid={COLLAB_DEMO_IDS.eventLog}>
      <LogHeader>
        <LogTitleGroup>
          <LogTitle>יומן תעבורת שיתוף בזמן אמת (WebSocket Protocol Activity)</LogTitle>
          <LogCount>{events.length}</LogCount>
        </LogTitleGroup>

        <LogActions>
          <SmallActionBtn type="button" data-testid={COLLAB_DEMO_IDS.clearLogBtn} onClick={onClear}>
            <Trash2 size={13} />
            נקה יומן
          </SmallActionBtn>
          <SmallActionBtn type="button" onClick={handleToggleCollapse}>
            {isCollapsed ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            {isCollapsed ? 'הרחב' : 'צמצם'}
          </SmallActionBtn>
        </LogActions>
      </LogHeader>

      <LogList $isCollapsed={isCollapsed}>
        {events.length === 0 ? (
          <LogEmpty>אין פעילות רשת עדיין. לחצו על אחד הסעיפים כדי להתחיל בעריכה.</LogEmpty>
        ) : (
          events.slice(0, 100).map((evt) => (
            <LogRow
              key={evt.id}
              $direction={evt.direction}
              data-testid={COLLAB_DEMO_IDS.eventItem(evt.id)}
            >
              <TimeStamp>{formatTime(evt.timestamp)}</TimeStamp>
              <DirectionTag $direction={evt.direction}>
                {evt.direction === 'in' ? '⬇ IN' : '⬆ OUT'}
              </DirectionTag>
              <UserTag $userId={evt.userId}>{evt.userId}</UserTag>
              <TypeTag>{evt.message.type}</TypeTag>
              <DetailsSpan>{describeMessage(evt.message)}</DetailsSpan>
            </LogRow>
          ))
        )}
      </LogList>
    </LogDrawer>
  );
};
