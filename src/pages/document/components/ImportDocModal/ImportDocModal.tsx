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

/** main's dialog is 88vw × 82vh, capped at 1200 (Edit.tsx:1851). */
const WIDTH = 1200;

const TITLE = 'ייבוא סעיפים ממסמך אחר';

export interface ImportDocModalProps {
  onClose: () => void;
  onImport: (sectionTitles: string[]) => void;
}

/**
 * Copying sections out of another document, in main's two steps (Edit.tsx:1816):
 * find the document, then read it and mark what to take. Both steps get the
 * whole dialog rather than a column each, because they are different jobs — one
 * is scanning a catalogue, the other is reading prose — and neither reads well
 * in half the width.
 *
 * Imported sections land as new sections under the tree's first subject: there
 * is no "pick a target subject" step yet, which is main's behaviour too and a
 * fair simplification while the modal's job is proving the flow end to end.
 */
export const ImportDocModal = ({ onClose, onImport }: ImportDocModalProps) => {
  const { data } = useImportDocs();
  const docsByTab = data ?? IMPORT_DOCS_FALLBACK.importDocs;

  const [activeTab, setActiveTab] = useState<ImportDocTabId>('drafts');
  const [search, setSearch] = useState('');
  const [openDoc, setOpenDoc] = useState<ImportDocItem | null>(null);
  // Keyed by section id, as main does — ids are stable and unique, so this
  // survives reordering and gives each row an unambiguous testid, which neither
  // a title nor a list index manages.
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const { trackSourcePicked, trackImportSubmitted } = useImportDocModalAnalytics();

  const { data: sectionsData, loading: sectionsLoading } = useImportDocSections(openDoc?.id ?? '');
  const sections = openDoc ? (sectionsData ?? []) : [];

  // Four documents per tab: filtering them is a pass over an array, not
  // something worth debouncing or asking the server about.
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
    // Maps ids back to titles rather than passing ids through: the tree builds
    // brand-new sections with fresh uuids, so the source id has no meaning
    // downstream — only the title survives the copy.
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
