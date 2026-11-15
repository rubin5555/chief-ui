import { getRouteApi } from '@tanstack/react-router';
import { lazy, Suspense, useState } from 'react';
import { DocActionToolbar } from '@/components/layout/TopNavbar/components/DocActionToolbar';
import { NavToolbarSlot } from '@/context/NavToolbarSlotContext';
import { useDocPermissions } from '@/modals/DocPermissionsModal';
import type { EditDocDetailsMode } from '@/modals/EditDocDetailsModal';
import { chunkGuard } from '../../../../utils/chunkRecovery';
import { ZOOM_MAX, ZOOM_MIN } from '../../document.measurements';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { DocumentHeader } from '../../types';
import { FilterPanel } from '../FilterPanel';

const EditDocDetailsModal = lazy(
  chunkGuard(() =>
    import('@/modals/EditDocDetailsModal').then((m) => ({ default: m.EditDocDetailsModal })),
  ),
);

const VersionPickerModal = lazy(
  chunkGuard(() =>
    import('./components/VersionPickerModal').then((m) => ({ default: m.VersionPickerModal })),
  ),
);

const routeApi = getRouteApi('/document/$id');

export interface DocumentActionsSlotProps {
  overrides: ReturnType<typeof useDocumentOverrides>;
}

export const DocumentActionsSlot = ({ overrides }: DocumentActionsSlotProps) => {
  const { id } = routeApi.useParams();
  const { zoom, q } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const [detailsMode, setDetailsMode] = useState<EditDocDetailsMode | null>(null);
  const [showVersionPicker, setShowVersionPicker] = useState(false);

  const { openDocPermissions } = useDocPermissions();

  const handleOpenEdit = () => setDetailsMode('edit');
  const handleOpenDuplicate = () => setDetailsMode('duplicate');
  const handleCloseDetails = () => setDetailsMode(null);
  const handleOpenPermissions = () => openDocPermissions();

  const handleOpenVersionPicker = () => setShowVersionPicker(true);
  const handleCloseVersionPicker = () => setShowVersionPicker(false);
  const handlePickVersion = (label: string) =>
    navigate({ search: (prev) => ({ ...prev, compareVersion: label }), replace: true });

  const handleZoomChange = (nextZoom: number) => {
    const clamped = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, nextZoom));
    navigate({ search: (prev) => ({ ...prev, zoom: clamped }), replace: true });
  };

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
