import type { FormEvent } from 'react';
import { useState } from 'react';
import { IMPORT_DOCS_FALLBACK, useImportDocSections, useImportDocs } from '@/api/docs';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import {
  Body,
  DocListColumn,
  DocMeta,
  DocName,
  DocRow,
  EmptyState,
  Layout,
  PreviewColumn,
  SectionLabel,
  SectionRow,
  SectionTitle,
} from './ImportDocModal.styles';
import { IMPORT_DOC_MODAL_IDS } from './ImportDocModal.testids';

type DocTab = 'drafts' | 'distributed';

const TABS: UnderlineTab[] = [
  { id: 'drafts', label: 'טיוטות' },
  { id: 'distributed', label: 'מסמכים שהופצו' },
];

const FORM_ID = 'import-doc-modal-form';

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
  // Keyed by section id, as main does — ids are stable and unique, so this
  // survives reordering and gives each checkbox an unambiguous testid, which
  // neither a title nor a list index manages.
  const [checkedIds, setCheckedIds] = useState<string[]>([]);

  const { data: sectionsData } = useImportDocSections(selectedDocId ?? '');
  const sections = selectedDocId ? (sectionsData ?? []) : [];

  const handleTabChange = (id: string) => {
    setActiveTab(id as DocTab);
    setSelectedDocId(null);
    setCheckedIds([]);
  };

  const handleSelectDoc = (docId: string) => () => {
    setSelectedDocId(docId);
    setCheckedIds([]);
  };

  const handleToggleSection = (sectionId: string) => () =>
    setCheckedIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Maps ids back to titles rather than passing ids through: the tree builds
    // brand-new sections with fresh uuids, so the source id has no meaning
    // downstream — only the title survives the copy.
    onImport(
      sections.filter((section) => checkedIds.includes(section.id)).map((section) => section.title),
    );
  };

  return (
    <Modal
      title="ייבוא סעיפים ממסמך אחר"
      onClose={onClose}
      width={640}
      data-testid={IMPORT_DOC_MODAL_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={checkedIds.length === 0}
            data-testid={IMPORT_DOC_MODAL_IDS.importBtn}
          >
            ייבוא ({checkedIds.length})
          </Button>
        </>
      }
    >
      <Body id={FORM_ID} onSubmit={onSubmit}>
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
              sections.map((section) => (
                <SectionRow key={section.id}>
                  <input
                    type="checkbox"
                    checked={checkedIds.includes(section.id)}
                    onChange={handleToggleSection(section.id)}
                    data-testid={IMPORT_DOC_MODAL_IDS.sectionCheckbox(section.id)}
                  />
                  <SectionLabel>{section.label}</SectionLabel>
                  <SectionTitle>{section.title}</SectionTitle>
                </SectionRow>
              ))
            ) : (
              <EmptyState>בחר מסמך לתצוגה מקדימה</EmptyState>
            )}
          </PreviewColumn>
        </Layout>
      </Body>
    </Modal>
  );
};
