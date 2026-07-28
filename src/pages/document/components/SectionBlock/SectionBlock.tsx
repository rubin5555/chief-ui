import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import {
  type AttachmentFile,
  DEFAULT_CLASSIFICATION_LEVEL,
  type Footnote,
  type NodePermissions,
  type Section,
  type SectionStatus,
} from '../../types';
import { EditableSectionBody } from '../EditableSectionBody';
import { SubSectionBlock } from '../SubSectionBlock';
import { SectionHeader } from './components/SectionHeader';
import { SectionStatusActions } from './components/SectionStatusActions';
import { SectionRoot } from './SectionBlock.styles';
import { SECTION_BLOCK_IDS } from './SectionBlock.testids';

export interface SectionBlockProps {
  subjectId: string;
  section: Section;
  /** Continuous position in the document, not within the parent subject. */
  number: number;
  filteredSectionIds: Set<string>;
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  /** A distributed document shows no per-section status and offers no transitions. */
  isDistributed: boolean;
}

// One section: its heading row, its body, its status controls, then its
// sub-sections. This component owns the state and the writes; the heading row's
// assembly is in components/SectionHeader.
export const SectionBlock = ({
  subjectId,
  section,
  number,
  filteredSectionIds,
  searchMatchIds,
  tree,
  overrides,
  trash,
  readOnly,
  isDistributed,
}: SectionBlockProps) => {
  const meta = overrides.getMeta(section.id);

  // Owned here rather than inside AttachmentPicker because the chips under the
  // body open the same dialog, and they are rendered by a different child.
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  // Whether this section is waiting for someone to say what needs fixing. One
  // boolean per section, local to it — main keeps a page-level Set of ids
  // alongside a Record of statuses and two helpers to read them (Edit.tsx:3211),
  // which is three representations of the same fact.
  const [isAwaitingFix, setIsAwaitingFix] = useState(false);

  const handleTitleChange = (title: string) =>
    tree.updateSectionTitle(subjectId, section.id, title);

  const handleContentChange = (content: string) =>
    tree.updateSectionContent(subjectId, section.id, content);

  const handlePermissionsChange = (role: keyof NodePermissions, value: string[]) =>
    tree.updateSectionPermissions(subjectId, section.id, { ...section.permissions, [role]: value });

  const handleToggleHidden = () => overrides.patchMeta(section.id, { hidden: !meta.hidden });

  const handleToggleClassified = () =>
    overrides.patchMeta(section.id, {
      classification: meta.classification.level
        ? { level: null, viewerIds: [] }
        : { level: DEFAULT_CLASSIFICATION_LEVEL, viewerIds: [] },
    });

  const handleChangeClassificationViewers = (viewerIds: string[]) =>
    overrides.patchMeta(section.id, {
      classification: { ...meta.classification, viewerIds },
    });

  const handleDelete = () => trash.remove(subjectId, section);

  const handleAttachmentsChange = (attachments: AttachmentFile[]) =>
    overrides.patchMeta(section.id, { attachments });

  const handleOpenAttachments = () => setAttachmentsOpen(true);

  const handleStatusChange = (status: SectionStatus) => {
    overrides.patchMeta(section.id, { status });
    setIsAwaitingFix(false);
  };

  // main opens the chat here as well. This arms the section and leaves the panel
  // to the reader — see DESIGN_PARITY.md's note on why.
  const handleRequestFix = () => setIsAwaitingFix(true);

  // The reason and the status change are one act: whatever is written first after
  // `לתיקון` is the explanation, and posting it is what moves the section.
  const handleMessageSent = () => {
    if (!isAwaitingFix) return;
    overrides.patchMeta(section.id, { status: 'fix' });
    setIsAwaitingFix(false);
  };

  const handleFootnotesChange = (footnotes: Footnote[]) =>
    overrides.patchMeta(section.id, { footnotes });

  const handleAddFootnote = () =>
    overrides.patchMeta(section.id, {
      footnotes: [...meta.footnotes, { id: `footnote-${self.crypto.randomUUID()}`, text: '' }],
    });

  const handleInstructionsChange = (instructions: string) =>
    overrides.patchMeta(section.id, { instructions });

  return (
    <SectionRoot
      $highlighted={searchMatchIds.has(section.id)}
      data-testid={SECTION_BLOCK_IDS.root(section.id)}
    >
      <SectionHeader
        sectionId={section.id}
        title={section.title}
        content={section.content}
        number={number}
        meta={meta}
        permissions={section.permissions}
        readOnly={readOnly}
        isDistributed={isDistributed}
        attachmentsOpen={attachmentsOpen}
        onAttachmentsOpenChange={setAttachmentsOpen}
        onTitleChange={handleTitleChange}
        onAttachmentsChange={handleAttachmentsChange}
        onMessageSent={handleMessageSent}
        onChangePermissions={handlePermissionsChange}
        onToggleHidden={handleToggleHidden}
        onToggleClassified={handleToggleClassified}
        onChangeClassificationViewers={handleChangeClassificationViewers}
        onChangeInstructions={handleInstructionsChange}
        onAddFootnote={handleAddFootnote}
        onDelete={handleDelete}
      />

      <EditableSectionBody
        id={section.id}
        depth="section"
        content={section.content}
        meta={meta}
        onContentChange={handleContentChange}
        onOpenAttachments={handleOpenAttachments}
        readOnly={readOnly}
        onFootnotesChange={handleFootnotesChange}
      />

      {/* A hidden section has nothing to approve, and a distributed document has
          nothing left to move — main drops the row in both cases (4600). */}
      {!meta.hidden && !isDistributed && (
        <SectionStatusActions
          sectionId={section.id}
          status={meta.status}
          onStatusChange={handleStatusChange}
          onRequestFix={handleRequestFix}
        />
      )}

      {/* Hiding a section hides its sub-sections with it, as main does. */}
      {!meta.hidden &&
        section.subSections.map((subSection, subSectionIndex) =>
          filteredSectionIds.has(subSection.id) ? null : (
            <SubSectionBlock
              key={subSection.id}
              subjectId={subjectId}
              sectionId={section.id}
              subSection={subSection}
              index={subSectionIndex}
              tree={tree}
              overrides={overrides}
              readOnly={readOnly}
            />
          ),
        )}
    </SectionRoot>
  );
};
