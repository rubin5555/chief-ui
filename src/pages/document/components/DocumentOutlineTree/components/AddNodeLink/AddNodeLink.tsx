import type { MouseEvent } from 'react';
import { appendTargetId } from '@/hooks/useDragReorder';
import { SUB_SECTION_INDENT } from '../../DocumentOutlineTree.constants';
import type { OutlineDragApi } from '../../DocumentOutlineTree.types';
import { LinkRow, SectionLink, SubSectionLink } from './AddNodeLink.styles';
import { ADD_NODE_LINK_IDS } from './AddNodeLink.testids';

export interface AddNodeLinkProps {
  variant: 'section' | 'subSection';
  parentId: string;
  drag: OutlineDragApi;
  onClick: () => void;
}

const LABEL = {
  section: '+ הוספת סעיף',
  subSection: '+ תת סעיף',
};

export const AddNodeLink = ({ variant, parentId, drag, onClick }: AddNodeLinkProps) => {
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    onClick();
  };

  const isSection = variant === 'section';
  const Link = isSection ? SectionLink : SubSectionLink;
  const testId = isSection
    ? ADD_NODE_LINK_IDS.addSection(parentId)
    : ADD_NODE_LINK_IDS.addSubSection(parentId);

  // The row stands for the end of the list it closes, so a node dropped on it
  // goes last rather than before whichever sibling it happened to land near.
  const level = isSection ? drag.sections : drag.subSections;
  const target = appendTargetId(parentId);

  return (
    <LinkRow
      $indent={isSection ? 0 : SUB_SECTION_INDENT}
      $dropActive={level.dragOverId === target}
      {...level.getDropTargetProps(target)}
    >
      <Link type="button" data-testid={testId} onClick={handleClick}>
        {LABEL[variant]}
      </Link>
    </LinkRow>
  );
};
