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
  SectionRow,
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
  // Tracked by index into `sections`, not by title string — two sections
  // sharing a title (plausible once this reads real backend data instead of
  // today's dedup'd mock) would otherwise toggle together and be
  // indistinguishable in `onImport`'s output.
  const [checkedIndexes, setCheckedIndexes] = useState<number[]>([]);

  const { data: sectionsData } = useImportDocSections(selectedDocId ?? '');
  const sections = selectedDocId ? (sectionsData ?? []) : [];

  const handleTabChange = (id: string) => {
    setActiveTab(id as DocTab);
    setSelectedDocId(null);
    setCheckedIndexes([]);
  };

  const handleSelectDoc = (docId: string) => () => {
    setSelectedDocId(docId);
    setCheckedIndexes([]);
  };

  const handleToggleSection = (index: number) => () =>
    setCheckedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onImport(checkedIndexes.map((index) => sections[index]));
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
            disabled={checkedIndexes.length === 0}
            data-testid={IMPORT_DOC_MODAL_IDS.importBtn}
          >
            ייבוא ({checkedIndexes.length})
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
              sections.map((title, index) => (
                <SectionRow key={`${index}-${title}`}>
                  <input
                    type="checkbox"
                    checked={checkedIndexes.includes(index)}
                    onChange={handleToggleSection(index)}
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
      </Body>
    </Modal>
  );
};
