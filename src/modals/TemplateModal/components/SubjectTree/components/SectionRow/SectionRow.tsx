import { GripVertical, Plus, Trash2, User } from 'lucide-react';
import type { ChangeEvent } from 'react';
import type { useDragReorder } from '@/hooks/useDragReorder';
import type { Section, SubSection } from '../../../../TemplateModal.constants';
import { HE_ALPHA } from '../../../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../../../TemplateModal.testids';
import {
  AddChildLink,
  DragHandle,
  NodeIndex,
  SmallIconBtn,
  TitleInput,
} from '../../../TemplateModal.shared.styles';
import {
  SectionBlock,
  SectionRowBox,
  SubSectionRowBox,
  SubSectionsWrap,
} from './SectionRow.styles';

interface SectionRowProps {
  section: Section;
  sectionIndex: number;
  activePermissionsId: string | null;
  sectionDrag: ReturnType<typeof useDragReorder>;
  subSectionDrag: ReturnType<typeof useDragReorder>;
  onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
  onTogglePermissions: () => void;
  onAddSubSection: () => void;
  onSubSectionTitleChange: (subSectionId: string) => (e: ChangeEvent<HTMLInputElement>) => void;
  onRemoveSubSection: (subSectionId: string) => () => void;
  onSubSectionPermissions: (subSection: SubSection, label: string) => () => void;
}

export const SectionRow = ({
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
          onChange={onTitleChange}
          placeholder="שם הסעיף..."
          dir="rtl"
        />
        <SmallIconBtn
          type="button"
          data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(section.id)}
          $active={isActive}
          $muted={!hasPerms}
          onClick={onTogglePermissions}
        >
          <User size={12} />
        </SmallIconBtn>
        <SmallIconBtn type="button" onClick={onRemove}>
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
                  onChange={onSubSectionTitleChange(subSection.id)}
                  placeholder="תת סעיף..."
                  dir="rtl"
                />
                <SmallIconBtn
                  type="button"
                  data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(subSection.id)}
                  $active={subIsActive}
                  $muted={!subHasPerms}
                  onClick={onSubSectionPermissions(
                    subSection,
                    `הרשאות תת סעיף ${HE_ALPHA[subIndex]}`,
                  )}
                >
                  <User size={12} />
                </SmallIconBtn>
                <SmallIconBtn type="button" onClick={onRemoveSubSection(subSection.id)}>
                  <Trash2 size={12} />
                </SmallIconBtn>
              </SubSectionRowBox>
            );
          })}
        </SubSectionsWrap>
      )}

      <AddChildLink type="button" onClick={onAddSubSection}>
        <Plus size={11} />
        תת סעיף
      </AddChildLink>
    </SectionBlock>
  );
};
