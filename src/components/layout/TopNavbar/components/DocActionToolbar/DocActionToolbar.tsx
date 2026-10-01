import type { ReactNode } from 'react';
import { CompareButton } from './controls/CompareButton';
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
  filter: ReactNode;
  zoom: number;
  searchQuery: string;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onPermissionsClick?: () => void;
  onCompareClick?: () => void;
  onZoomChange?: (zoom: number) => void;
  onSearchChange?: (query: string) => void;
}

export const DocActionToolbar = ({
  filter,
  zoom,
  searchQuery,
  onEditDocClick,
  onDuplicateClick,
  onPermissionsClick,
  onCompareClick,
  onZoomChange,
  onSearchChange,
}: DocActionToolbarProps) => {
  const {
    trackEditDocClicked,
    trackDuplicateClicked,
    trackPermissionsClicked,
    trackCompareClicked,
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

  const onCompareButtonClick = () => {
    trackCompareClicked();
    onCompareClick?.();
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
      <CompareButton onClick={onCompareButtonClick} />
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
