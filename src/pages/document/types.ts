import type { NodePermissions, Section, Subject, SubSection } from '@/hooks/useDocumentTree';

export type { NodePermissions, Section, Subject, SubSection };

export type SectionStatus = 'editing' | 'pending' | 'approved' | 'fix' | 'idle';

export interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  objectUrl?: string;
}

export interface Footnote {
  id: string;
  text: string;
}

export interface SourceOrigin {
  name: string;
  field: string;
}

export interface NodeStamp {
  at: string;
  by: string;
}

export interface SectionClassification {
  level: string | null;
  viewerIds: string[];
}

export const CLASSIFICATION_OPTIONS = ['בלמ"ס', 'סודי', 'סודי ביותר'];
export const DEFAULT_CLASSIFICATION_LEVEL = CLASSIFICATION_OPTIONS[0];

export interface SectionMeta {
  status: SectionStatus;
  hidden: boolean;
  classification: SectionClassification;
  attachments: AttachmentFile[];
  footnotes: Footnote[];
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

export type PdfAccess = 'authorized' | 'all';

export interface DocumentHeader {
  name: string;
  organization: string;
  template: string;
  orderNum: string;
  updateNum: string;
  classification: string;
  referenceNum: string;
  department: string;
  docType: string;
  folder: string;
  entityType: string;
  entityName: string;
  effectiveDate: string;
  expiryDate: string;
  pdfAccess: PdfAccess;
  cancelApproval: boolean;
  watermark: boolean;
  distributeNatzura: boolean;
}

export interface DocumentDto {
  id: string;
  status: string;
  header: DocumentHeader;
  subjects: Subject[];
  sectionMeta: SectionMetaMap;
  sourceSystems: SourceOrigin[];
}
