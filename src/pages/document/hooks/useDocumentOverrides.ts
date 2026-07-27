import { useState } from 'react';
import type { DocumentDto, DocumentHeader, SectionMeta, SectionMetaMap } from '../types';
import { emptySectionMeta } from '../types';

// Doc-level status/header and per-section status/hidden/classification/
// attachments/footnotes aren't part of useDocumentTree's tree state (see
// src/pages/document/types.ts), so edits to them are kept as local override
// state layered over the query's initial `data`, the same pattern
// SectionChat's locally-appended comments established. Bundled into one
// hook once a third override (header, after status and sectionMeta) needed
// the identical shape, per .claude/skills/react-engineering.md's
// "Shrink Prop Lists" guidance.
export const useDocumentOverrides = (data: DocumentDto) => {
  const [status, setStatus] = useState(data.status);
  const [header, setHeader] = useState(data.header);
  const [metaOverrides, setMetaOverrides] = useState<SectionMetaMap>({});

  const getMeta = (id: string): SectionMeta => ({
    ...emptySectionMeta(),
    ...data.sectionMeta[id],
    ...metaOverrides[id],
  });

  // Derives the merged patch from the updater's own `prev`, not the
  // outer-scope `metaOverrides` `getMeta` closes over — two `patchMeta`
  // calls batched into the same render would otherwise have the second
  // call's spread see stale pre-update state and silently drop the first
  // call's patch.
  const patchMeta = (id: string, patch: Partial<SectionMeta>) =>
    setMetaOverrides((prev) => ({
      ...prev,
      [id]: { ...emptySectionMeta(), ...data.sectionMeta[id], ...prev[id], ...patch },
    }));

  const handleHeaderChange = (next: DocumentHeader) => setHeader(next);

  // Reflects metaOverrides too (not just the query's initial snapshot) so
  // consumers like the outline tree don't go stale once status/hidden/
  // classification start being edited locally. metaOverrides[id] is already
  // the fully-merged SectionMeta (patchMeta stores the whole merged object,
  // not just the patched keys), so this reuses it directly instead of
  // re-running getMeta's spread a second time for the same id.
  const mergedSectionMeta: SectionMetaMap = { ...data.sectionMeta, ...metaOverrides };

  return {
    status,
    setStatus,
    header,
    onHeaderChange: handleHeaderChange,
    getMeta,
    patchMeta,
    mergedSectionMeta,
  } as const;
};
