import type { NodePermissions, Section, Subject, SubSection } from '@/hooks/useDocumentTree';

// The document tree itself (Subject → Section → SubSection) is exactly
// useDocumentTree's shape — no fork needed. Re-exported here so the rest of
// this feature imports tree types from one place alongside its own additions.
export type { NodePermissions, Section, Subject, SubSection };

export type SectionStatus = 'editing' | 'pending' | 'approved' | 'fix' | 'idle';

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  // Object URL minted at pick time so the attachments modal can offer a
  // download without the raw File ever entering the DTO. Absent on
  // server-seeded attachments, which have no local blob behind them.
  objectUrl?: string;
}

// A footnote carries its own id rather than being addressed by array index:
// main renders these in a list with per-row delete, and index keys remount
// every following row when one is removed mid-list.
export interface Footnote {
  id: string;
  text: string;
}

// Provenance for a node whose content came from an external system, shown by
// the source-systems notice and the per-node refresh button. Distinct from
// src/api/sourceSystems.ts, which models DataImportModal's import *catalog*.
export interface SourceOrigin {
  name: string;
  field: string;
}

// main's "עודכן ב-25-06-2026 11:18 ע״י s2345678" stamp on every node header.
export interface NodeStamp {
  at: string;
  by: string;
}

export interface SectionClassification {
  level: string | null;
  viewerIds: string[];
}

// Single source of truth for classification levels — EditDocDetailsModal's
// picker options are derived from this list (see EditDocDetailsModal.constants.ts)
// rather than keeping a second, independently-typed literal that could drift.
export const CLASSIFICATION_OPTIONS = ['בלמ"ס', 'סודי', 'סודי ביותר'];
export const DEFAULT_CLASSIFICATION_LEVEL = CLASSIFICATION_OPTIONS[0];

// Extra per-node data main's Edit.tsx keeps that useDocumentTree's generic
// Section/SubSection doesn't carry (status, hidden, classification,
// attachments, footnotes, source-system origin). Kept as a parallel map keyed
// by node id rather than widening Subject/Section/SubSection themselves,
// since TemplateModal also depends on that hook's shape staying generic.
// Comments are handled separately via src/api/comments.ts (SectionChat), not
// through this map.
export interface SectionMeta {
  status: SectionStatus;
  hidden: boolean;
  classification: SectionClassification;
  attachments: AttachmentFile[];
  footnotes: Footnote[];
  // Undefined rather than [] when a node has no external origin, so
  // `meta.sourceOrigin?.length` alone answers "can this node be refreshed?".
  sourceOrigin?: SourceOrigin[];
  instructions?: string;
  lastModified?: NodeStamp;
}

export type SectionMetaMap = Record<string, SectionMeta>;

export const emptySectionMeta = (): SectionMeta => ({
  status: 'idle',
  hidden: false,
  classification: { level: null, viewerIds: [] },
  attachments: [],
  footnotes: [],
});

export interface DocumentHeader {
  name: string;
  organization: string;
  template: string;
  orderNum: string;
  department: string;
  effectiveDate: string;
  classification: string;
  referenceNum: string;
}

export interface DocumentDto {
  id: string;
  status: string;
  header: DocumentHeader;
  subjects: Subject[];
  sectionMeta: SectionMetaMap;
  // Document-level provenance, driving the amber "מסמך זה נוצר ממערכת מקור"
  // notice above the paper and the doc tab of the source-systems modal.
  sourceSystems: SourceOrigin[];
}
