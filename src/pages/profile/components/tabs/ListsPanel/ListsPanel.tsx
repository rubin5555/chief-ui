import { Copy, Trash2 } from 'lucide-react';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
import type { Member } from '@/modals/MailingListModal';
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

interface ListsPanelProps {
  lists: DistributionList[];
  deletedLists: DistributionList[];
  departmentOptions: string[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const ListsPanel = ({
  lists,
  deletedLists,
  departmentOptions,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
}: ListsPanelProps) => {
  const {
    trackMailingList,
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
    onNew();
    trackMailingList();
  };
  const handleEdit = (id: string, name: string) => () => {
    onEdit(id);
    trackEditList(name);
  };
  const getListActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        onDuplicate(id);
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

  return (
    <TabPanelShell
      rootTestId={LISTS_PANEL_IDS.root}
      toolbarTestId={LISTS_PANEL_IDS.toolbar}
      primaryLabel="+ רשימה חדשה"
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
  );
};
