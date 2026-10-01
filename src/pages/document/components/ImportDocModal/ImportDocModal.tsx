import { ArrowRight } from 'lucide-react';
import { useState } from 'react';
import type { ImportDocItem } from '@/api/docs';
import { IMPORT_DOCS_FALLBACK, useImportDocSections, useImportDocs } from '@/api/docs';
import { Modal } from '@/components/ui/Modal';
import { ImportDocBrowser } from './components/ImportDocBrowser';
import { ImportSectionList } from './components/ImportSectionList';
import { ImportSectionPreview } from './components/ImportSectionPreview';
import { useImportDocModalAnalytics } from './ImportDocModal.analytics';
import type { ImportDocTabId } from './ImportDocModal.constants';
import {
  BackButton,
  BackDivider,
  BackNav,
  OpenDocMeta,
  OpenDocName,
  SplitBody,
} from './ImportDocModal.styles';
import { IMPORT_DOC_MODAL_IDS } from './ImportDocModal.testids';

const WIDTH = 1200;

const TITLE = 'ייבוא סעיפים ממסמך אחר';

export interface ImportDocModalProps {
  onClose: () => void;
  onImport: (sectionTitles: string[]) => void;
}

export const ImportDocModal = ({ onClose, onImport }: ImportDocModalProps) => {
  const { data } = useImportDocs();
  const docsByTab = data ?? IMPORT_DOCS_FALLBACK.importDocs;

  const [activeTab, setActiveTab] = useState<ImportDocTabId>('drafts');
  const [search, setSearch] = useState('');
  const [openDoc, setOpenDoc] = useState<ImportDocItem | null>(null);

  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const { trackSourcePicked, trackImportSubmitted } = useImportDocModalAnalytics();

  const { data: sectionsData, loading: sectionsLoading } = useImportDocSections(openDoc?.id ?? '');
  const sections = openDoc ? (sectionsData ?? []) : [];

  const docs = docsByTab[activeTab].filter(
    (doc) => !search || doc.name.includes(search) || doc.org.includes(search),
  );

  const handleTabChange = (id: string) => {
    setActiveTab(id as ImportDocTabId);
    setSearch('');
  };

  const handleOpenDoc = (doc: ImportDocItem) => {
    trackSourcePicked(doc.id);
    setOpenDoc(doc);
    setCheckedIds([]);
  };

  const handleBack = () => {
    setOpenDoc(null);
    setCheckedIds([]);
  };

  const handleToggleSection = (sectionId: string) =>
    setCheckedIds((prev) =>
      prev.includes(sectionId) ? prev.filter((id) => id !== sectionId) : [...prev, sectionId],
    );

  const handleImport = () => {
    const titles = sections
      .filter((section) => checkedIds.includes(section.id))
      .map((section) => section.title);
    trackImportSubmitted(titles.length);
    onImport(titles);
  };

  return (
    <Modal
      title={TITLE}
      onClose={onClose}
      width={WIDTH}
      maxWidth="88vw"
      height="82vh"
      noBodyPadding
      data-testid={IMPORT_DOC_MODAL_IDS.root}
      headerSlot={
        openDoc ? (
          <BackNav>
            <BackButton type="button" data-testid={IMPORT_DOC_MODAL_IDS.back} onClick={handleBack}>
              <ArrowRight size={16} />
              חזרה
            </BackButton>
            <BackDivider aria-hidden="true">|</BackDivider>
            <OpenDocName>{openDoc.name}</OpenDocName>
            <OpenDocMeta>
              {openDoc.org} · {openDoc.date}
            </OpenDocMeta>
          </BackNav>
        ) : undefined
      }
    >
      {openDoc ? (
        <SplitBody>
          <ImportSectionList
            sections={sections}
            checkedIds={checkedIds}
            onToggle={handleToggleSection}
            onImport={handleImport}
          />
          <ImportSectionPreview
            docName={openDoc.name}
            sections={sections}
            checkedIds={checkedIds}
            loading={sectionsLoading}
            onToggle={handleToggleSection}
          />
        </SplitBody>
      ) : (
        <ImportDocBrowser
          activeTab={activeTab}
          onTabChange={handleTabChange}
          search={search}
          onSearchChange={setSearch}
          docs={docs}
          onSelectDoc={handleOpenDoc}
        />
      )}
    </Modal>
  );
};
