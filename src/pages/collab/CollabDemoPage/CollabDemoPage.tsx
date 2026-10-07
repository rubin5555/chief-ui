import {
  AlertCircle,
  CheckCircle2,
  Database,
  MousePointer,
  RotateCcw,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { CollabEventLogItem } from '@/context/CollabContext';
import { DEMO_SECTIONS, DEMO_USERS, type DemoSectionDef } from './CollabDemoPage.constants';
import {
  CodeSnippet,
  DemoHeader,
  DemoPageRoot,
  DemoSubtitle,
  DemoTitle,
  FeaturePill,
  FeaturePillsRow,
  HeaderActions,
  HeaderTopRow,
  ResetBtn,
  ServerAlertBanner,
  ServerAlertText,
  SplitGrid,
  TitleGroup,
} from './CollabDemoPage.styles';
import { COLLAB_DEMO_IDS } from './CollabDemoPage.testids';
import { CollabEventLog } from './components/CollabEventLog';
import { CollabUserPanel } from './components/CollabUserPanel';

const buildInitialValues = (sections: DemoSectionDef[]): Record<string, string> => {
  const map: Record<string, string> = {};
  for (const s of sections) {
    map[s.id] = s.defaultContent;
  }
  return map;
};

export const CollabDemoPage = () => {
  const [aliceValues, setAliceValues] = useState<Record<string, string>>(() =>
    buildInitialValues(DEMO_SECTIONS),
  );
  const [bobValues, setBobValues] = useState<Record<string, string>>(() =>
    buildInitialValues(DEMO_SECTIONS),
  );

  const [events, setEvents] = useState<CollabEventLogItem[]>([]);
  const [serverHealthy, setServerHealthy] = useState<boolean | null>(null);

  // Poll /health on port 4310
  const checkHealth = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:4310/health', { method: 'GET' });
      setServerHealthy(res.ok);
    } catch {
      setServerHealthy(false);
    }
  }, []);

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 4000);
    return () => clearInterval(interval);
  }, [checkHealth]);

  const handleAliceChange = (fieldId: string, val: string) => {
    setAliceValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleBobChange = (fieldId: string, val: string) => {
    setBobValues((prev) => ({ ...prev, [fieldId]: val }));
  };

  const handleCollabEvent = useCallback((event: CollabEventLogItem) => {
    setEvents((prev) => [event, ...prev.slice(0, 149)]);
  }, []);

  const handleClearLog = () => setEvents([]);

  const handleReset = () => {
    const initial = buildInitialValues(DEMO_SECTIONS);
    setAliceValues(initial);
    setBobValues(initial);
    setEvents([]);
  };

  return (
    <DemoPageRoot data-testid={COLLAB_DEMO_IDS.root}>
      <DemoHeader data-testid={COLLAB_DEMO_IDS.header}>
        <HeaderTopRow>
          <TitleGroup>
            <DemoTitle>
              <Users size={22} color="var(--color-primary)" />
              מעבדת שיתוף פעולה בזמן אמת — Multiple Editors & Yjs CRDT
            </DemoTitle>
            <DemoSubtitle>
              עריכה שיתופית מקבילית בזמן אמת (WebSocket + Yjs CRDT + SQLite autosave). כל המשתמשים
              עורכים במקביל ובחופשיות ללא נעילות עם סנכרון מיידי וסמנים חיים.
            </DemoSubtitle>
          </TitleGroup>

          <HeaderActions>
            <ResetBtn type="button" data-testid={COLLAB_DEMO_IDS.resetBtn} onClick={handleReset}>
              <RotateCcw size={14} />
              איפוס תוכן הדגמה
            </ResetBtn>
          </HeaderActions>
        </HeaderTopRow>

        <FeaturePillsRow>
          <FeaturePill>
            <Zap size={13} color="#f59e0b" />
            עריכה מקבילית חופשית (Yjs CRDT Concurrent)
          </FeaturePill>
          <FeaturePill>
            <Database size={13} color="#10b981" />
            שמירה אוטומטית למסד נתונים (SQLite 500ms Debounced Autosave)
          </FeaturePill>
          <FeaturePill>
            <Sparkles size={13} color="#6366f1" />
            מיזוג שינויים מתמטי ללא התנגשויות (Conflict-Free Convergence)
          </FeaturePill>
          <FeaturePill>
            <MousePointer size={13} color="#2563eb" />
            מעקב סמנים חי ותיעוד פעילות שרת בזמן אמת
          </FeaturePill>
        </FeaturePillsRow>

        <ServerAlertBanner
          $connected={serverHealthy === true}
          data-testid={COLLAB_DEMO_IDS.serverStatus}
        >
          <ServerAlertText>
            {serverHealthy === true ? (
              <>
                <CheckCircle2 size={16} />
                <span>
                  שרת שיתוף הפעולה מחובר ופעיל בהצלחה בכתובת{' '}
                  <CodeSnippet>ws://localhost:4310/collab</CodeSnippet>
                </span>
              </>
            ) : (
              <>
                <AlertCircle size={16} />
                <span>
                  שרת שיתוף הפעולה אינו מגיב. להפעלת השרת בטרמינל נפרד הרץ:{' '}
                  <CodeSnippet>pnpm collab:dev</CodeSnippet>
                </span>
              </>
            )}
          </ServerAlertText>
        </ServerAlertBanner>
      </DemoHeader>

      <SplitGrid>
        <CollabUserPanel
          userId={DEMO_USERS.alice.id}
          userName={DEMO_USERS.alice.name}
          userRole={DEMO_USERS.alice.role}
          accentColor={DEMO_USERS.alice.accentColor}
          sections={DEMO_SECTIONS}
          values={aliceValues}
          onValueChange={handleAliceChange}
          onCollabEvent={handleCollabEvent}
        />

        <CollabUserPanel
          userId={DEMO_USERS.bob.id}
          userName={DEMO_USERS.bob.name}
          userRole={DEMO_USERS.bob.role}
          accentColor={DEMO_USERS.bob.accentColor}
          sections={DEMO_SECTIONS}
          values={bobValues}
          onValueChange={handleBobChange}
          onCollabEvent={handleCollabEvent}
        />
      </SplitGrid>

      <CollabEventLog events={events} onClear={handleClearLog} />
    </DemoPageRoot>
  );
};
