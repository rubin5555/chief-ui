import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { HE_ALPHA } from '../../document.constants';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import { DEFAULT_CLASSIFICATION_LEVEL, type NodePermissions, type SubSection } from '../../types';
import { EditableSectionBody } from '../EditableSectionBody';
import { NodeTitleField } from '../NodeTitleField';
import { SectionChat } from '../SectionChat';
import { SectionMenu } from '../SectionMenu';
import {
  HeaderActions,
  SubSectionHeaderRow,
  SubSectionMarker,
  SubSectionRoot,
} from './SubSectionBlock.styles';
import { SUB_SECTION_BLOCK_IDS } from './SubSectionBlock.testids';

export interface SubSectionBlockProps {
  subjectId: string;
  sectionId: string;
  subSection: SubSection;
  /** Position within the parent section, which picks the Hebrew letter marker. */
  index: number;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
}

// The third tree level. Unlike a section it has no delete-to-trash path — a
// sub-section delete is a plain removal, so RestoreModal only ever offers whole
// sections (see RestoreModal's doc comment for that scope call).
export const SubSectionBlock = ({
  subjectId,
  sectionId,
  subSection,
  index,
  tree,
  overrides,
}: SubSectionBlockProps) => {
  const meta = overrides.getMeta(subSection.id);

  const handleTitleChange = (title: string) =>
    tree.updateSubSectionTitle(subjectId, sectionId, subSection.id, title);

  const handleContentChange = (content: string) =>
    tree.updateSubSectionContent(subjectId, sectionId, subSection.id, content);

  const handlePermissionsChange = (role: keyof NodePermissions, value: string[]) =>
    tree.updateSubSectionPermissions(subjectId, sectionId, subSection.id, {
      ...subSection.permissions,
      [role]: value,
    });

  const handleToggleHidden = () => overrides.patchMeta(subSection.id, { hidden: !meta.hidden });

  const handleToggleClassified = () =>
    overrides.patchMeta(subSection.id, {
      classification: meta.classification.level
        ? { level: null, viewerIds: [] }
        : { level: DEFAULT_CLASSIFICATION_LEVEL, viewerIds: [] },
    });

  const handleChangeClassificationViewers = (viewerIds: string[]) =>
    overrides.patchMeta(subSection.id, {
      classification: { ...meta.classification, viewerIds },
    });

  const handleDelete = () => tree.removeSubSection(subjectId, sectionId, subSection.id);

  const marker = HE_ALPHA[index] ?? String(index + 1);

  return (
    <SubSectionRoot data-testid={SUB_SECTION_BLOCK_IDS.root(subSection.id)}>
      <SubSectionHeaderRow>
        <SubSectionMarker>{marker}.</SubSectionMarker>
        <NodeTitleField
          nodeId={subSection.id}
          variant="subSection"
          value={subSection.title}
          onChange={handleTitleChange}
        />
        <HeaderActions>
          {/* main labels a sub-section chat with its marker, so a reader can tell
              two similarly-titled sub-sections apart in the chat header. */}
          <SectionChat
            sectionId={subSection.id}
            title={`${marker}. ${subSection.title || 'תת סעיף ללא שם'}`}
          />
          <SectionMenu
            sectionId={subSection.id}
            permissions={subSection.permissions}
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
      </SubSectionHeaderRow>

      <EditableSectionBody
        id={subSection.id}
        depth="subSection"
        content={subSection.content}
        meta={meta}
        onContentChange={handleContentChange}
      />
    </SubSectionRoot>
  );
};
