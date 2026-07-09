import { Copy, FileEdit, Filter, Loader2, Search, UserCog } from 'lucide-react';
import { type ChangeEvent, type KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useDocActionToolbarAnalytics } from './DocActionToolbar.analytics';
import {
  EXPORT_SIMULATED_DELAY_MS,
  SEARCH_DEBOUNCE_MS,
  ZOOM_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
} from './DocActionToolbar.constants';
import { PdfIcon, WordIcon } from './DocActionToolbar.icons';
import { Divider, IconAction, SpinningLoader, ToolbarRoot } from './DocActionToolbar.styles';
import { DOC_ACTION_TOOLBAR_IDS } from './DocActionToolbar.testids';
import { DocSearchField } from './DocSearchField';
import { ZoomControl } from './ZoomControl';

type ExportType = 'word' | 'pdf';

interface DocActionToolbarProps {
  onFilterClick?: () => void;
  onEditDocClick?: () => void;
  onDuplicateClick?: () => void;
  onPermissionsClick?: () => void;
  onZoomChange?: (zoom: number) => void;
  onSearchChange?: (query: string) => void;
}

export const DocActionToolbar = ({
  onFilterClick,
  onEditDocClick,
  onDuplicateClick,
  onPermissionsClick,
  onZoomChange,
  onSearchChange,
}: DocActionToolbarProps) => {
  const [zoom, setZoom] = useState(ZOOM_DEFAULT);
  const [loadingExport, setLoadingExport] = useState<ExportType | null>(null);
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, SEARCH_DEBOUNCE_MS);
  const exportTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const {
    trackFilterClicked,
    trackEditDocClicked,
    trackDuplicateClicked,
    trackPermissionsClicked,
    trackExportStarted,
    trackZoomChanged,
    trackSearchToggled,
  } = useDocActionToolbarAnalytics();

  useEffect(() => {
    onSearchChange?.(debouncedSearchQuery);
  }, [debouncedSearchQuery, onSearchChange]);

  useEffect(() => {
    return () => {
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    };
  }, []);

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

  const onZoomBy = (delta: number) => () => {
    const nextZoom = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, zoom + delta));
    setZoom(nextZoom);
    trackZoomChanged(nextZoom);
    onZoomChange?.(nextZoom);
  };

  const onExportClick = (type: ExportType) => () => {
    if (loadingExport) return;
    trackExportStarted(type);
    setLoadingExport(type);
    if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    exportTimeoutRef.current = setTimeout(() => {
      setLoadingExport(null);
      exportTimeoutRef.current = null;
    }, EXPORT_SIMULATED_DELAY_MS);
  };

  const onSearchOpen = () => {
    setSearchActive(true);
    trackSearchToggled(true);
  };

  const onSearchClose = () => {
    setSearchActive(false);
    setSearchQuery('');
    trackSearchToggled(false);
    onSearchChange?.('');
  };

  const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const onSearchKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') onSearchClose();
  };

  return (
    <ToolbarRoot data-testid={DOC_ACTION_TOOLBAR_IDS.root}>
      <IconAction
        type="button"
        title="סינון"
        data-testid={DOC_ACTION_TOOLBAR_IDS.filter}
        onClick={onFilterButtonClick}
      >
        <Filter size={16} />
      </IconAction>
      <IconAction
        type="button"
        title="עריכת פרטי מסמך"
        data-testid={DOC_ACTION_TOOLBAR_IDS.editDoc}
        onClick={onEditDocButtonClick}
      >
        <FileEdit size={16} />
      </IconAction>
      <IconAction
        type="button"
        title="שכפול"
        data-testid={DOC_ACTION_TOOLBAR_IDS.duplicate}
        onClick={onDuplicateButtonClick}
      >
        <Copy size={16} />
      </IconAction>
      <IconAction
        type="button"
        title="הרשאות"
        data-testid={DOC_ACTION_TOOLBAR_IDS.permissions}
        onClick={onPermissionsButtonClick}
      >
        <UserCog size={16} />
      </IconAction>
      <IconAction
        type="button"
        title="ייצוא ל-Word"
        data-testid={DOC_ACTION_TOOLBAR_IDS.exportWord}
        onClick={onExportClick('word')}
      >
        {loadingExport === 'word' ? (
          <SpinningLoader>
            <Loader2 size={16} />
          </SpinningLoader>
        ) : (
          <WordIcon />
        )}
      </IconAction>
      <IconAction
        type="button"
        title="ייצוא PDF"
        data-testid={DOC_ACTION_TOOLBAR_IDS.exportPdf}
        onClick={onExportClick('pdf')}
      >
        {loadingExport === 'pdf' ? (
          <SpinningLoader>
            <Loader2 size={16} />
          </SpinningLoader>
        ) : (
          <PdfIcon />
        )}
      </IconAction>

      <Divider />

      <ZoomControl zoom={zoom} onZoomBy={onZoomBy} />

      <Divider />

      {searchActive ? (
        <DocSearchField
          value={searchQuery}
          onChange={onSearchInputChange}
          onKeyDown={onSearchKeyDown}
          onClose={onSearchClose}
        />
      ) : (
        <IconAction
          type="button"
          title="חיפוש במסמך"
          data-testid={DOC_ACTION_TOOLBAR_IDS.searchToggle}
          onClick={onSearchOpen}
        >
          <Search size={16} />
        </IconAction>
      )}
    </ToolbarRoot>
  );
};
