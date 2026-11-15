import type { CatalogDoc } from '@/api/catalog';
import { DIST_SUB_STATUS } from './DocumentCatalog.constants';

export interface CatalogFilters {
  search: string;
  templates: string[];
  statuses: string[];
  depts: string[];
  orgs: string[];
  from: string;
  to: string;
  distSub: string;
  isAllDocs: boolean;
  isDistribution: boolean;
  folder: string;
  sub: string;
  envFolder: string;
  envDept: string;
}

// Multi-select filters travel through the URL as one comma-joined string.
export const parseCsv = (value: string): string[] =>
  value ? value.split(',').filter(Boolean) : [];

export const toCsv = (values: string[]): string => values.join(',');

// `15/03/2024` sorts wrong as a string, so comparisons run on the ISO form.
const toIso = (ddmmyyyy: string) => {
  const [day, month, year] = ddmmyyyy.split('/');
  return `${year}-${month}-${day}`;
};

const matchesSearch = (doc: CatalogDoc, search: string) => {
  const query = search.trim();
  if (!query) return true;
  return doc.name.includes(query) || doc.orderNum.includes(query) || doc.refNum.includes(query);
};

const matchesDateRange = (doc: CatalogDoc, from: string, to: string) => {
  if (!from && !to) return true;
  const iso = toIso(doc.effectiveDate);
  if (from && iso < from) return false;
  if (to && iso > to) return false;
  return true;
};

// Under `כל המסמכים` the sidebar selects an environment and a department;
// everywhere else it selects a folder, and a sub-folder wins over its parent.
const matchesScope = (doc: CatalogDoc, filters: CatalogFilters) => {
  if (filters.isAllDocs) {
    if (filters.envFolder && doc.env !== filters.envFolder) return false;
    if (filters.envDept && doc.dept !== filters.envDept.replace(/^מחלקת /, '')) return false;
    return true;
  }
  const activeFolder = filters.sub || filters.folder;
  return !activeFolder || doc.folder === activeFolder;
};

export const filterCatalogDocs = (docs: CatalogDoc[], filters: CatalogFilters): CatalogDoc[] =>
  docs.filter((doc) => {
    if (!matchesSearch(doc, filters.search)) return false;
    if (filters.templates.length > 0 && !filters.templates.includes(doc.type)) return false;
    if (filters.statuses.length > 0 && !filters.statuses.includes(doc.status)) return false;
    if (filters.depts.length > 0 && (!doc.dept || !filters.depts.includes(doc.dept))) return false;
    if (
      filters.isAllDocs &&
      filters.orgs.length > 0 &&
      (!doc.env || !filters.orgs.includes(doc.env))
    )
      return false;
    if (!matchesScope(doc, filters)) return false;
    if (!matchesDateRange(doc, filters.from, filters.to)) return false;
    if (filters.isDistribution) {
      const expected = DIST_SUB_STATUS[filters.distSub];
      if (expected && doc.status !== expected) return false;
    }
    return true;
  });

export const uniqueValues = (docs: CatalogDoc[], pick: (doc: CatalogDoc) => string | undefined) =>
  Array.from(new Set(docs.flatMap((doc) => (pick(doc) ? [pick(doc) as string] : []))));
