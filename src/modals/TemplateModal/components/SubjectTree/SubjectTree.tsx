import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useDragReorder } from '@/hooks/useDragReorder';
import type {
  DocumentTreeApi,
  PermissionsTarget,
  Section,
  SubSection,
} from '../../TemplateModal.constants';
import {
  AddChildLink,
  AddNodeButton,
  DragHandle,
  SectionsList,
  SmallIconBtn,
  SubjectCard,
  SubjectDot,
  SubjectHeader,
  TitleInput,
} from '../../TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import { SectionRow } from './components/SectionRow';

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
            {subject.sections.map((section, sectionIndex) => (
              <SectionRow
                key={section.id}
                subjectId={subject.id}
                section={section}
                sectionIndex={sectionIndex}
                activePermissionsId={activePermissionsId}
                sectionDrag={sectionDrag}
                subSectionDrag={subSectionDrag}
                onTitleChange={handleSectionTitleChange}
                onRemove={handleRemoveSection}
                onTogglePermissions={handleSectionPermissions}
                onAddSubSection={handleAddSubSection}
                onSubSectionTitleChange={handleSubSectionTitleChange}
                onRemoveSubSection={handleRemoveSubSection}
                onSubSectionPermissions={handleSubSectionPermissions}
              />
            ))}

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
