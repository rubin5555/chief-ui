import { GripVertical, Plus, Trash2 } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { appendTargetId, parseAppendTarget, useDragReorder } from '@/hooks/useDragReorder';
import { radii } from '@/styles/theme';
import type {
  DocumentTreeApi,
  PermissionsTarget,
  Section,
  SubSection,
} from '../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import {
  AddChildLink,
  AddNodeButton,
  AdoptZone,
  DragHandle,
  SmallIconBtn,
  TitleInput,
} from '../TemplateModal.shared.styles';
import { SectionRow } from './components/SectionRow';
import { SectionsList, SubjectCard, SubjectDot, SubjectHeader } from './SubjectTree.styles';

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

  // A drop on an "add" link names the parent whose list it closes, and asks for
  // the end of that list rather than a place before one of its nodes.
  const sectionDrag = useDragReorder((draggedId, targetId) => {
    const appendTo = parseAppendTarget(targetId);
    tree.moveSection(draggedId, appendTo ?? targetId, appendTo ? 'end' : 'before');
  });
  const subSectionDrag = useDragReorder((draggedId, targetId) => {
    const appendTo = parseAppendTarget(targetId);
    tree.moveSubSection(draggedId, appendTo ?? targetId, appendTo ? 'end' : 'before');
  });

  const handleAddSubject = () => {
    tree.addSubject();
    onSubjectAdded();
  };

  const handleAddSection = (subjectId: string) => () => {
    tree.addSection(subjectId);
    onSectionAdded();
  };

  const handleSubjectTitleChange = (subjectId: string) => (e: ChangeEvent<HTMLInputElement>) =>
    tree.updateSubjectTitle(subjectId, e.target.value);

  const handleRemoveSubject = (subjectId: string) => () => tree.removeSubject(subjectId);

  const handleSectionTitleChange =
    (subjectId: string, sectionId: string) => (e: ChangeEvent<HTMLInputElement>) =>
      tree.updateSectionTitle(subjectId, sectionId, e.target.value);

  const handleRemoveSection = (subjectId: string, sectionId: string) => () =>
    tree.removeSection(subjectId, sectionId);

  const handleSectionPermissions =
    (subjectId: string, section: Section, sectionIndex: number) => () =>
      onTogglePermissions({
        id: section.id,
        label: `הרשאות סעיף ${sectionIndex + 1}`,
        permissions: section.permissions,
        onChangeApprovers: (approvers: string[]) =>
          tree.updateSectionPermissions(subjectId, section.id, {
            ...section.permissions,
            approvers,
          }),
        onChangeEditors: (editors: string[]) =>
          tree.updateSectionPermissions(subjectId, section.id, {
            ...section.permissions,
            editors,
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

      {tree.subjects.map((subject, subjectIndex) => {
        const onSubSectionAdd = (sectionId: string) => () => {
          tree.addSubSection(subject.id, sectionId);
          onSubSectionAdded();
        };
        const onSubSectionTitleChange =
          (sectionId: string) => (subSectionId: string) => (e: ChangeEvent<HTMLInputElement>) =>
            tree.updateSubSectionTitle(subject.id, sectionId, subSectionId, e.target.value);
        const onRemoveSubSection = (sectionId: string) => (subSectionId: string) => () =>
          tree.removeSubSection(subject.id, sectionId, subSectionId);
        const onSubSectionPermissions =
          (sectionId: string) => (subSection: SubSection, label: string) => () =>
            onTogglePermissions({
              id: subSection.id,
              label,
              permissions: subSection.permissions,
              onChangeApprovers: (v) =>
                tree.updateSubSectionPermissions(subject.id, sectionId, subSection.id, {
                  ...subSection.permissions,
                  approvers: v,
                }),
              onChangeEditors: (v) =>
                tree.updateSubSectionPermissions(subject.id, sectionId, subSection.id, {
                  ...subSection.permissions,
                  editors: v,
                }),
            });

        return (
          <SubjectCard
            key={subject.id}
            data-testid={TEMPLATE_MODAL_IDS.subject(subject.id)}
            $isDragging={subjectDrag.draggedId === subject.id}
            $isDragOver={subjectDrag.dragOverId === subject.id}
            $isSettling={subjectDrag.settledId === subject.id}
            {...subjectDrag.getDropTargetProps(subject.id)}
          >
            <AdoptZone
              $active={sectionDrag.dragOverId === subject.id}
              $radius={radii.xl}
              {...sectionDrag.getDropTargetProps(subject.id)}
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
                    section={section}
                    sectionIndex={sectionIndex}
                    activePermissionsId={activePermissionsId}
                    sectionDrag={sectionDrag}
                    subSectionDrag={subSectionDrag}
                    onTitleChange={handleSectionTitleChange(subject.id, section.id)}
                    onRemove={handleRemoveSection(subject.id, section.id)}
                    onTogglePermissions={handleSectionPermissions(
                      subject.id,
                      section,
                      sectionIndex,
                    )}
                    onAddSubSection={onSubSectionAdd(section.id)}
                    onSubSectionTitleChange={onSubSectionTitleChange(section.id)}
                    onRemoveSubSection={onRemoveSubSection(section.id)}
                    onSubSectionPermissions={onSubSectionPermissions(section.id)}
                  />
                ))}

                <AddChildLink
                  type="button"
                  $dropActive={sectionDrag.dragOverId === appendTargetId(subject.id)}
                  onClick={handleAddSection(subject.id)}
                  {...sectionDrag.getDropTargetProps(appendTargetId(subject.id))}
                >
                  <Plus size={12} />
                  הוספת סעיף
                </AddChildLink>
              </SectionsList>
            </AdoptZone>
          </SubjectCard>
        );
      })}
    </>
  );
};
