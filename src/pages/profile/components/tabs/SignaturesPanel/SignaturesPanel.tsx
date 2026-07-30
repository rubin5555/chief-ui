import { Copy, Trash2 } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { SIGNATURES_FALLBACK, useSignatures } from '@/api/signatures';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { useEntityModal } from '@/hooks/useEntityModal';
import type { SignatureModalMode } from '@/modals/SignatureModal';
import { TabPanelShell } from '../TabPanelShell';
import { useFilterableList } from '../useFilterableList';
import { useSignaturesPanelAnalytics } from './SignaturesPanel.analytics';
import { SUB_TABS } from './SignaturesPanel.constants';
import { SIGNATURES_PANEL_IDS } from './SignaturesPanel.testids';

export interface Signature {
  id: string;
  name: string;
  department?: string;
}

export type SignatureType = 'distribution' | 'personal' | 'approver';

const DEFAULT_SUB_TAB: SignatureType = 'distribution';
const noop = () => {};

const SignatureModal = lazy(() =>
  import('@/modals/SignatureModal').then((m) => ({ default: m.SignatureModal })),
);

interface SignaturesPanelProps {
  departmentOptions: string[];
  onDelete: (id: string) => void;
}

export const SignaturesPanel = ({ departmentOptions, onDelete }: SignaturesPanelProps) => {
  const { data, loading } = useSignatures();
  const signatures = data ?? SIGNATURES_FALLBACK.signatures;

  const signatureModal = useEntityModal<SignatureModalMode, SignatureType>();
  const {
    trackNewSignature,
    trackSignatureModalOpened,
    trackEditSignature,
    trackDuplicateSignature,
    trackDeleteSignature,
    trackSubTabChanged,
    trackSearchUsed,
    trackFilterUsed,
  } = useSignaturesPanelAnalytics();

  const {
    search,
    filter,
    subTab,
    handleSearchChange,
    handleFilterChange,
    handleClearFilter,
    handleSubTabChange,
    matchesFilterable,
  } = useFilterableList<SignatureType>({
    defaultSubTab: DEFAULT_SUB_TAB,
    onSearchChange: trackSearchUsed,
    onFilterChange: trackFilterUsed,
    onSubTabChange: trackSubTabChanged,
  });

  const visible = signatures[subTab].filter((s) => matchesFilterable(s.name, s.department));

  const handleNew = () => {
    signatureModal.open('new', subTab);
    trackNewSignature(subTab);
    trackSignatureModalOpened();
  };
  const handleEdit = (_id: string, name: string) => () => {
    signatureModal.open('edit', subTab);
    trackEditSignature(name, subTab);
  };
  const getSigActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        signatureModal.open('duplicate', subTab);
        trackDuplicateSignature(name, subTab);
      },
    },
    {
      icon: <Trash2 size={16} />,
      label: 'מחיקה',
      onClick: () => {
        onDelete(id);
        trackDeleteSignature(name);
      },
      danger: true,
    },
  ];

  if (loading) return <PanelLoading />;

  return (
    <>
      <TabPanelShell
        rootTestId={SIGNATURES_PANEL_IDS.root}
        toolbarTestId={SIGNATURES_PANEL_IDS.toolbar}
        primaryLabel="+ חתימה חדשה"
        onPrimaryClick={handleNew}
        filterable={{
          search,
          onSearchChange: handleSearchChange,
          filterOptions: departmentOptions,
          filter,
          onFilterChange: handleFilterChange,
          onClearFilter: handleClearFilter,
        }}
        tabs={SUB_TABS}
        activeTab={subTab}
        onTabChange={handleSubTabChange}
        isEmpty={visible.length === 0}
        emptyLabel="אין חתימות"
      >
        {visible.map((sig) => (
          <ItemRow
            key={sig.id}
            label={sig.name}
            onClick={handleEdit(sig.id, sig.name)}
            actions={getSigActions(sig.id, sig.name)}
          />
        ))}
      </TabPanelShell>

      {signatureModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <SignatureModal
            mode={signatureModal.mode}
            initialType={signatureModal.editing}
            onClose={signatureModal.close}
            onSave={noop}
          />
        </Suspense>
      )}
    </>
  );
};
