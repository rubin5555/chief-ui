import { X } from 'lucide-react';
import { useState } from 'react';
import type { Member } from '@/components/PeoplePicker';
import type { Subject } from '@/pages/document/types';
import { DOC_PERMISSIONS_MODAL_IDS } from '../../DocPermissionsModal.testids';
import {
  AssignedCell,
  AssignedHeadCell,
  AssignedList,
  AssignedRow,
  AssignedTable,
  Chevron,
  ClearButton,
  CountChevron,
  RemoveButton,
  RemoveCell,
  SectionCount,
  SectionIndex,
  SectionList,
  SectionRow,
  SectionTitle,
  SubjectRow,
  SubjectTitle,
  TreeBody,
  TreeHeader,
  TreeRoot,
  TreeTitle,
  UnassignedNotice,
} from './SectionAssignmentTree.styles';

interface SectionAssignmentTreeProps {
  subjects: Subject[];
  members: Member[];
  sectionsByMember: Record<string, string[]>;
  selectedSectionIds: string[];
  onToggleSection: (id: string) => void;
  onClearSections: () => void;
  onUnassign: (memberId: string, sectionId: string) => void;
}

export const SectionAssignmentTree = ({
  subjects,
  members,
  sectionsByMember,
  selectedSectionIds,
  onToggleSection,
  onClearSections,
  onUnassign,
}: SectionAssignmentTreeProps) => {
  const [openSubjects, setOpenSubjects] = useState<string[]>(() =>
    subjects
      .filter((subject) =>
        subject.sections.some((section) => selectedSectionIds.includes(section.id)),
      )
      .map((subject) => subject.id),
  );
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleOpen = (ids: string[], id: string) =>
    ids.includes(id) ? ids.filter((candidate) => candidate !== id) : [...ids, id];

  const handleSubjectClick = (id: string) => () => setOpenSubjects((prev) => toggleOpen(prev, id));
  const handleSectionClick = (id: string) => () => onToggleSection(id);
  const handleCountClick = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSections((prev) => toggleOpen(prev, id));
  };
  const handleUnassign = (memberId: string, sectionId: string) => () =>
    onUnassign(memberId, sectionId);

  const membersOf = (sectionId: string) =>
    members.filter((member) => (sectionsByMember[member.id] ?? []).includes(sectionId));

  const unassignedCount = members.filter(
    (member) => (sectionsByMember[member.id] ?? []).length === 0,
  ).length;

  return (
    <TreeRoot data-testid={DOC_PERMISSIONS_MODAL_IDS.sectionTree}>
      <TreeHeader>
        <TreeTitle>בחר סעיפים לשיוך</TreeTitle>
        {selectedSectionIds.length > 0 && (
          <ClearButton
            type="button"
            data-testid={DOC_PERMISSIONS_MODAL_IDS.clearSections}
            onClick={onClearSections}
          >
            {selectedSectionIds.length} נבחרו · נקה
          </ClearButton>
        )}
      </TreeHeader>

      <TreeBody>
        {subjects.map((subject) => {
          const isOpen = openSubjects.includes(subject.id);
          return (
            <div key={subject.id}>
              <SubjectRow
                type="button"
                aria-expanded={isOpen}
                data-testid={DOC_PERMISSIONS_MODAL_IDS.subjectRow(subject.id)}
                onClick={handleSubjectClick(subject.id)}
              >
                <Chevron size={14} $open={isOpen} aria-hidden="true" />
                <SubjectTitle>{subject.title}</SubjectTitle>
              </SubjectRow>

              {isOpen && (
                <SectionList>
                  {subject.sections.map((section, index) => {
                    const isSelected = selectedSectionIds.includes(section.id);
                    const assigned = membersOf(section.id);
                    const isListOpen = openSections.includes(section.id);
                    return (
                      <div key={section.id}>
                        <SectionRow
                          type="button"
                          $selected={isSelected}
                          aria-pressed={isSelected}
                          data-testid={DOC_PERMISSIONS_MODAL_IDS.sectionRow(section.id)}
                          onClick={handleSectionClick(section.id)}
                        >
                          <SectionIndex>{index + 1}.</SectionIndex>
                          <SectionTitle $selected={isSelected}>{section.title}</SectionTitle>
                          {assigned.length > 0 && (
                            <SectionCount
                              as="span"
                              role="button"
                              tabIndex={0}
                              aria-expanded={isListOpen}
                              $open={isListOpen}
                              data-testid={DOC_PERMISSIONS_MODAL_IDS.sectionMemberCount(section.id)}
                              onClick={handleCountClick(section.id)}
                            >
                              {assigned.length}
                              <CountChevron size={10} $open={isListOpen} aria-hidden="true" />
                            </SectionCount>
                          )}
                        </SectionRow>

                        {isListOpen && assigned.length > 0 && (
                          <AssignedList>
                            <AssignedTable dir="rtl">
                              <thead>
                                <tr>
                                  <AssignedHeadCell scope="col">שם מלא</AssignedHeadCell>
                                  <AssignedHeadCell scope="col">תעודת זהות</AssignedHeadCell>
                                  <AssignedHeadCell scope="col">ארגון</AssignedHeadCell>
                                  <AssignedHeadCell scope="col" $narrow aria-label="הסרה" />
                                </tr>
                              </thead>
                              <tbody>
                                {assigned.map((member) => (
                                  <AssignedRow key={member.id}>
                                    <AssignedCell>{member.name}</AssignedCell>
                                    <AssignedCell $muted $tabular>
                                      {member.idNumber}
                                    </AssignedCell>
                                    <AssignedCell $muted>{member.environment}</AssignedCell>
                                    <RemoveCell>
                                      <RemoveButton
                                        type="button"
                                        aria-label={`הסרת ${member.name} מהסעיף`}
                                        onClick={handleUnassign(member.id, section.id)}
                                      >
                                        <X size={12} />
                                      </RemoveButton>
                                    </RemoveCell>
                                  </AssignedRow>
                                ))}
                              </tbody>
                            </AssignedTable>
                          </AssignedList>
                        )}
                      </div>
                    );
                  })}
                </SectionList>
              )}
            </div>
          );
        })}

        {unassignedCount > 0 && (
          <UnassignedNotice data-testid={DOC_PERMISSIONS_MODAL_IDS.unassigned}>
            {unassignedCount} נבחרו ללא סעיף. בחר סעיפים ולאחר מכן הוסף אותם שוב.
          </UnassignedNotice>
        )}
      </TreeBody>
    </TreeRoot>
  );
};
