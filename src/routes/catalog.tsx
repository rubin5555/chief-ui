import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CatalogPage } from '@/pages/catalog/CatalogPage';

// Route config stays in the eager bundle, so these literals are duplicated
// rather than imported from the page's constants. They must match
// `CATALOG_DEFAULTS` in src/pages/catalog/CatalogPage/CatalogPage.constants.ts.
const CATALOG_TABS = ['drafts', 'distribution', 'distributed', 'archive'] as const;
const DEFAULT_TAB = 'distributed' satisfies (typeof CATALOG_TABS)[number];
const ALL_DOCS = 'כל המסמכים';

// Multi-select filters travel as one comma-joined string, the same shape the
// document route uses for `statuses`.
const csv = () => z.string().catch('');

const catalogSearchSchema = z.object({
  // Sidebar selection.
  dept: z.string().catch(''),
  folder: z.string().catch(''),
  sub: z.string().catch(''),
  envFolder: z.string().catch(''),
  envDept: z.string().catch(''),

  // Which shelf, and where inside it.
  tab: z.enum(CATALOG_TABS).catch(DEFAULT_TAB),
  distSub: z.string().catch(ALL_DOCS),
  trash: z.boolean().catch(false),
  page: z.number().int().min(1).catch(1),

  // Search and filters.
  q: z.string().catch(''),
  template: csv(),
  status: csv(),
  deptFilter: csv(),
  org: csv(),
  from: z.string().catch(''),
  to: z.string().catch(''),
});

export type CatalogSearch = z.infer<typeof catalogSearchSchema>;

export const Route = createFileRoute('/catalog')({
  validateSearch: catalogSearchSchema,
  component: CatalogPage,
});
