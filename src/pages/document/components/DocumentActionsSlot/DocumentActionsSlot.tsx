import { getRouteApi } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { DocActionToolbar } from '@/components/layout/TopNavbar/components/DocActionToolbar';
import { NavToolbarSlot } from '@/context/NavToolbarSlotContext';
import { ZOOM_MAX, ZOOM_MIN } from '../../document.measurements';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { DocumentHeader } from '../../types';
import { useDocPermissions } from '../DocPermissionsModal';
import type { EditDocDetailsMode } from '../EditDocDetailsModal';
import { FilterPanel } from '../FilterPanel';

const EditDocDetailsModal = lazy(() =>
  import('../EditDocDetailsModal').then((m) => ({ default: m.EditDocDetailsModal })),
);

const VersionPickerModal = lazy(() =>
  import('./components/VersionPickerModal').then((m) => ({ default: m.VersionPickerModal })),
);

const routeApi = getRouteApi('/document/$id');

export interface DocumentActionsSlotProps {
  overrides: ReturnType<typeof useDocumentOverrides>;
}

// main's document action icons sit in the navbar, immediately after the reality-mode
// pill (TopNavbar.tsx:1250), and open modals whose state belongs to the document.
// This component is what reconciles those two facts: it lives in the page, so it can
// own the modals and read the route, and it portals the toolbar up into the navbar
// through NavToolbarSlot. Nothing about the document leaks into AppLayout.
//
// Renders no chrome of its own, so there's no .styles.ts and no root testid — what
// it mounts carries DOC_ACTION_TOOLBAR_IDS and FILTER_PANEL_IDS. No .analytics.ts
// either: DocActionToolbar and FilterPanel each track their own clicks, and a second
// layer here would report every one of them twice.
export const DocumentActionsSlot = ({ overrides }: DocumentActionsSlotProps) => {
  const { id } = routeApi.useParams();
  const { zoom, q } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const [detailsMode, setDetailsMode] = useState<EditDocDetailsMode | null>(null);
  const [showVersionPicker, setShowVersionPicker] = useState(false);
  // The permissions dialog is shared with the section menus, so it is the
  // provider's to render — this button only asks for it, with no level in mind.
  const { openDocPermissions } = useDocPermissions();

  const handleOpenEdit = () => setDetailsMode('edit');
  const handleOpenDuplicate = () => setDetailsMode('duplicate');
  const handleCloseDetails = () => setDetailsMode(null);
  const handleOpenPermissions = () => openDocPermissions();

  // The picker is owned here, beside the icon that opens it, rather than by
  // ComparisonBar: the bar only exists once a comparison is running, so it can't
  // hold the control that starts one. Which version is being compared lives in
  // the URL, which is how the bar hears about the pick.
  const handleOpenVersionPicker = () => setShowVersionPicker(true);
  const handleCloseVersionPicker = () => setShowVersionPicker(false);
  const handlePickVersion = (label: string) =>
    navigate({ search: (prev) => ({ ...prev, compareVersion: label }), replace: true });

  // Clamped here rather than in ZoomControl, and rather than left to the route
  // schema: zod's `.min()/.max()` with a `.catch()` fallback *rejects* an
  // out-of-range value instead of pinning it, so pressing − at 50% would jump the
  // paper back to 100% instead of holding still.
  const handleZoomChange = (nextZoom: number) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom));
    navigate({ search: (prev) => ({ ...prev, zoom: clamped }), replace: true });
  };

  // `replace` on all of these: zoom steps and search keystrokes are adjustments to
  // one view of the document, not places you should have to press Back through.
  const handleSearchChange = (query: string) =>
    navigate({ search: (prev) => ({ ...prev, q: query }), replace: true });

  const handleSaveDetails = (header: DocumentHeader) => {
    overrides.onHeaderChange(header);
    setDetailsMode(null);
  };

  return (
    <>
      <NavToolbarSlot>
        <DocActionToolbar
          filter={<FilterPanel />}
          zoom={zoom}
          searchQuery={q}
          onEditDocClick={handleOpenEdit}
          onDuplicateClick={handleOpenDuplicate}
          onPermissionsClick={handleOpenPermissions}
          onCompareClick={handleOpenVersionPicker}
          onZoomChange={handleZoomChange}
          onSearchChange={handleSearchChange}
        />
      </NavToolbarSlot>

      <Suspense fallback={null}>
        {detailsMode && (
          <EditDocDetailsModal
            mode={detailsMode}
            header={overrides.header}
            docStatus={overrides.status}
            onClose={handleCloseDetails}
            onSave={handleSaveDetails}
          />
        )}
      </Suspense>

      <Suspense fallback={null}>
        {showVersionPicker && (
          <VersionPickerModal
            docId={id}
            onPick={handlePickVersion}
            onClose={handleCloseVersionPicker}
          />
        )}
      </Suspense>
    </>
  );
};
