import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useDocumentOverrides } from '../../hooks/useDocumentOverrides';
import type { useDocumentTrash } from '../../hooks/useDocumentTrash';
import type { Subject } from '../../types';
import { NodeTitleField } from '../NodeTitleField';
import { SectionBlock } from '../SectionBlock';
import { SubjectHeaderRow, SubjectRoot } from './SubjectBlock.styles';
import { SUBJECT_BLOCK_IDS } from './SubjectBlock.testids';

export interface SubjectBlockProps {
  subject: Subject;
  /**
   * This subject's first section's number. Section numbering runs continuously
   * across the whole document rather than restarting per subject (main's
   * `secCounter`, Edit.tsx:4390), so a subject can't work it out alone.
   */
  firstSectionNumber: number;
  /** Sections whose status is currently filtered out, by id. */
  filteredSectionIds: Set<string>;
  tree: ReturnType<typeof useDocumentTree>;
  overrides: ReturnType<typeof useDocumentOverrides>;
  trash: ReturnType<typeof useDocumentTrash>;
}

// One topic in the paper: its editable heading, then its sections.
//
// `tree`/`overrides`/`trash` pass through as whole hook objects. Each block level
// calls them with the ids it already knows from rendering that node, which is
// what let the seven curried handler factories DocumentCanvas used to own
// disappear entirely — see .claude/skills/react-engineering.md's "Shrink Prop
// Lists".
export const SubjectBlock = ({
  subject,
  firstSectionNumber,
  filteredSectionIds,
  tree,
  overrides,
  trash,
}: SubjectBlockProps) => {
  const handleTitleChange = (title: string) => tree.updateSubjectTitle(subject.id, title);

  return (
    <SubjectRoot data-testid={SUBJECT_BLOCK_IDS.root(subject.id)}>
      <SubjectHeaderRow>
        <NodeTitleField
          nodeId={subject.id}
          variant="subject"
          value={subject.title}
          onChange={handleTitleChange}
        />
      </SubjectHeaderRow>

      {subject.sections.map((section, sectionIndex) =>
        filteredSectionIds.has(section.id) ? null : (
          <SectionBlock
            key={section.id}
            subjectId={subject.id}
            section={section}
            // Numbered by position in the document, not position in what's
            // currently visible — a filter hides sections, it doesn't renumber
            // the ones that remain.
            number={firstSectionNumber + sectionIndex}
            filteredSectionIds={filteredSectionIds}
            tree={tree}
            overrides={overrides}
            trash={trash}
          />
        ),
      )}
    </SubjectRoot>
  );
};
