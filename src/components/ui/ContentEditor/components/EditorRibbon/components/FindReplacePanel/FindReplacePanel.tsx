import { ArrowDown, ArrowUp, Search, X } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { TinyMceEditor } from '../../../../ContentEditor.types';
import { RIBBON_MARKER_ATTR, TOOLBAR_ICON_SIZE } from '../../EditorRibbon.constants';
import { EDITOR_RIBBON_IDS } from '../../EditorRibbon.testids';
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

export interface FindReplacePanelProps {
  editor: TinyMceEditor | null;
}

export const FindReplacePanel = ({ editor }: FindReplacePanelProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  const [query, setQuery] = useState('');
  const [replacement, setReplacement] = useState('');

  const search = editor?.plugins.searchreplace ?? null;

  const handleClose = () => {
    search?.done();
    panel.close();
  };

  const handleToggle = () => {
    if (panel.open) {
      handleClose();
      return;
    }
    panel.toggle(PANEL_WIDTH);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);
  const handleReplacementChange = (event: ChangeEvent<HTMLInputElement>) =>
    setReplacement(event.target.value);

  const handleFind = () => {
    if (!search || !query) return;
    search.done();
    search.find(query, false, false);
  };

  const handleFindOnEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') handleFind();
  };

  const handleNext = () => search?.next();
  const handlePrev = () => search?.prev();
  const handleReplace = () => search?.replace(replacement, true, false);
  const handleReplaceAll = () => search?.replace(replacement, true, true);

  return (
    <>
      <ToolbarButton
        ref={panel.btnRef}
        title="חפש והחלף"
        active={panel.open}
        disabled={!editor}
        onClick={handleToggle}
        data-testid={EDITOR_RIBBON_IDS.findReplaceTrigger}
      >
        <Search size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
      </ToolbarButton>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          {...{ [RIBBON_MARKER_ATTR]: '' }}
          data-testid={EDITOR_RIBBON_IDS.findReplacePanel}
        >
          <PanelHeader>
            <PanelTitle>חפש והחלף</PanelTitle>
            <CloseButton type="button" aria-label="סגירה" onClick={handleClose}>
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
                  onKeyDown={handleFindOnEnter}
                  placeholder="חפש..."
                  aria-label="חפש"
                  data-testid={EDITOR_RIBBON_IDS.findQuery}
                />
              </InputShell>
              <StepButton
                type="button"
                title="תוצאה קודמת"
                aria-label="תוצאה קודמת"
                onClick={handlePrev}
                data-testid={EDITOR_RIBBON_IDS.findPrev}
              >
                <ArrowUp size={TOOLBAR_ICON_SIZE} aria-hidden="true" />
              </StepButton>
              <StepButton
                type="button"
                title="תוצאה הבאה"
                aria-label="תוצאה הבאה"
                onClick={handleNext}
                data-testid={EDITOR_RIBBON_IDS.findNext}
              >
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
                data-testid={EDITOR_RIBBON_IDS.replaceValue}
              />
            </InputShell>
          </PanelBody>

          <PanelFooter>
            <Button type="button" size="xs" onClick={handleFind}>
              חפש
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleReplace}
              data-testid={EDITOR_RIBBON_IDS.replaceOne}
            >
              החלף
            </Button>
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleReplaceAll}
              data-testid={EDITOR_RIBBON_IDS.replaceAll}
            >
              החלף הכל
            </Button>
          </PanelFooter>
        </FloatingPanel>
      )}
    </>
  );
};
