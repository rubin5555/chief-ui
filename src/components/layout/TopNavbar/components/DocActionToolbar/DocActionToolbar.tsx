import type { ReactNode } from 'react';
import { DuplicateButton } from './controls/DuplicateButton';
import { EditDocButton } from './controls/EditDocButton';
import type { ExportType } from './controls/ExportControls';
import { ExportControls } from './controls/ExportControls';
import { PermissionsButton } from './controls/PermissionsButton';
import { SearchControl } from './controls/SearchControl';
import { ZoomControl } from './controls/ZoomControl';
import { useDocActionToolbarAnalytics } from './DocActionToolbar.analytics';
import { Divider, ToolbarRoot } from './DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from './DocActionToolbar.testids';

interface DocActionToolbarProps {
  /**
   * main's leading toolbar icon is a filter that toggles a popover
   * (Edit.tsx:3674). Trigger and popover have to live in one component — the
   * popover anchors to the trigger's own rect — and that component belongs to
   * the page, which owns the filter state. So the toolbar takes it as a slot
   * rather than rendering a button and handing the click back out.
   */
  filter: ReactNode;
  zoom: number;
  /** The query the URL already holds, so a bookmarked search comes back visible. */
  searchQuery: string;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onPermissionsClick?: () => void;
  onZoomChange?: (zoom: number) => void;
  onSearchChange?: (query: string) => void;
}

// This component is the only place that owns analytics tracking for the toolbar — the
// controls/ subcomponents are dumb (own only ephemeral UI state) and receive already-composed
// callbacks, per the "keep nested sub-component folders dumb" analytics rule.
//
// `zoom` arrives as a prop rather than living here because the URL owns it: the thing it
// scales is in a different subtree entirely, and a bookmarked zoom level has to survive a
// reload (.claude/skills/router-state-splitting.md). Search works the same way, except only
// the debounced query round-trips through the URL — SearchControl keeps the keystrokes local
// so typing doesn't re-render the rest of the toolbar.
export const DocActionToolbar = ({
  filter,
  zoom,
  searchQuery,
  onEditDocClick,
  onDuplicateClick,
  onPermissionsClick,
  onZoomChange,
  onSearchChange,
}: DocActionToolbarProps) => {
  const {
    trackEditDocClicked,
    trackDuplicateClicked,
    trackPermissionsClicked,
    trackExportStarted,
    trackZoomChanged,
    trackSearchToggled,
  } = useDocActionToolbarAnalytics();

  const onEditDocButtonClick = () => {
    trackEditDocClicked();
    onEditDocClick?.();
  };

  const onDuplicateButtonClick = () => {
    trackDuplicateClicked();
    onDuplicateClick?.();
  };

  const onPermissionsButtonClick = () => {
    trackPermissionsClicked();
    onPermissionsClick?.();
  };

  const onExportStart = (type: ExportType) => trackExportStarted(type);

  const onZoomControlChange = (nextZoom: number) => {
    trackZoomChanged(nextZoom);
    onZoomChange?.(nextZoom);
  };

  const onSearchToggle = (isOpen: boolean) => trackSearchToggled(isOpen);

  return (
    <ToolbarRoot data-testid={DOC_ACTION_TOOLBAR_IDS.root}>
      {filter}
      <EditDocButton onClick={onEditDocButtonClick} />
      <DuplicateButton onClick={onDuplicateButtonClick} />
      <PermissionsButton onClick={onPermissionsButtonClick} />
      <ExportControls onExportStart={onExportStart} />

      <Divider />

      <ZoomControl value={zoom} onChange={onZoomControlChange} />

      <Divider />

      <SearchControl
        value={searchQuery}
        onToggle={onSearchToggle}
        onSearchChange={onSearchChange}
      />
    </ToolbarRoot>
  );
};
