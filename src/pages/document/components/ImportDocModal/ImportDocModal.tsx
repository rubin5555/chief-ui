import { useState } from 'react';
import { IMPORT_DOCS_FALLBACK, useImportDocSections, useImportDocs } from '@/api/docs';
import { Modal } from '@/components/ui/Modal';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import {
  CancelBtn,
  DocListColumn,
  DocMeta,
  DocName,
  DocRow,
  EmptyState,
  ImportBtn,
  Layout,
  PreviewColumn,
  SectionRow,
} from './ImportDocModal.styles';
import { IMPORT_DOC_MODAL_IDS } from './ImportDocModal.testids';

type DocTab = 'drafts' | 'distributed';

const TABS: UnderlineTab[] = [
  { id: 'drafts', label: 'טיוטות' },
  { id: 'distributed', label: 'מסמכים שהופצו' },
];

export interface ImportDocModalProps {
  onClose: () => void;
  onImport: (sectionTitles: string[]) => void;
}

// Split preview (doc list -> that doc's sections, checkbox-selectable)
// mirroring main's ImportDocModal. Imported sections land as new sections
// under the tree's first subject -- there's no "pick a target subject" step
// yet, a reasonable simplification given the modal's job is proving the
// import flow works end-to-end, not picking a placement.
export const ImportDocModal = ({ onClose, onImport }: ImportDocModalProps) => {
  const { data } = useImportDocs();
  const docsByTab = data ?? IMPORT_DOCS_FALLBACK.importDocs;

  const [activeTab, setActiveTab] = useState<DocTab>('drafts');
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [checkedSections, setCheckedSections] = useState<string[]>([]);

  const { data: sectionsData } = useImportDocSections(selectedDocId ?? '');
  const sections = selectedDocId ? (sectionsData ?? []) : [];

  const handleTabChange = (id: string) => {
    setActiveTab(id as DocTab);
    setSelectedDocId(null);
    setCheckedSections([]);
  };

  const handleSelectDoc = (docId: string) => () => {
    setSelectedDocId(docId);
    setCheckedSections([]);
  };

  const handleToggleSection = (title: string) => () =>
    setCheckedSections((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title],
    );

  const handleImport = () => onImport(checkedSections);

  return (
    <Modal
      title="ייבוא סעיפים ממסמך אחר"
      onClose={onClose}
      width={640}
      data-testid={IMPORT_DOC_MODAL_IDS.root}
      footer={
        <>
          <CancelBtn type="button" onClick={onClose}>
            ביטול
          </CancelBtn>
          <ImportBtn
            type="button"
            onClick={handleImport}
            disabled={checkedSections.length === 0}
            data-testid={IMPORT_DOC_MODAL_IDS.importBtn}
          >
            ייבוא ({checkedSections.length})
          </ImportBtn>
        </>
      }
    >
      <UnderlineTabs tabs={TABS} activeId={activeTab} onChange={handleTabChange} />

      <Layout>
        <DocListColumn>
          {docsByTab[activeTab].map((doc) => (
            <DocRow
              key={doc.id}
              type="button"
              $active={doc.id === selectedDocId}
              onClick={handleSelectDoc(doc.id)}
              data-testid={IMPORT_DOC_MODAL_IDS.docRow(doc.id)}
            >
              <DocName>{doc.name}</DocName>
              <DocMeta>
                {doc.org} · {doc.date}
              </DocMeta>
            </DocRow>
          ))}
        </DocListColumn>

        <PreviewColumn>
          {selectedDocId ? (
            sections.map((title) => (
              <SectionRow key={title}>
                <input
                  type="checkbox"
                  checked={checkedSections.includes(title)}
                  onChange={handleToggleSection(title)}
                  data-testid={IMPORT_DOC_MODAL_IDS.sectionCheckbox(title)}
                />
                {title}
              </SectionRow>
            ))
          ) : (
            <EmptyState>בחר מסמך לתצוגה מקדימה</EmptyState>
          )}
        </PreviewColumn>
      </Layout>
    </Modal>
  );
};
