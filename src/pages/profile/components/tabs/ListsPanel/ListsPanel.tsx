import { Copy, Trash2 } from 'lucide-react';
import { lazy, Suspense } from 'react';
import { LISTS_FALLBACK, useLists } from '@/api/lists';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { useEntityModal } from '@/hooks/useEntityModal';
import type { Member, ModalMode } from '@/modals/MailingListModal';
import { TabPanelShell } from '../TabPanelShell';
import { useFilterableList } from '../useFilterableList';
import { useListsPanelAnalytics } from './ListsPanel.analytics';
import { DEFAULT_SUB_TAB, SUB_TABS } from './ListsPanel.constants';
import { LISTS_PANEL_IDS } from './ListsPanel.testids';

export interface DistributionList {
  id: string;
  name: string;
  memberCount?: number;
  members?: Member[];
  department?: string;
}

const noop = () => {};

const MailingListModal = lazy(() =>
  import('@/modals/MailingListModal').then((m) => ({ default: m.MailingListModal })),
);

interface ListsPanelProps {
  departmentOptions: string[];
  onDelete: (id: string) => void;
}

export const ListsPanel = ({ departmentOptions, onDelete }: ListsPanelProps) => {
  // Fetched here rather than by the page: this panel is already lazy-loaded
  // per-tab, so its data should be too — the query only fires once a user
  // actually switches to this tab, matching the JS chunk fetch.
  const { data, loading } = useLists();
  const lists = data?.lists ?? LISTS_FALLBACK.lists;
  const deletedLists = data?.deletedLists ?? LISTS_FALLBACK.deletedLists;

  const listModal = useEntityModal<ModalMode, DistributionList>();
  const {
    trackMailingList,
    trackMailingListOpened,
    trackEditList,
    trackDuplicateList,
    trackDeleteList,
    trackSearchUsed,
    trackFilterUsed,
  } = useListsPanelAnalytics();

  const {
    search,
    filter,
    subTab,
    handleSearchChange,
    handleFilterChange,
    handleClearFilter,
    handleSubTabChange,
    matchesFilterable,
  } = useFilterableList({
    defaultSubTab: DEFAULT_SUB_TAB,
    onSearchChange: trackSearchUsed,
    onFilterChange: trackFilterUsed,
  });

  const visible = (subTab === DEFAULT_SUB_TAB ? lists : deletedLists).filter((l) =>
    matchesFilterable(l.name, l.department),
  );

  const handleNew = () => {
    listModal.open('new');
    trackMailingList();
    trackMailingListOpened();
  };
  const handleEdit = (id: string, name: string) => () => {
    const list = lists.find((l) => l.id === id);
    if (!list) return;
    listModal.open('edit', list);
    trackEditList(name);
  };
  const getListActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        const list = lists.find((l) => l.id === id);
        if (!list) return;
        listModal.open('duplicate', list);
        trackDuplicateList(name);
      },
    },
    {
      icon: <Trash2 size={16} />,
      label: 'מחיקה',
      onClick: () => {
        onDelete(id);
        trackDeleteList(name);
      },
      danger: true,
    },
  ];

  if (loading) return <PanelLoading />;

  return (
    <>
      <TabPanelShell
        rootTestId={LISTS_PANEL_IDS.root}
        toolbarTestId={LISTS_PANEL_IDS.toolbar}
        primaryLabel="+ רשימה חדשה"
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
        emptyLabel={subTab === DEFAULT_SUB_TAB ? 'אין רשימות' : 'אין רשימות שנמחקו'}
      >
        {visible.map((list) => (
          <ItemRow
            key={list.id}
            label={list.name}
            onClick={handleEdit(list.id, list.name)}
            actions={getListActions(list.id, list.name)}
          />
        ))}
      </TabPanelShell>

      {listModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <MailingListModal
            mode={listModal.mode}
            initialName={listModal.editing?.name}
            initialMembers={listModal.editing?.members}
            onClose={listModal.close}
            onSave={noop}
          />
        </Suspense>
      )}
    </>
  );
};
