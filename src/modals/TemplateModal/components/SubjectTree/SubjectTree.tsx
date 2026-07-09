import { GripVertical, Plus, Trash2, User } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useDragReorder } from '@/hooks/useDragReorder';
import type {
  DocumentTreeApi,
  PermissionsTarget,
  Section,
  SubSection,
} from '../../TemplateModal.constants';
import { HE_ALPHA } from '../../TemplateModal.constants';
import {
  AddChildLink,
  AddNodeButton,
  DragHandle,
  NodeIndex,
  SectionBlock,
  SectionRowBox,
  SectionsList,
  SmallIconBtn,
  SubjectCard,
  SubjectDot,
  SubjectHeader,
  SubSectionRowBox,
  SubSectionsWrap,
  TitleInput,
} from '../../TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';

interface SubjectTreeProps {
  tree: DocumentTreeApi;
  activePermissionsId: string | null;
  onTogglePermissions: (target: PermissionsTarget) => void;
  onSubjectAdded: () => void;
  onSectionAdded: () => void;
  onSubSectionAdded: () => void;
}

export const SubjectTree = ({
  tree,
  activePermissionsId,
  onTogglePermissions,
  onSubjectAdded,
  onSectionAdded,
  onSubSectionAdded,
}: SubjectTreeProps) => {
  const subjectDrag = useDragReorder(tree.reorderSubjects);
  const sectionDrag = useDragReorder(tree.reorderSections);
  const subSectionDrag = useDragReorder(tree.reorderSubSections);

  const handleAddSubject = () => {
    tree.addSubject();
    onSubjectAdded();
  };

  const handleAddSection = (subjectId: string) => () => {
    tree.addSection(subjectId);
    onSectionAdded();
  };

  const handleAddSubSection = (subjectId: string, sectionId: string) => () => {
    tree.addSubSection(subjectId, sectionId);
    onSubSectionAdded();
  };

  const handleSubjectTitleChange = (subjectId: string) => (e: ChangeEvent<HTMLInputElement>) =>
    tree.updateSubjectTitle(subjectId, e.target.value);

  const handleRemoveSubject = (subjectId: string) => () => tree.removeSubject(subjectId);

  const handleSectionTitleChange =
    (subjectId: string, sectionId: string) => (e: ChangeEvent<HTMLInputElement>) =>
      tree.updateSectionTitle(subjectId, sectionId, e.target.value);

  const handleRemoveSection = (subjectId: string, sectionId: string) => () =>
    tree.removeSection(subjectId, sectionId);

  const handleSectionPermissions = (subjectId: string, section: Section, label: string) => () =>
    onTogglePermissions({
      id: section.id,
      label,
      permissions: section.permissions,
      onChangeApprovers: (v) =>
        tree.updateSectionPermissions(subjectId, section.id, {
          ...section.permissions,
          approvers: v,
        }),
      onChangeEditors: (v) =>
        tree.updateSectionPermissions(subjectId, section.id, {
          ...section.permissions,
          editors: v,
        }),
    });

  const handleSubSectionTitleChange =
    (subjectId: string, sectionId: string, subSectionId: string) =>
    (e: ChangeEvent<HTMLInputElement>) =>
      tree.updateSubSectionTitle(subjectId, sectionId, subSectionId, e.target.value);

  const handleRemoveSubSection =
    (subjectId: string, sectionId: string, subSectionId: string) => () =>
      tree.removeSubSection(subjectId, sectionId, subSectionId);

  const handleSubSectionPermissions =
    (subjectId: string, sectionId: string, subSection: SubSection, label: string) => () =>
      onTogglePermissions({
        id: subSection.id,
        label,
        permissions: subSection.permissions,
        onChangeApprovers: (v) =>
          tree.updateSubSectionPermissions(subjectId, sectionId, subSection.id, {
            ...subSection.permissions,
            approvers: v,
          }),
        onChangeEditors: (v) =>
          tree.updateSubSectionPermissions(subjectId, sectionId, subSection.id, {
            ...subSection.permissions,
            editors: v,
          }),
      });

  return (
    <>
      <AddNodeButton
        type="button"
        data-testid={TEMPLATE_MODAL_IDS.addSubjectBtn}
        onClick={handleAddSubject}
      >
        <Plus size={14} />
        הוספת נושא
      </AddNodeButton>

      {tree.subjects.map((subject, subjectIndex) => (
        <SubjectCard
          key={subject.id}
          data-testid={TEMPLATE_MODAL_IDS.subject(subject.id)}
          $isDragging={subjectDrag.draggedId === subject.id}
          $isDragOver={subjectDrag.dragOverId === subject.id}
          {...subjectDrag.getDropTargetProps(subject.id)}
        >
          <SubjectHeader>
            <DragHandle
              data-testid={TEMPLATE_MODAL_IDS.dragHandle(subject.id)}
              {...subjectDrag.getDragHandleProps(subject.id)}
            >
              <GripVertical size={12} />
            </DragHandle>
            <SubjectDot />
            <TitleInput
              value={subject.title}
              onChange={handleSubjectTitleChange(subject.id)}
              placeholder={`נושא ${subjectIndex + 1}...`}
              dir="rtl"
            />
            <SmallIconBtn type="button" onClick={handleRemoveSubject(subject.id)}>
              <Trash2 size={12} />
            </SmallIconBtn>
          </SubjectHeader>

          <SectionsList>
            {subject.sections.map((section, sectionIndex) => {
              const hasPerms =
                section.permissions.approvers.length > 0 || section.permissions.editors.length > 0;
              const isActive = activePermissionsId === section.id;
              return (
                <SectionBlock key={section.id} data-testid={TEMPLATE_MODAL_IDS.section(section.id)}>
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
                      onChange={handleSectionTitleChange(subject.id, section.id)}
                      placeholder="שם הסעיף..."
                      dir="rtl"
                    />
                    <SmallIconBtn
                      type="button"
                      data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(section.id)}
                      $active={isActive}
                      $muted={!hasPerms}
                      onClick={handleSectionPermissions(
                        subject.id,
                        section,
                        `הרשאות סעיף ${sectionIndex + 1}`,
                      )}
                    >
                      <User size={12} />
                    </SmallIconBtn>
                    <SmallIconBtn
                      type="button"
                      onClick={handleRemoveSection(subject.id, section.id)}
                    >
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
                              onChange={handleSubSectionTitleChange(
                                subject.id,
                                section.id,
                                subSection.id,
                              )}
                              placeholder="תת סעיף..."
                              dir="rtl"
                            />
                            <SmallIconBtn
                              type="button"
                              data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(subSection.id)}
                              $active={subIsActive}
                              $muted={!subHasPerms}
                              onClick={handleSubSectionPermissions(
                                subject.id,
                                section.id,
                                subSection,
                                `הרשאות תת סעיף ${HE_ALPHA[subIndex]}`,
                              )}
                            >
                              <User size={12} />
                            </SmallIconBtn>
                            <SmallIconBtn
                              type="button"
                              onClick={handleRemoveSubSection(
                                subject.id,
                                section.id,
                                subSection.id,
                              )}
                            >
                              <Trash2 size={12} />
                            </SmallIconBtn>
                          </SubSectionRowBox>
                        );
                      })}
                    </SubSectionsWrap>
                  )}

                  <AddChildLink type="button" onClick={handleAddSubSection(subject.id, section.id)}>
                    <Plus size={11} />
                    תת סעיף
                  </AddChildLink>
                </SectionBlock>
              );
            })}

            <AddChildLink type="button" onClick={handleAddSection(subject.id)}>
              <Plus size={12} />
              הוספת סעיף
            </AddChildLink>
          </SectionsList>
        </SubjectCard>
      ))}
    </>
  );
};
