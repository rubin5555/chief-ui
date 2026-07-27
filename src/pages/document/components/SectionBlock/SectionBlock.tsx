import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import { DEFAULT_CLASSIFICATION_LEVEL, type NodePermissions, type Section } from '../../types';
import { EditableSectionBody } from '../EditableSectionBody';
import { NodeTitleField } from '../NodeTitleField';
import { SectionChat } from '../SectionChat';
import { SectionMenu } from '../SectionMenu';
import { SectionStatusLabel } from '../SectionStatusLabel';
import { SubSectionBlock } from '../SubSectionBlock';
import {
  HeaderActions,
  SectionHeaderRow,
  SectionNumber,
  SectionRoot,
  TitleSlot,
} from './SectionBlock.styles';
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
}

// One section: numbered heading row, body, then its sub-sections.
export const SectionBlock = ({
  subjectId,
  section,
  number,
  filteredSectionIds,
  searchMatchIds,
  tree,
  overrides,
  trash,
}: SectionBlockProps) => {
  const meta = overrides.getMeta(section.id);

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

  return (
    <SectionRoot
      $highlighted={searchMatchIds.has(section.id)}
      data-testid={SECTION_BLOCK_IDS.root(section.id)}
    >
      <SectionHeaderRow>
        <SectionNumber>{number}.</SectionNumber>
        <TitleSlot>
          <NodeTitleField
            nodeId={section.id}
            variant="section"
            value={section.title}
            onChange={handleTitleChange}
          />
        </TitleSlot>
        <SectionStatusLabel sectionId={section.id} status={meta.status} isHidden={meta.hidden} />
        <HeaderActions>
          <SectionChat sectionId={section.id} title={section.title || 'סעיף ללא שם'} />
          <SectionMenu
            sectionId={section.id}
            permissions={section.permissions}
            isHidden={meta.hidden}
            classificationLevel={meta.classification.level}
            classificationViewerIds={meta.classification.viewerIds}
            onChangePermissions={handlePermissionsChange}
            onToggleHidden={handleToggleHidden}
            onToggleClassified={handleToggleClassified}
            onChangeClassificationViewers={handleChangeClassificationViewers}
            onDelete={handleDelete}
          />
        </HeaderActions>
      </SectionHeaderRow>

      <EditableSectionBody
        id={section.id}
        depth="section"
        content={section.content}
        meta={meta}
        onContentChange={handleContentChange}
      />

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
            />
          ),
        )}
    </SectionRoot>
  );
};
