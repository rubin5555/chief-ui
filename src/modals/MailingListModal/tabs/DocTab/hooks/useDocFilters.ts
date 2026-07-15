import { useState } from 'react';
import type { DocItem } from '../../../MailingListModal.constants';
import { useFilterList } from './useFilterList';

// All DocTab filter state (type/status/org chips + date range) in one object,
// so the filter panel takes a single prop instead of ten.
export const useDocFilters = () => {
  const typeFilter = useFilterList<string>();
  const statusFilter = useFilterList<string>();
  const orgFilter = useFilterList<string>();
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const onDateFromChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateFrom(e.target.value);
  const onDateToChange = (e: React.ChangeEvent<HTMLInputElement>) => setDateTo(e.target.value);

  const hasFilter =
    typeFilter.active.length > 0 ||
    statusFilter.active.length > 0 ||
    orgFilter.active.length > 0 ||
    !!dateFrom ||
    !!dateTo;

  const clear = () => {
    typeFilter.clear();
    statusFilter.clear();
    orgFilter.clear();
    setDateFrom('');
    setDateTo('');
  };

  // Dates are collected but not applied — the mock docs have no parseable dates yet.
  const matches = (d: DocItem) => {
    if (typeFilter.active.length && !typeFilter.has(d.docType)) return false;
    if (statusFilter.active.length && !statusFilter.has(d.status)) return false;
    if (orgFilter.active.length && !orgFilter.has(d.environment)) return false;
    return true;
  };

  return {
    typeFilter,
    statusFilter,
    orgFilter,
    dateFrom,
    dateTo,
    onDateFromChange,
    onDateToChange,
    hasFilter,
    clear,
    matches,
  } as const;
};

export type DocFilters = ReturnType<typeof useDocFilters>;
