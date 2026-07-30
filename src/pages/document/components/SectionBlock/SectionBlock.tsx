import { useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { OUTLINE_NODE_ATTR } from '../../document.constants';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import {
  type AttachmentFile,
  DEFAULT_CLASSIFICATION_LEVEL,
  type Footnote,
  type Section,
  type SectionStatus,
} from '../../types';
import { EditableSectionBody } from '../EditableSectionBody';
import { useSectionChatCoordination } from '../SectionChat';
import { useSectionNavigation } from '../SectionNavigation';
import { SubSectionBlock } from '../SubSectionBlock';
import { SectionHeader } from './components/SectionHeader';
import { SectionStatusActions } from './components/SectionStatusActions';
import { useSectionBlockAnalytics } from './SectionBlock.analytics';
import { SectionRoot } from './SectionBlock.styles';
import { SECTION_BLOCK_IDS } from './SectionBlock.testids';

export interface SectionBlockProps {
  subjectId: string;
  section: Section;
  number: number;
  filteredSectionIds: Set<string>;
  searchMatchIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
  readOnly: boolean;
  isDistributed: boolean;
}

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
  const nav = useSectionNavigation();

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);

  const [isAwaitingFix, setIsAwaitingFix] = useState(false);
  const { openChat } = useSectionChatCoordination();
  const { trackStatusChanged, trackFixRequested, trackFixApplied } = useSectionBlockAnalytics();

  const handleTitleChange = (title: string) =>
    tree.updateSectionTitle(subjectId, section.id, title);

  const handleContentChange = (content: string) =>
    tree.updateSectionContent(subjectId, section.id, content);

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
    trackStatusChanged(status);
    overrides.patchMeta(section.id, { status });
    setIsAwaitingFix(false);
  };

  const handleRequestFix = () => {
    trackFixRequested();
    setIsAwaitingFix(true);
    openChat(section.id);
  };

  const handleMessageSent = () => {
    if (!isAwaitingFix) return;
    trackFixApplied();
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
      $revealed={nav?.revealedNodeId === section.id}
      {...{ [OUTLINE_NODE_ATTR]: section.id }}
      data-testid={SECTION_BLOCK_IDS.root(section.id)}
    >
      <SectionHeader
        sectionId={section.id}
        title={section.title}
        content={section.content}
        number={number}
        meta={meta}
        readOnly={readOnly}
        isDistributed={isDistributed}
        attachmentsOpen={attachmentsOpen}
        onAttachmentsOpenChange={setAttachmentsOpen}
        onTitleChange={handleTitleChange}
        onAttachmentsChange={handleAttachmentsChange}
        onMessageSent={handleMessageSent}
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

      {!meta.hidden && !isDistributed && (
        <SectionStatusActions
          sectionId={section.id}
          status={meta.status}
          onStatusChange={handleStatusChange}
          onRequestFix={handleRequestFix}
        />
      )}

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
