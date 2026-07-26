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
}

export interface SectionClassification {
  level: string | null;
  viewerIds: string[];
}

export const DEFAULT_CLASSIFICATION_LEVEL = 'בלמ"ס';

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
  footnotes: string[];
  sourceSystem?: string;
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
}
