import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { SECTION_STATUS_COLOR } from '../../document.constants';
import type { SectionMetaMap, Subject } from '../../types';
import {
  ChevronSlot,
  SectionList,
  SectionRow,
  StatusDot,
  SubjectLabel,
  SubjectRow,
  TreeRoot,
} from './DocumentOutlineTree.styles';
import { DOCUMENT_OUTLINE_TREE_IDS } from './DocumentOutlineTree.testids';

export interface DocumentOutlineTreeProps {
  subjects: Subject[];
  sectionMeta: SectionMetaMap;
}

// Read-only outline for Phase 1 — expand/collapse only, no drag/rename yet
// (that lands once DocumentOutlineTree grows a `tree: DocumentTreeApi` prop
// and adopts useDragReorder, mirroring TemplateModal's SubjectTree).
export const DocumentOutlineTree = ({ subjects, sectionMeta }: DocumentOutlineTreeProps) => {
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    () => new Set(subjects.map((subject) => subject.id)),
  );

  const handleToggleSubject = (subjectId: string) => () =>
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) next.delete(subjectId);
      else next.add(subjectId);
      return next;
    });

  return (
    <TreeRoot data-testid={DOCUMENT_OUTLINE_TREE_IDS.root}>
      {subjects.map((subject) => {
        const isExpanded = expandedSubjects.has(subject.id);
        const subjectStatus = sectionMeta[subject.id]?.status ?? 'idle';

        return (
          <div key={subject.id} data-testid={DOCUMENT_OUTLINE_TREE_IDS.subject(subject.id)}>
            <SubjectRow
              type="button"
              data-testid={DOCUMENT_OUTLINE_TREE_IDS.subjectToggle(subject.id)}
              onClick={handleToggleSubject(subject.id)}
            >
              <ChevronSlot $expanded={isExpanded}>
                <ChevronDown size={14} />
              </ChevronSlot>
              <StatusDot $color={SECTION_STATUS_COLOR[subjectStatus]} />
              <SubjectLabel>{subject.title || 'נושא ללא שם'}</SubjectLabel>
            </SubjectRow>

            {isExpanded && subject.sections.length > 0 && (
              <SectionList>
                {subject.sections.map((section) => {
                  const sectionStatus = sectionMeta[section.id]?.status ?? 'idle';
                  return (
                    <SectionRow
                      key={section.id}
                      data-testid={DOCUMENT_OUTLINE_TREE_IDS.section(section.id)}
                    >
                      <StatusDot $color={SECTION_STATUS_COLOR[sectionStatus]} />
                      {section.title || 'סעיף ללא שם'}
                    </SectionRow>
                  );
                })}
              </SectionList>
            )}
          </div>
        );
      })}
    </TreeRoot>
  );
};
