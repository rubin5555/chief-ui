import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { TOOLBAR_ICON_SIZE } from '../../DocToolbar.constants';
import { DOC_TOOLBAR_IDS } from '../../DocToolbar.testids';
import { ToolbarButton } from '../ToolbarButton';
import {
  CloseButton,
  InputShell,
  PanelBody,
  PanelFooter,
  PanelHeader,
  PanelInput,
  PanelTitle,
  ReplaceLabel,
  SearchIcon,
  SearchRow,
  StepButton,
} from './FindReplacePanel.styles';

const PANEL_WIDTH = 320;

// main's find-and-replace (Edit.tsx:1508-1590). None of its six controls is wired
// to anything — no search runs, nothing is replaced — which is the single clearest
// reason the whole ribbon is parked here rather than shipped.
export const FindReplacePanel = () => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');

  const handleToggle = () => panel.toggle(PANEL_WIDTH);
  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const handleReplacementChange = (event: ChangeEvent<HTMLInputElement>) =>
    setReplacement(event.target.value);

  return (
    <>
      <ToolbarButton
        ref={panel.btnRef}
        title="חפש והחלף"
        active={panel.open}
        onClick={handleToggle}
        data-testid={DOC_TOOLBAR_IDS.findReplaceTrigger}
      >
        <Search size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          data-testid={DOC_TOOLBAR_IDS.findReplacePanel}
        >
          <PanelHeader>
            <PanelTitle>חפש והחלף</PanelTitle>
            <CloseButton type="button" aria-label="סגירה" onClick={panel.close}>
              <X size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
            </CloseButton>
          </PanelHeader>

          <PanelBody>
            <SearchRow>
              <InputShell>
                <SearchIcon>
                  <Search size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
                </SearchIcon>
                <PanelInput
                  type="text"
                  value={query}
                  onChange={handleQueryChange}
                  placeholder="חפש..."
                  aria-label="חפש"
                />
              </InputShell>
              <StepButton type="button" title="תוצאה קודמת" aria-label="תוצאה קודמת">
                <ArrowUp size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
              </StepButton>
              <StepButton type="button" title="תוצאה הבאה" aria-label="תוצאה הבאה">
                <ArrowDown size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
              </StepButton>
            </SearchRow>

            <InputShell>
              <ReplaceLabel>החלף ב</ReplaceLabel>
              <PanelInput
                type="text"
                value={replacement}
                onChange={handleReplacementChange}
                placeholder="טקסט חלופי..."
                aria-label="החלף ב"
              />
            </InputShell>
          </PanelBody>

          <PanelFooter>
            <Button type="button" size="xs">
              חפש
            </Button>
            <Button type="button" variant="outline" size="xs">
              החלף
            </Button>
            <Button type="button" variant="outline" size="xs">
              החלף הכל
            </Button>
          </PanelFooter>
        </FloatingPanel>
      )}
    </>
  );
};
