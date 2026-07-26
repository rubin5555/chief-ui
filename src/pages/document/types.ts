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

export interface SectionComment {
  id: string;
  authorId: string;
  authorName: string;
  text: string;
  createdAt: string;
}

export interface SectionClassification {
  level: string | null;
  viewerIds: string[];
}

// Extra per-node data main's Edit.tsx keeps that useDocumentTree's generic
// Section/SubSection doesn't carry (status, classification, attachments,
// footnotes, comments, source-system origin). Kept as a parallel map keyed by
// node id rather than widening Subject/Section/SubSection themselves, since
// TemplateModal also depends on that hook's shape staying generic.
export interface SectionMeta {
  status: SectionStatus;
  classification: SectionClassification;
  attachments: AttachmentFile[];
  footnotes: string[];
  comments: SectionComment[];
  sourceSystem?: string;
}

export type SectionMetaMap = Record<string, SectionMeta>;

export const emptySectionMeta = (): SectionMeta => ({
  status: 'idle',
  classification: { level: null, viewerIds: [] },
  attachments: [],
  footnotes: [],
  comments: [],
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
