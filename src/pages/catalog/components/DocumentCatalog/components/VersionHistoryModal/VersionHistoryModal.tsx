import { useState } from 'react';
import type { CatalogDoc, CatalogVersion } from '@/api/catalog';
import { CATALOG_VERSIONS_FALLBACK, useCatalogVersions } from '@/api/catalog';
import { GridTable } from '@/components/ui/GridTable';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { Modal } from '@/components/ui/Modal';
import { CATALOG_MODAL_IDS } from '../catalogModals.testids';
import { VersionStatusFilter } from './components/VersionStatusFilter';
import { versionColumns } from './VersionHistoryModal.columns';
import { HistoryTable, NoVersions } from './VersionHistoryModal.styles';

interface VersionHistoryModalProps {
  doc: CatalogDoc;
  onClose: () => void;
}

const versionKey = (version: CatalogVersion) => version.ver;

export const VersionHistoryModal = ({ doc, onClose }: VersionHistoryModalProps) => {
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const { data, loading } = useCatalogVersions(doc.id);
  const versions = data ?? CATALOG_VERSIONS_FALLBACK;

  const statusOptions = Array.from(new Set(versions.map((version) => version.status)));
  const rows =
    statusFilter.length > 0
      ? versions.filter((version) => statusFilter.includes(version.status))
      : versions;

  // Viewing a past version isn't wired on main either — the button is drawn and
  // does nothing.
  const handleView = (_version: CatalogVersion) => () => {};

  return (
    <Modal
      title="היסטוריית גרסאות"
      subtitle={doc.name}
      width={760}
      maxHeight="80vh"
      noBodyPadding
      onClose={onClose}
      headerAside={
        <VersionStatusFilter
          options={statusOptions}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
      }
      data-testid={CATALOG_MODAL_IDS.history}
    >
      <HistoryTable>
        {loading ? (
          <InlineSpinner />
        ) : (
          <GridTable
            columns={versionColumns(handleView)}
            items={rows}
            getRowKey={versionKey}
            density="comfortable"
            emptyState={<NoVersions>לא נמצאו גרסאות</NoVersions>}
          />
        )}
      </HistoryTable>
    </Modal>
  );
};
