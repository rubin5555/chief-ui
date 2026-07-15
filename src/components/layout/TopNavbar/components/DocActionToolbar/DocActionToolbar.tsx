import { DuplicateButton } from './controls/DuplicateButton';
import { EditDocButton } from './controls/EditDocButton';
import type { ExportType } from './controls/ExportControls';
import { ExportControls } from './controls/ExportControls';
import { FilterButton } from './controls/FilterButton';
import { PermissionsButton } from './controls/PermissionsButton';
import { SearchControl } from './controls/SearchControl';
import { ZoomControl } from './controls/ZoomControl';
import { useDocActionToolbarAnalytics } from './DocActionToolbar.analytics';
import { Divider, ToolbarRoot } from './DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from './DocActionToolbar.testids';

interface DocActionToolbarProps {
  onFilterClick?: () => void;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onPermissionsClick?: () => void;
  onZoomChange?: (zoom: number) => void;
  onSearchChange?: (query: string) => void;
}

// This component is the only place that owns analytics tracking for the toolbar — the
// controls/ subcomponents are dumb (own only ephemeral UI state) and receive already-composed
// callbacks, per the "keep nested sub-component folders dumb" analytics rule. Each control still
// owns its own local state (zoom value, search-open flag, export-loading flag), so interacting
// with one control never re-renders the others.
export const DocActionToolbar = ({
  onFilterClick,
  onEditDocClick,
  onDuplicateClick,
  onPermissionsClick,
  onZoomChange,
  onSearchChange,
}: DocActionToolbarProps) => {
  const {
    trackFilterClicked,
    trackEditDocClicked,
    trackDuplicateClicked,
    trackPermissionsClicked,
    trackExportStarted,
    trackZoomChanged,
    trackSearchToggled,
  } = useDocActionToolbarAnalytics();

  const onFilterButtonClick = () => {
    trackFilterClicked();
    onFilterClick?.();
  };

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

  const onZoomControlChange = (zoom: number) => {
    trackZoomChanged(zoom);
    onZoomChange?.(zoom);
  };

  const onSearchToggle = (isOpen: boolean) => trackSearchToggled(isOpen);

  return (
    <ToolbarRoot data-testid={DOC_ACTION_TOOLBAR_IDS.root}>
      <FilterButton onClick={onFilterButtonClick} />
      <EditDocButton onClick={onEditDocButtonClick} />
      <DuplicateButton onClick={onDuplicateButtonClick} />
      <PermissionsButton onClick={onPermissionsButtonClick} />
      <ExportControls onExportStart={onExportStart} />

      <Divider />

      <ZoomControl onChange={onZoomControlChange} />

      <Divider />

      <SearchControl onToggle={onSearchToggle} onSearchChange={onSearchChange} />
    </ToolbarRoot>
  );
};
