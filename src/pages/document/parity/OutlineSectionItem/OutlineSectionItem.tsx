import { ChevronLeft } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import { Chevron, ChevronSpacer, RenameInput, Row, RowTitle } from './OutlineSectionItem.styles';
import { OUTLINE_SECTION_ITEM_IDS } from './OutlineSectionItem.testids';
import type { OutlineNode } from './outlineSectionItem.types';

export interface OutlineSectionItemProps {
  node: OutlineNode;
  depth?: number;
  isEditing?: boolean;
  onSave?: (title: string) => void;
}

/** Focus lands on the field the moment it appears, without an effect to place it. */
const focusOnMount = (element: HTMLInputElement | null) => element?.focus();

// main's outline row (Edit.tsx:2020-2070), and the only self-recursive component
// in the file: a row renders its own children at depth + 1.
//
// The live tree is three explicit components — OutlineSubjectRow, OutlineSectionRow,
// OutlineSubSectionRow — because the three levels genuinely differ: only the first
// takes a drop from another subject, only the last is lettered, and each offers a
// different menu. Recursion buys uniformity the data doesn't have.
export const OutlineSectionItem = ({
  node,
  depth = 0,
  isEditing = false,
  onSave,
}: OutlineSectionItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState(node.title);
  const hasChildren = !!node.children?.length;

  const commit = () => onSave?.(draft.trim());

  const handleRowClick = () => {
    if (isEditing || !hasChildren) return;
    setIsOpen((open) => !open);
  };

  const handleDraftChange = (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value);

  // Enter commits, Escape reports an empty title — main's signal to the parent
  // that a row created for renaming should be dropped again.
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit();
    }
    if (event.key === 'Escape') onSave?.('');
  };

  return (
    <div>
      <Row
        $depth={depth}
        onClick={handleRowClick}
        data-testid={OUTLINE_SECTION_ITEM_IDS.row(node.id)}
      >
        {hasChildren ? (
          <Chevron $open={isOpen}>
            <ChevronLeft size={12} aria-hidden="true" />
          </Chevron>
        ) : (
          <ChevronSpacer />
        )}

        {isEditing ? (
          <RenameInput
            ref={focusOnMount}
            value={draft}
            placeholder="שם הנושא..."
            aria-label="שם הנושא"
            onChange={handleDraftChange}
            onBlur={commit}
            onKeyDown={handleKeyDown}
            data-testid={OUTLINE_SECTION_ITEM_IDS.renameInput(node.id)}
          />
        ) : (
          <RowTitle>{node.title}</RowTitle>
        )}
      </Row>

      {hasChildren &&
        isOpen &&
        node.children?.map((child) => (
          <OutlineSectionItem key={child.id} node={child} depth={depth + 1} />
        ))}
    </div>
  );
};
