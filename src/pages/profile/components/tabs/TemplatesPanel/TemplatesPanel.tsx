import { Copy, Pin, RotateCcw, Trash2 } from 'lucide-react';
import type { MouseEvent } from 'react';
import { lazy, Suspense, useState } from 'react';
import { TEMPLATES_FALLBACK, useTemplates } from '@/api/templates';
import type { RowAction } from '@/components/ui/ItemRow';
import { ItemRow } from '@/components/ui/ItemRow';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { PanelLoading } from '@/components/ui/PanelLoading';
import { useEntityModal } from '@/hooks/useEntityModal';
import type { TemplateModalMode } from '@/modals/TemplateModal';
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

const noop = () => {};

// Lazy: TemplateModal drags in ContentEditor (TinyMCE, ~1MB+) — only fetched
// once a user actually opens the new/edit/duplicate flow from this panel.
const TemplateModal = lazy(() =>
  import('@/modals/TemplateModal').then((m) => ({ default: m.TemplateModal })),
);

interface TemplatesPanelProps {
  departmentOptions: string[];
  currentUserId?: string;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
}

export const TemplatesPanel = ({
  departmentOptions,
  currentUserId,
  onDelete,
  onRestore,
}: TemplatesPanelProps) => {
  // Fetched here rather than by the page: this panel is already lazy-loaded
  // per-tab, so its data should be too — the query only fires once a user
  // actually switches to this tab, matching the JS chunk fetch.
  const { data, loading } = useTemplates();
  const templates = data?.templates ?? TEMPLATES_FALLBACK.templates;
  const deletedTemplates = data?.deletedTemplates ?? TEMPLATES_FALLBACK.deletedTemplates;

  const [pinned, setPinned] = useState<Set<string>>(new Set());
  const templateModal = useEntityModal<TemplateModalMode, Template>();

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

  const findTemplate = (id: string) => [...templates, ...deletedTemplates].find((t) => t.id === id);

  const handleNew = () => {
    templateModal.open('new');
    trackNewTemplate();
  };
  const handleEdit = (id: string, name: string) => () => {
    const template = findTemplate(id);
    if (!template) return;
    templateModal.open('edit', template);
    trackEditTemplate(name);
  };
  const handlePinClick = (id: string, name: string) => (e: MouseEvent) => {
    e.stopPropagation();
    togglePin(id, name);
  };
  const handleDuplicate = (id: string, name: string) => () => {
    const template = findTemplate(id);
    if (!template) return;
    templateModal.open('duplicate', template);
    trackDuplicateTemplate(name);
  };
  const getActiveActions = (id: string, name: string): RowAction[] => [
    {
      icon: <Copy size={16} />,
      label: 'שכפול',
      onClick: handleDuplicate(id, name),
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
      onClick: handleDuplicate(id, name),
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

  if (loading) return <PanelLoading />;

  return (
    <>
      <TabPanelShell
        rootTestId={TEMPLATES_PANEL_IDS.root}
        toolbarTestId={TEMPLATES_PANEL_IDS.toolbar}
        primaryLabel="+ תבנית חדשה"
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

      {templateModal.mode && (
        <Suspense fallback={<ModalLoading />}>
          <TemplateModal
            mode={templateModal.mode}
            initialName={templateModal.editing?.name}
            departmentOptions={departmentOptions}
            currentUserId={currentUserId}
            onClose={templateModal.close}
            onSave={noop}
          />
        </Suspense>
      )}
    </>
  );
};
