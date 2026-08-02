import { Search } from 'lucide-react';
import type { ImportDocItem } from '@/api/docs';
import type { ColumnDef, RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import type { ImportDocTabId } from '../../ImportDocModal.constants';
import {
  FALLBACK_STATUS_COLOR,
  IMPORT_STATUS_COLOR,
  SEARCH_PLACEHOLDER,
  TABS,
} from '../../ImportDocModal.constants';
import { IMPORT_DOC_MODAL_IDS } from '../../ImportDocModal.testids';
import {
  BrowserRoot,
  MetaCell,
  NameCell,
  NoDocs,
  NoDocsIcon,
  SearchRow,
  StatusCell,
  StatusDot,
  TableCard,
  TableWrap,
  TabsRow,
} from './ImportDocBrowser.styles';

const docKey = (doc: ImportDocItem) => doc.id;

interface ImportDocBrowserProps {
  activeTab: ImportDocTabId;
  onTabChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  docs: ImportDocItem[];
  onSelectDoc: (doc: ImportDocItem) => void;
}

export const ImportDocBrowser = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  docs,
  onSelectDoc,
}: ImportDocBrowserProps) => {
  const handleSelect = (doc: ImportDocItem) => () => onSelectDoc(doc);

  const columns: ColumnDef<ImportDocItem>[] = [
    {
      key: 'name',
      width: '3fr',
      header: 'שם המסמך',
      align: 'right',
      cell: (doc) => (
        <NameCell data-testid={IMPORT_DOC_MODAL_IDS.docRow(doc.id)}>{doc.name}</NameCell>
      ),
    },
    { key: 'org', width: '1fr', header: 'ארגון', cell: (doc) => <MetaCell>{doc.org}</MetaCell> },
    { key: 'date', width: '1fr', header: 'תאריך', cell: (doc) => <MetaCell>{doc.date}</MetaCell> },
    {
      key: 'status',
      width: '1fr',
      header: 'סטטוס',
      align: 'right',
      cell: (doc) => (
        <StatusCell>
          <StatusDot $color={IMPORT_STATUS_COLOR[doc.status] ?? FALLBACK_STATUS_COLOR} />
          {doc.status}
        </StatusCell>
      ),
    },
  ];

  const rowConfig = (doc: ImportDocItem): RowConfig => ({ onClick: handleSelect(doc) });

  return (
    <BrowserRoot>
      <TabsRow>
        <UnderlineTabs tabs={TABS} activeId={activeTab} onChange={onTabChange} />
      </TabsRow>

      <SearchRow>
        <SearchBar value={search} onChange={onSearchChange} placeholder={SEARCH_PLACEHOLDER} />
      </SearchRow>

      <TableWrap>
        <TableCard>
          <GridTable
            columns={columns}
            items={docs}
            getRowKey={docKey}
            row={rowConfig}
            emptyState={
              <NoDocs data-testid={IMPORT_DOC_MODAL_IDS.noDocs}>
                <NoDocsIcon>
                  <Search size={24} />
                </NoDocsIcon>
                לא נמצאו מסמכים
              </NoDocs>
            }
          />
        </TableCard>
      </TableWrap>
    </BrowserRoot>
  );
};
