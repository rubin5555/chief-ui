import { ChevronDown } from 'lucide-react';
import type { HmlGroupDto } from '@/api/approvals';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { APPROVAL_DETAILS_MODAL_IDS } from '../../ApprovalDetailsModal.testids';
import { HmlGroupRow } from './components/HmlGroupRow';
import { Chevron, DoneBtn, Panel, PanelFooter, Trigger } from './HmlSelect.styles';

export interface HmlSelectProps {
  groups: HmlGroupDto[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
}

export const HmlSelect = ({ groups, selectedIds, onChange }: HmlSelectProps) => {
  const panel = useFloatingPanel({ focusOnOpen: true });

  const handleToggle = () => panel.toggle((rect) => ({ top: rect.bottom + 4, left: rect.left }));

  const handleToggleGroup = (id: string) =>
    onChange(
      selectedIds.includes(id)
        ? selectedIds.filter((candidate) => candidate !== id)
        : [...selectedIds, id],
    );

  const triggerWidth = panel.btnRef.current?.offsetWidth;
  const label = selectedIds.length > 0 ? `נבחרו ${selectedIds.length} חמ״לים` : 'בחר חמ״לים';

  return (
    <>
      <Trigger
        ref={panel.btnRef}
        type="button"
        aria-expanded={panel.open}
        $isPlaceholder={selectedIds.length === 0}
        data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlSelect}
        onClick={handleToggle}
      >
        <Chevron $open={panel.open}>
          <ChevronDown size={14} aria-hidden="true" />
        </Chevron>
        <span>{label}</span>
      </Trigger>

      {panel.open && panel.pos && (
        <Panel
          ref={panel.panelRef}
          pos={panel.pos}
          width={triggerWidth}
          data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlPanel}
        >
          {groups.map((group) => (
            <HmlGroupRow
              key={group.id}
              group={group}
              isSelected={selectedIds.includes(group.id)}
              onToggle={handleToggleGroup}
            />
          ))}

          <PanelFooter>
            <DoneBtn
              type="button"
              data-testid={APPROVAL_DETAILS_MODAL_IDS.hmlDone}
              onClick={panel.close}
            >
              הוסף
            </DoneBtn>
          </PanelFooter>
        </Panel>
      )}
    </>
  );
};
