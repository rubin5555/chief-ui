import type { MouseEvent } from 'react';
import { SUB_SECTION_INDENT } from '../../DocumentOutlineTree.constants';
import { LinkRow, SectionLink, SubSectionLink } from './AddNodeLink.styles';
import { ADD_NODE_LINK_IDS } from './AddNodeLink.testids';

export interface AddNodeLinkProps {
  variant: 'section' | 'subSection';
  parentId: string;
  onClick: () => void;
}

const LABEL = {
  section: '+ הוספת סעיף',
  subSection: '+ תת סעיף',
};

export const AddNodeLink = ({ variant, parentId, onClick }: AddNodeLinkProps) => {
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
