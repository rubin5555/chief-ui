import { Copy, Trash2 } from 'lucide-react';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
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

interface SignaturesPanelProps {
  signatures: Record<SignatureType, Signature[]>;
  departmentOptions: string[];
  onNew: (type: SignatureType) => void;
  onEdit: (id: string, type: SignatureType) => void;
  onDuplicate: (id: string, type: SignatureType) => void;
  onDelete: (id: string) => void;
}

export const SignaturesPanel = ({
  signatures,
  departmentOptions,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
}: SignaturesPanelProps) => {
  const {
    trackNewSignature,
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
    onNew(subTab);
    trackNewSignature(subTab);
  };
  const handleEdit = (id: string, name: string) => () => {
    onEdit(id, subTab);
    trackEditSignature(name, subTab);
  };
  const getSigActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        onDuplicate(id, subTab);
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

  return (
    <TabPanelShell
      rootTestId={SIGNATURES_PANEL_IDS.root}
      toolbarTestId={SIGNATURES_PANEL_IDS.toolbar}
      primaryLabel="+ חתימה חדשה"
      onPrimaryClick={handleNew}
      search={search}
      onSearchChange={handleSearchChange}
      filterOptions={departmentOptions}
      filter={filter}
      onFilterChange={handleFilterChange}
      onClearFilter={handleClearFilter}
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
  );
};
