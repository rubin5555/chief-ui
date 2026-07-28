import { MoreVertical } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { NodePermissions } from '../../types';
import { ACTION_ICON_SIZE, ActionBtn, type ActionTone } from '../NodeActionRow';
import { SectionMenuActions } from './components/SectionMenuActions';
import type { PermissionRole } from './components/SectionPermissionsView';
import { SectionPermissionsView } from './components/SectionPermissionsView';
import { useSectionMenuAnalytics } from './SectionMenu.analytics';
import { SECTION_MENU_IDS } from './SectionMenu.testids';

const ClassifiedViewersModal = lazy(() =>
  import('../ClassifiedViewersModal').then((m) => ({ default: m.ClassifiedViewersModal })),
);
const SectionInstructionsModal = lazy(() =>
  import('./components/SectionInstructionsModal').then((m) => ({
    default: m.SectionInstructionsModal,
  })),
);

const PANEL_WIDTH = 220;

export interface SectionMenuProps {
  sectionId: string;
  sectionTitle: string;
  instructions: string;
  tone?: ActionTone;
  permissions: NodePermissions;
  isHidden: boolean;
  classificationLevel: string | null;
  classificationViewerIds: string[];
  onChangePermissions: (role: PermissionRole, value: string[]) => void;
  onToggleHidden: () => void;
  onToggleClassified: () => void;
  onChangeClassificationViewers: (ids: string[]) => void;
  onChangeInstructions: (instructions: string) => void;
  onAddFootnote: () => void;
  onDelete: () => void;
}

// A node's 3-dots menu: its own trigger, its popover, the two modals its actions
// open, and which of its two views is showing. The views are under components/.
export const SectionMenu = ({
  sectionId,
  sectionTitle,
  instructions,
  tone = 'default',
  permissions,
  isHidden,
  classificationLevel,
  classificationViewerIds,
  onChangePermissions,
  onToggleHidden,
  onToggleClassified,
  onChangeClassificationViewers,
  onChangeInstructions,
  onAddFootnote,
  onDelete,
}: SectionMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>();
  const [view, setView] = useState<'actions' | 'permissions'>('actions');
  const [activeRole, setActiveRole] = useState<PermissionRole>('approvers');
  const [showClassifiedViewers, setShowClassifiedViewers] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const {
    trackHiddenToggled,
    trackClassifiedToggled,
    trackInstructionsSaved,
    trackFootnoteAdded,
    trackSectionDeleted,
  } = useSectionMenuAnalytics();

  const isClassified = classificationLevel !== null;

  // Reopening always lands on the actions: the permissions view is somewhere you
  // went, not a state the menu should remember being in.
  const handleToggle = () => {
    panel.toggle(PANEL_WIDTH);
    setView('actions');
  };

  const handleOpenPermissions = (role: PermissionRole) => () => {
    setActiveRole(role);
    setView('permissions');
  };

  const handleBackToActions = () => setView('actions');
  const handlePermissionsChange = (value: string[]) => onChangePermissions(activeRole, value);

  const handleToggleHidden = () => {
    trackHiddenToggled(!isHidden);
    onToggleHidden();
    panel.close();
  };

  // Turning classification on opens the viewers picker straight away: a section
  // nobody may see is not a useful state to leave behind.
  const handleToggleClassified = () => {
    const turningOn = !isClassified;
    trackClassifiedToggled(turningOn);
    onToggleClassified();
    panel.close();
    if (turningOn) setShowClassifiedViewers(true);
  };

  const handleOpenInstructions = () => {
    panel.close();
    setShowInstructions(true);
  };

  const handleAddFootnote = () => {
    trackFootnoteAdded();
    onAddFootnote();
    panel.close();
  };

  const handleDelete = () => {
    trackSectionDeleted();
    onDelete();
    panel.close();
  };

  const handleCloseClassifiedViewers = () => setShowClassifiedViewers(false);
  const handleCloseInstructions = () => setShowInstructions(false);

  const handleSaveInstructions = (instructions: string) => {
    trackInstructionsSaved();
    onChangeInstructions(instructions);
  };

  return (
    <>
      {/* NodeActionRow's own button — this is the last control on that row, and has
          to match the ones before it. */}
      <ActionBtn
        ref={panel.btnRef}
        type="button"
        $tone={tone}
        $active={panel.open}
        title="אפשרויות"
        aria-label="אפשרויות סעיף"
        data-testid={SECTION_MENU_IDS.trigger(sectionId)}
        onClick={handleToggle}
      >
        <MoreVertical size={ACTION_ICON_SIZE} aria-hidden="true" />
      </ActionBtn>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
          data-testid={SECTION_MENU_IDS.panel(sectionId)}
        >
          {view === 'actions' ? (
            <SectionMenuActions
              isHidden={isHidden}
              isClassified={isClassified}
              onOpenApprovers={handleOpenPermissions('approvers')}
              onOpenEditors={handleOpenPermissions('editors')}
              onToggleHidden={handleToggleHidden}
              onToggleClassified={handleToggleClassified}
              onOpenInstructions={handleOpenInstructions}
              onAddFootnote={handleAddFootnote}
              onDelete={handleDelete}
            />
          ) : (
            <SectionPermissionsView
              permissions={permissions}
              activeRole={activeRole}
              onRoleChange={setActiveRole}
              onChange={handlePermissionsChange}
              onBack={handleBackToActions}
            />
          )}
        </FloatingPanel>
      )}

      <Suspense fallback={null}>
        {showClassifiedViewers && (
          <ClassifiedViewersModal
            selectedIds={classificationViewerIds}
            onChange={onChangeClassificationViewers}
            onClose={handleCloseClassifiedViewers}
          />
        )}

        {showInstructions && (
          <SectionInstructionsModal
            sectionTitle={sectionTitle}
            instructions={instructions}
            onSave={handleSaveInstructions}
            onClose={handleCloseInstructions}
          />
        )}
      </Suspense>
    </>
  );
};
