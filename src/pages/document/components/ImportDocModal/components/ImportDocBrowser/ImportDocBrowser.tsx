import { Search } from 'lucide-react';
import type { ImportDocItem } from '@/api/docs';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SearchBar } from '@/components/ui/SearchBar';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import type { ImportDocTabId } from '../../ImportDocModal.constants';
import {
  DOC_TABLE_COLUMNS,
  FALLBACK_STATUS_COLOR,
  IMPORT_STATUS_COLOR,
  SEARCH_PLACEHOLDER,
  TABS,
} from '../../ImportDocModal.constants';
import { IMPORT_DOC_MODAL_IDS } from '../../ImportDocModal.testids';
import {
  BrowserRoot,
  HeadCell,
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

interface ImportDocBrowserProps {
  activeTab: ImportDocTabId;
  onTabChange: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  docs: ImportDocItem[];
  onSelectDoc: (doc: ImportDocItem) => void;
}

/**
 * Which document to copy from: main's catalog-shaped browser (Edit.tsx:1875) —
 * a tab per source, a search over it, and the results as a table rather than a
 * list, because choosing between four drafts from the same month means reading
 * the org and the date, not just the name.
 */
export const ImportDocBrowser = ({
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  docs,
  onSelectDoc,
}: ImportDocBrowserProps) => {
  const handleSelect = (doc: ImportDocItem) => () => onSelectDoc(doc);

  const renderDocRow = (doc: ImportDocItem) => (
    <GridTableRow onClick={handleSelect(doc)}>
      <NameCell data-testid={IMPORT_DOC_MODAL_IDS.docRow(doc.id)}>{doc.name}</NameCell>
      <MetaCell>{doc.org}</MetaCell>
      <MetaCell>{doc.date}</MetaCell>
      <StatusCell>
        <StatusDot $color={IMPORT_STATUS_COLOR[doc.status] ?? FALLBACK_STATUS_COLOR} />
        {doc.status}
      </StatusCell>
    </GridTableRow>
  );

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
            columns={DOC_TABLE_COLUMNS}
            headers={[
              <HeadCell key="name">שם המסמך</HeadCell>,
              <HeadCell key="org" $center>
                ארגון
              </HeadCell>,
              <HeadCell key="date" $center>
                תאריך
              </HeadCell>,
              <HeadCell key="status">סטטוס</HeadCell>,
            ]}
            items={docs}
            getRowKey={(doc) => doc.id}
            renderRow={renderDocRow}
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
