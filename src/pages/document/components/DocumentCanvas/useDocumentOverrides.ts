import { useState } from 'react';
import type { DocumentDto, DocumentHeader, SectionMeta, SectionMetaMap } from '../../types';
import { emptySectionMeta } from '../../types';

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

  const patchMeta = (id: string, patch: Partial<SectionMeta>) =>
    setMetaOverrides((prev) => ({ ...prev, [id]: { ...getMeta(id), ...patch } }));

  const handleHeaderChange = (next: DocumentHeader) => setHeader(next);

  // Reflects metaOverrides too (not just the query's initial snapshot) so
  // consumers like the outline tree don't go stale once status/hidden/
  // classification start being edited locally.
  const mergedSectionMeta: SectionMetaMap = { ...data.sectionMeta };
  for (const id of Object.keys(metaOverrides)) mergedSectionMeta[id] = getMeta(id);

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
