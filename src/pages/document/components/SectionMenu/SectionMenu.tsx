import { MoreVertical } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { SECTION_PERMISSION_LEVEL_IDS, useDocPermissions } from '../DocPermissionsModal';
import { ACTION_ICON_SIZE, ActionBtn, type ActionTone } from '../NodeActionRow';
import { SectionMenuActions } from './components/SectionMenuActions';
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
  /**
   * Which section the מאשרי/עורכי actions land on, when that isn't the node the
   * menu is attached to. A sub-section passes its parent: those two permissions
   * are granted per *section*, so the tree they open has no row of its own to
   * select, and preselecting the sub-section's id selects nothing at all.
   */
  permissionSectionId?: string;
  sectionTitle: string;
  instructions: string;
  tone?: ActionTone;
  isHidden: boolean;
  classificationLevel: string | null;
  classificationViewerIds: string[];
  onToggleHidden: () => void;
  onToggleClassified: () => void;
  onChangeClassificationViewers: (ids: string[]) => void;
  onChangeInstructions: (instructions: string) => void;
  onAddFootnote: () => void;
  onDelete: () => void;
}

/**
 * A node's 3-dots menu: its own trigger, its popover, and the two modals its
 * actions open.
 *
 * מאשרי הסעיף and עורכי הסעיף open the document permissions dialog on the matching
 * permission with this section already selected — a sub-section's menu selects the
 * section it belongs to, since that is the level the permission exists at (see
 * `permissionSectionId`) — rather than editing the section's approvers here. That is main's routing (its `permTrigger`, TopNavbar.tsx:1093),
 * and it is the honest one: those two permissions are granted per section but held
 * document-wide, so a per-section editor can only ever show a slice of them.
 */
export const SectionMenu = ({
  sectionId,
  permissionSectionId,
  sectionTitle,
  instructions,
  tone = 'default',
  isHidden,
  classificationLevel,
  classificationViewerIds,
  onToggleHidden,
  onToggleClassified,
  onChangeClassificationViewers,
  onChangeInstructions,
  onAddFootnote,
  onDelete,
}: SectionMenuProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });
  const { openDocPermissions } = useDocPermissions();
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

  const handleToggle = () => panel.toggle(PANEL_WIDTH);

  // Closes the menu on the way: the dialog it opens is a full-screen one, and a
  // popover left standing behind an overlay is a popover nobody can reach.
  const handleOpenPermissions = (levelId: string) => () => {
    panel.close();
    openDocPermissions({ levelId, sectionId: permissionSectionId ?? sectionId });
  };

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
          pos={panel.pos}
          width={PANEL_WIDTH}
          data-testid={SECTION_MENU_IDS.panel(sectionId)}
        >
          <SectionMenuActions
            isHidden={isHidden}
            isClassified={isClassified}
            onOpenApprovers={handleOpenPermissions(SECTION_PERMISSION_LEVEL_IDS.approvers)}
            onOpenEditors={handleOpenPermissions(SECTION_PERMISSION_LEVEL_IDS.editors)}
            onToggleHidden={handleToggleHidden}
            onToggleClassified={handleToggleClassified}
            onOpenInstructions={handleOpenInstructions}
            onAddFootnote={handleAddFootnote}
            onDelete={handleDelete}
          />
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
