import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { CatalogPage } from '@/pages/catalog/CatalogPage';

// Route config stays in the eager bundle, so these literals are duplicated
// rather than imported from the page's constants. They must match
// `CATALOG_DEFAULTS` in src/pages/catalog/CatalogPage/CatalogPage.constants.ts.
const CATALOG_TABS = ['drafts', 'distribution', 'distributed', 'archive'] as const;
const ALL_DOCS = 'כל המסמכים';

// Every default lives here once: the schema falls back to it, and
// `stripSearchParams` keeps it out of the URL. A screen with nothing selected
// is `/catalog`, not `/catalog?dept=&folder=&sub=&tab=distributed&page=1&…`.
const DEFAULTS = {
  // Sidebar selection.
  dept: '',
  folder: '',
  sub: '',
  envFolder: '',
  envDept: '',

  // Which shelf, and where inside it.
  tab: 'distributed',
  distSub: ALL_DOCS,
  trash: false,
  page: 1,

  // Search and filters.
  q: '',
  template: '',
  status: '',
  deptFilter: '',
  org: '',
  from: '',
  to: '',
} as const satisfies Record<string, string | number | boolean>;

// Multi-select filters travel as one comma-joined string, the same shape the
// document route uses for `statuses`.
const csv = () => z.string().catch('');

const catalogSearchSchema = z.object({
  dept: z.string().catch(DEFAULTS.dept),
  folder: z.string().catch(DEFAULTS.folder),
  sub: z.string().catch(DEFAULTS.sub),
  envFolder: z.string().catch(DEFAULTS.envFolder),
  envDept: z.string().catch(DEFAULTS.envDept),

  tab: z.enum(CATALOG_TABS).catch(DEFAULTS.tab),
  distSub: z.string().catch(DEFAULTS.distSub),
  trash: z.boolean().catch(DEFAULTS.trash),
  page: z.number().int().min(1).catch(DEFAULTS.page),

  q: z.string().catch(DEFAULTS.q),
  template: csv(),
  status: csv(),
  deptFilter: csv(),
  org: csv(),
  from: z.string().catch(DEFAULTS.from),
  to: z.string().catch(DEFAULTS.to),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;

export const Route = createFileRoute('/catalog')({
  validateSearch: catalogSearchSchema,
  search: { middlewares: [stripSearchParams(DEFAULTS)] },
  component: CatalogPage,
});
