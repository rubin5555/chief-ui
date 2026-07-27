import type { MouseEvent } from 'react';
import { SUB_SECTION_INDENT } from '../../DocumentOutlineTree.constants';
import { LinkRow, SectionLink, SubSectionLink } from './AddNodeLink.styles';
import { ADD_NODE_LINK_IDS } from './AddNodeLink.testids';

export interface AddNodeLinkProps {
  variant: 'section' | 'subSection';
  /** The node the new one lands under — a subject for `section`, a section for `subSection`. */
  parentId: string;
  onClick: () => void;
}

const LABEL = {
  section: '+ הוספת סעיף',
  subSection: '+ תת סעיף',
};

// The text links at the end of each level's list (main, Edit.tsx:4046 and 4057).
//
// A section link sits flush with the sections above it — its list is already
// indented — while a sub-section link has to step in by itself to line up with the
// sub-rows it adds to.
export const AddNodeLink = ({ variant, parentId, onClick }: AddNodeLinkProps) => {
  // Every ancestor row is click-to-expand, so without this, adding a section
  // inside a topic would also collapse the topic.
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };

  const isSection = variant === 'section';
  const Link = isSection ? SectionLink : SubSectionLink;
  const testId = isSection
    ? ADD_NODE_LINK_IDS.addSection(parentId)
    : ADD_NODE_LINK_IDS.addSubSection(parentId);

  return (
    <LinkRow $indent={isSection ? 0 : SUB_SECTION_INDENT}>
      <Link type="button" data-testid={testId} onClick={handleClick}>
        {LABEL[variant]}
      </Link>
    </LinkRow>
  );
};
