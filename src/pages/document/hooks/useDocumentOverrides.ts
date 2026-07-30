import { useState } from 'react';
import type { DocumentDto, DocumentHeader, SectionMeta, SectionMetaMap } from '../types';
import { emptySectionMeta } from '../types';

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
    setMetaOverrides((prev) => ({
      ...prev,
      [id]: { ...emptySectionMeta(), ...data.sectionMeta[id], ...prev[id], ...patch },
    }));

  const handleHeaderChange = (next: DocumentHeader) => setHeader(next);

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
