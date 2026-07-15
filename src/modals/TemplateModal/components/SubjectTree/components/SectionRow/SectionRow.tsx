import { GripVertical, Plus, Trash2, User } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { useDragReorder } from '@/hooks/useDragReorder';
import type { Section, SubSection } from '../../../../TemplateModal.constants';
import { HE_ALPHA } from '../../../../TemplateModal.constants';
import {
  AddChildLink,
  DragHandle,
  NodeIndex,
  SectionBlock,
  SectionRowBox,
  SmallIconBtn,
  SubSectionRowBox,
  SubSectionsWrap,
  TitleInput,
} from '../../../../TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from '../../../../TemplateModal.testids';

interface SectionRowProps {
  subjectId: string;
  section: Section;
  sectionIndex: number;
  activePermissionsId: string | null;
  sectionDrag: ReturnType<typeof useDragReorder>;
  subSectionDrag: ReturnType<typeof useDragReorder>;
  onTitleChange: (
    subjectId: string,
    sectionId: string,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: (subjectId: string, sectionId: string) => () => void;
  onTogglePermissions: (subjectId: string, section: Section, label: string) => () => void;
  onAddSubSection: (subjectId: string, sectionId: string) => () => void;
  onSubSectionTitleChange: (
    subjectId: string,
    sectionId: string,
    subSectionId: string,
  ) => (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveSubSection: (subjectId: string, sectionId: string, subSectionId: string) => () => void;
  onSubSectionPermissions: (
    subjectId: string,
    sectionId: string,
    subSection: SubSection,
    label: string,
  ) => () => void;
}

export const SectionRow = ({
  subjectId,
  section,
  sectionIndex,
  activePermissionsId,
  sectionDrag,
  subSectionDrag,
  onTitleChange,
  onRemove,
  onTogglePermissions,
  onAddSubSection,
  onSubSectionTitleChange,
  onRemoveSubSection,
  onSubSectionPermissions,
}: SectionRowProps) => {
  const hasPerms =
    section.permissions.approvers.length > 0 || section.permissions.editors.length > 0;
  const isActive = activePermissionsId === section.id;

  return (
    <SectionBlock data-testid={TEMPLATE_MODAL_IDS.section(section.id)}>
      <SectionRowBox
        $isDragging={sectionDrag.draggedId === section.id}
        $isDragOver={sectionDrag.dragOverId === section.id}
        {...sectionDrag.getDropTargetProps(section.id)}
      >
        <DragHandle
          data-testid={TEMPLATE_MODAL_IDS.dragHandle(section.id)}
          {...sectionDrag.getDragHandleProps(section.id)}
        >
          <GripVertical size={12} />
        </DragHandle>
        <NodeIndex>{sectionIndex + 1}.</NodeIndex>
        <TitleInput
          value={section.title}
          onChange={onTitleChange(subjectId, section.id)}
          placeholder="שם הסעיף..."
          dir="rtl"
        />
        <SmallIconBtn
          type="button"
          data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(section.id)}
          $active={isActive}
          $muted={!hasPerms}
          onClick={onTogglePermissions(subjectId, section, `הרשאות סעיף ${sectionIndex + 1}`)}
        >
          <User size={12} />
        </SmallIconBtn>
        <SmallIconBtn type="button" onClick={onRemove(subjectId, section.id)}>
          <Trash2 size={12} />
        </SmallIconBtn>
      </SectionRowBox>

      {section.subSections.length > 0 && (
        <SubSectionsWrap>
          {section.subSections.map((subSection, subIndex) => {
            const subHasPerms =
              subSection.permissions.approvers.length > 0 ||
              subSection.permissions.editors.length > 0;
            const subIsActive = activePermissionsId === subSection.id;
            return (
              <SubSectionRowBox
                key={subSection.id}
                data-testid={TEMPLATE_MODAL_IDS.subSection(subSection.id)}
                $isDragging={subSectionDrag.draggedId === subSection.id}
                $isDragOver={subSectionDrag.dragOverId === subSection.id}
                {...subSectionDrag.getDropTargetProps(subSection.id)}
              >
                <DragHandle
                  data-testid={TEMPLATE_MODAL_IDS.dragHandle(subSection.id)}
                  {...subSectionDrag.getDragHandleProps(subSection.id)}
                >
                  <GripVertical size={11} />
                </DragHandle>
                <NodeIndex>{HE_ALPHA[subIndex]}.</NodeIndex>
                <TitleInput
                  value={subSection.title}
                  onChange={onSubSectionTitleChange(subjectId, section.id, subSection.id)}
                  placeholder="תת סעיף..."
                  dir="rtl"
                />
                <SmallIconBtn
                  type="button"
                  data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(subSection.id)}
                  $active={subIsActive}
                  $muted={!subHasPerms}
                  onClick={onSubSectionPermissions(
                    subjectId,
                    section.id,
                    subSection,
                    `הרשאות תת סעיף ${HE_ALPHA[subIndex]}`,
                  )}
                >
                  <User size={12} />
                </SmallIconBtn>
                <SmallIconBtn
                  type="button"
                  onClick={onRemoveSubSection(subjectId, section.id, subSection.id)}
                >
                  <Trash2 size={12} />
                </SmallIconBtn>
              </SubSectionRowBox>
            );
          })}
        </SubSectionsWrap>
      )}

      <AddChildLink type="button" onClick={onAddSubSection(subjectId, section.id)}>
        <Plus size={11} />
        תת סעיף
      </AddChildLink>
    </SectionBlock>
  );
};
