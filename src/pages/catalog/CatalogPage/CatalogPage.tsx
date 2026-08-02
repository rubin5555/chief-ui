import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { Search } from 'lucide-react';
import type { MouseEvent } from 'react';
import type { CatalogDoc, CatalogTab } from '@/api/catalog';
import { CatalogSidebar } from '../components/CatalogSidebar';
import type { CatalogFilters } from '../components/DocumentCatalog';
import { DocumentCatalog, parseCsv } from '../components/DocumentCatalog';
import { ALL_DOCS_DEPARTMENT, CATALOG_DEFAULTS, EMPTY_STATE_TEXT } from './CatalogPage.constants';
import { EmptyState, EmptyStateIcon, EmptyStateText, PageRoot } from './CatalogPage.styles';
import { CATALOG_PAGE_IDS } from './CatalogPage.testids';

const routeApi = getRouteApi('/catalog');

export const CatalogPage = () => {
  const search = routeApi.useSearch();
  const navigate = routeApi.useNavigate();
  const navigateApp = useNavigate();

  const { dept, folder, sub, envFolder, envDept, tab, page } = search;
  const isAllDocs = dept === ALL_DOCS_DEPARTMENT;

  // Picking a department resets everything scoped to the previous one — folder,
  // filters, page, the shelf. main does the same with a wall of setters; here
  // it is one object literal, which is also the only case the router skill
  // allows one for.
  const handleSelectDepartment = (nextDept: string) =>
    navigate({
      search: {
        dept: nextDept,
        folder: '',
        sub: '',
        envFolder: '',
        envDept: '',
        tab: CATALOG_DEFAULTS.tab,
        distSub: CATALOG_DEFAULTS.distSub,
        trash: false,
        page: CATALOG_DEFAULTS.page,
        q: '',
        template: '',
        status: '',
        deptFilter: '',
        org: '',
        from: '',
        to: '',
      },
    });

  // Under `כל המסמכים` a folder is an environment and its sub is a department,
  // which is why they land in a different pair of params than a plain folder.
  const handleSelectFolder = (nextFolder: string | null, nextSub: string | null) =>
    navigate({
      search: (prev) => ({
        ...prev,
        ...(isAllDocs
          ? { envFolder: nextFolder ?? '', envDept: nextSub ?? '' }
          : { folder: nextFolder ?? '', sub: nextSub ?? '' }),
        page: CATALOG_DEFAULTS.page,
      }),
      replace: true,
    });

  const handleOpenCommandPage = (org: string) =>
    navigateApp({ to: '/document/$id', params: { id: org } });

  // Switching shelf is a page-level move, so it pushes; it also drops the
  // filters, which mean different things on a different shelf.
  const handleTabChange = (nextTab: CatalogTab) =>
    navigate({
      search: (prev) => ({
        ...prev,
        tab: nextTab,
        distSub: CATALOG_DEFAULTS.distSub,
        page: CATALOG_DEFAULTS.page,
        q: '',
        template: '',
        status: '',
        deptFilter: '',
        org: '',
        from: '',
        to: '',
      }),
    });

  const handleDistSubChange = (distSub: string) =>
    navigate({
      search: (prev) => ({ ...prev, distSub, page: CATALOG_DEFAULTS.page }),
      replace: true,
    });

  const handleSearchChange = (q: string) =>
    navigate({ search: (prev) => ({ ...prev, q, page: CATALOG_DEFAULTS.page }), replace: true });

  const handlePageChange = (nextPage: number) =>
    navigate({ search: (prev) => ({ ...prev, page: nextPage }), replace: true });

  const handleOpenTrash = () => navigate({ search: (prev) => ({ ...prev, trash: true }) });

  const handleOpenDoc = (doc: CatalogDoc) =>
    navigateApp({ to: '/document/$id', params: { id: doc.id } });

  // Row-level actions land in the next slices of this migration — the row menu
  // and the eight modals it opens.
  const noop = (_doc: CatalogDoc) => {};
  const noopWithEvent = (_doc: CatalogDoc, _event: MouseEvent) => {};

  const filters: CatalogFilters = {
    search: search.q,
    templates: parseCsv(search.template),
    statuses: parseCsv(search.status),
    depts: parseCsv(search.deptFilter),
    orgs: parseCsv(search.org),
    from: search.from,
    to: search.to,
    distSub: search.distSub,
    isAllDocs,
    isDistribution: tab === 'distribution',
    folder,
    sub,
    envFolder,
    envDept,
  };

  return (
    <PageRoot data-testid={CATALOG_PAGE_IDS.root} dir="rtl">
      <CatalogSidebar
        dept={dept}
        folder={isAllDocs ? envFolder : folder}
        sub={isAllDocs ? envDept : sub}
        onSelectDepartment={handleSelectDepartment}
        onSelectFolder={handleSelectFolder}
        onOpenCommandPage={handleOpenCommandPage}
      />

      {dept ? (
        <DocumentCatalog
          tab={tab}
          filters={filters}
          page={page}
          onTabChange={handleTabChange}
          onDistSubChange={handleDistSubChange}
          onSearchChange={handleSearchChange}
          onPageChange={handlePageChange}
          onOpenDoc={handleOpenDoc}
          onOpenTrash={handleOpenTrash}
          onOpenHistory={noop}
          onOpenRowMenu={noopWithEvent}
          onOpenReceipts={noop}
          onReshare={noop}
        />
      ) : (
        <EmptyState data-testid={CATALOG_PAGE_IDS.emptyState}>
          <EmptyStateIcon>
            <Search size={28} />
          </EmptyStateIcon>
          <EmptyStateText>{EMPTY_STATE_TEXT}</EmptyStateText>
        </EmptyState>
      )}
    </PageRoot>
  );
};
