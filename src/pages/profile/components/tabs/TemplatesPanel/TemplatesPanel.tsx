import { Copy, Pin, RotateCcw, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
import { TabPanelShell } from '../TabPanelShell';
import { useFilterableList } from '../useFilterableList';
import { useTemplatesPanelAnalytics } from './TemplatesPanel.analytics';
import { DEFAULT_SUB_TAB, SUB_TABS } from './TemplatesPanel.constants';
import { PinButton } from './TemplatesPanel.styles';
import { TEMPLATES_PANEL_IDS } from './TemplatesPanel.testids';

export interface Template {
  id: string;
  name: string;
  department?: string;
}

interface TemplatesPanelProps {
  templates: Template[];
  deletedTemplates: Template[];
  departmentOptions: string[];
  onNew: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const TemplatesPanel = ({
  templates,
  deletedTemplates,
  departmentOptions,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
  onRestore,
}: TemplatesPanelProps) => {
  const [pinned, setPinned] = useState<Set<string>>(new Set());

  const {
    trackNewTemplate,
    trackEditTemplate,
    trackDuplicateTemplate,
    trackDeleteTemplate,
    trackRestoreTemplate,
    trackPinToggled,
    trackSubTabChanged,
    trackSearchUsed,
    trackFilterUsed,
  } = useTemplatesPanelAnalytics();

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
    onSubTabChange: trackSubTabChanged,
  });

  const togglePin = (id: string, name: string) => {
    setPinned((prev) => {
      const next = new Set(prev);
      const isNowPinned = !next.has(id);
      isNowPinned ? next.add(id) : next.delete(id);
      trackPinToggled(name, isNowPinned);
      return next;
    });
  };

  const visible = (subTab === DEFAULT_SUB_TAB ? templates : deletedTemplates).filter((t) =>
    matchesFilterable(t.name, t.department),
  );

  const handleNew = () => {
    onNew();
    trackNewTemplate();
  };
  const handleEdit = (id: string, name: string) => () => {
    onEdit(id);
    trackEditTemplate(name);
  };
  const handlePinClick = (id: string, name: string) => (e: MouseEvent) => {
    e.stopPropagation();
    togglePin(id, name);
  };
  const getActiveActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        onDuplicate(id);
        trackDuplicateTemplate(name);
      },
    },
    {
      icon: <Trash2 size={16} />,
      label: 'מחיקה',
      onClick: () => {
        onDelete(id);
        trackDeleteTemplate(name);
      },
      danger: true,
    },
  ];
  const getDeletedActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: () => {
        onDuplicate(id);
        trackDuplicateTemplate(name);
      },
    },
    {
      icon: <RotateCcw size={16} />,
      label: 'שחזור',
      onClick: () => {
        onRestore(id);
        trackRestoreTemplate(name);
      },
      accent: true,
    },
    {
      icon: <Trash2 size={16} />,
      label: 'מחיקה לצמיתות',
      onClick: () => {
        onDelete(id);
        trackDeleteTemplate(name);
      },
      danger: true,
    },
  ];
  const getItemActions = (id: string, name: string) =>
    subTab === DEFAULT_SUB_TAB ? getActiveActions(id, name) : getDeletedActions(id, name);

  return (
    <TabPanelShell
      rootTestId={TEMPLATES_PANEL_IDS.root}
      toolbarTestId={TEMPLATES_PANEL_IDS.toolbar}
      primaryLabel="+ תבנית חדשה"
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
      emptyLabel={subTab === DEFAULT_SUB_TAB ? 'אין תבניות' : 'אין תבניות שנמחקו'}
    >
      {visible.map((t) => (
        <ItemRow
          key={t.id}
          label={t.name}
          onClick={handleEdit(t.id, t.name)}
          leadingSlot={
            subTab === DEFAULT_SUB_TAB && (
              <PinButton onClick={handlePinClick(t.id, t.name)} $pinned={pinned.has(t.id)}>
                <Pin size={16} />
              </PinButton>
            )
          }
          actions={getItemActions(t.id, t.name)}
        />
      ))}
    </TabPanelShell>
  );
};
