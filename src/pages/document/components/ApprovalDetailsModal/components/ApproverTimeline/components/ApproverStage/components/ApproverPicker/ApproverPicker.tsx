import { Plus } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../../../../../ApprovalDetailsModal.testids';
import {
  AddLink,
  EmptyResult,
  Panel,
  ResultBtn,
  ResultList,
  SearchInput,
} from './ApproverPicker.styles';

const PANEL_WIDTH = 200;

export interface ApproverPickerProps {
  rank: string;
  /** Everyone who could approve, minus whoever is already on this rank. */
  options: string[];
  onPick: (user: string) => void;
}

/**
 * Adds a named approver to one rank of the round (main, Edit.tsx:2976-3001).
 *
 * Its own search rather than a shared multi-select: main puts this *inside* the
 * timeline, under the rank it adds to, so which rank is being filled is read
 * from where the popover is rather than from a label on it.
 */
export const ApproverPicker = ({ rank, options, onPick }: ApproverPickerProps) => {
  const panel = useFloatingPanel();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // `focusOnOpen` is for menus, which take focus themselves; this panel has a
  // search box, and focus belongs in it (see useFloatingPanel's options doc).
  useEffect(() => {
    if (panel.open) inputRef.current?.focus();
  }, [panel.open]);

  const handleToggle = () => {
    setQuery('');
    panel.toggle(PANEL_WIDTH);
  };

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value);

  const handlePick = (user: string) => () => {
    onPick(user);
    panel.close();
  };

  const matches = options.filter((user) => !query || user.includes(query));

  return (
    <>
      <AddLink
        ref={panel.btnRef}
        type="button"
        data-testid={APPROVAL_DETAILS_MODAL_IDS.addApprover(rank)}
        onClick={handleToggle}
      >
        <Plus size={10} aria-hidden="true" />
        גורם מאשר
      </AddLink>

      {panel.open && panel.pos && (
        <Panel
          ref={panel.panelRef}
          pos={panel.pos}
          width={PANEL_WIDTH}
          data-testid={APPROVAL_DETAILS_MODAL_IDS.approverPicker(rank)}
        >
          <SearchInput
            ref={inputRef}
            value={query}
            placeholder="חפש מאשר..."
            dir="rtl"
            aria-label={`חיפוש מאשר עבור ${rank}`}
            onChange={handleQueryChange}
          />
          <ResultList>
            {matches.length === 0 && <EmptyResult>אין מאשרים מתאימים</EmptyResult>}
            {matches.map((user) => (
              <ResultBtn
                key={user}
                type="button"
                data-testid={APPROVAL_DETAILS_MODAL_IDS.approverOption(rank, user)}
                onClick={handlePick(user)}
              >
                {user}
              </ResultBtn>
            ))}
          </ResultList>
        </Panel>
      )}
    </>
  );
};
