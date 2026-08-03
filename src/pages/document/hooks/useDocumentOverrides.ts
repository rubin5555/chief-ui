import { useState } from 'react';
import { SUPERSCRIPT_NUMS } from '../document.constants';
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

  /**
   * Adds a footnote to a field and hands back the marker it will be numbered
   * with, for a caller that also wants to reference it from the text.
   *
   * One implementation for all three ways in — the section menu, the
   * sub-section menu, and the ribbon's footnote button — so a footnote added
   * from the toolbar is the same thing as one added from a menu, not a
   * lookalike. The marker is the row's position, exactly as `FootnoteList`
   * draws it; nothing ties a `<sup>` in the text to a particular row, so a
   * note inserted above an existing one renumbers the list and leaves the
   * older marker pointing at its neighbour. That is the footnote main has, and
   * anchors are a bigger change than this one.
   */
  const addFootnote = (id: string): string => {
    const position = getMeta(id).footnotes.length;
    patchMeta(id, {
      footnotes: [
        ...getMeta(id).footnotes,
        { id: `footnote-${self.crypto.randomUUID()}`, text: '' },
      ],
    });
    return SUPERSCRIPT_NUMS[position] ?? String(position + 1);
  };

  const handleHeaderChange = (next: DocumentHeader) => setHeader(next);

  const mergedSectionMeta: SectionMetaMap = { ...data.sectionMeta, ...metaOverrides };

  return {
    status,
    setStatus,
    header,
    onHeaderChange: handleHeaderChange,
    getMeta,
    patchMeta,
    addFootnote,
    mergedSectionMeta,
  } as const;
};
