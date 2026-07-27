import {
  AlertCircle,
  ChevronRight,
  Eye,
  EyeOff,
  FileText,
  Lock,
  MoreVertical,
  Trash2,
  UserCheck,
  Users,
} from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { NETWORK_PEOPLE_FALLBACK, useNetworkPeople } from '@/api/networkPeople';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import type { NodePermissions } from '../../types';
import { ACTION_ICON_SIZE, type ActionTone, ActionBtn as RowActionBtn } from '../NodeActionRow';
import {
  ActionBtn,
  ActionList,
  BackBtn,
  BackLabel,
  BackRow,
  PermissionsView,
  Separator,
} from './SectionMenu.styles';
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

type PermissionRole = 'approvers' | 'editors';

const ROLE_TABS: UnderlineTab[] = [
  { id: 'approvers', label: 'מאשרי הסעיף' },
  { id: 'editors', label: 'עורכי הסעיף' },
];

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

// Owns its own trigger + dropdown (per .claude/skills/modal-placement.md)
// and, once classification is turned on, the viewers-picker modal it opens.
// Main's fake export-to-Word/Excel actions aren't ported — there's no real
// export capability yet to back them with.
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
  const { data } = useNetworkPeople();
  const peopleNames = (data ?? NETWORK_PEOPLE_FALLBACK.networkPeople).map((person) => person.name);

  const isClassified = classificationLevel !== null;

  const handleToggle = () => {
    panel.toggle(PANEL_WIDTH);
    setView('actions');
  };

  const handleOpenPermissions = (role: PermissionRole) => () => {
    setActiveRole(role);
    setView('permissions');
  };

  const handleBackToActions = () => setView('actions');
  const handleRoleChange = (id: string) => setActiveRole(id as PermissionRole);
  const handlePermissionsChange = (value: string[]) => onChangePermissions(activeRole, value);

  const handleToggleHidden = () => {
    onToggleHidden();
    panel.close();
  };

  const handleToggleClassified = () => {
    const turningOn = !isClassified;
    onToggleClassified();
    panel.close();
    if (turningOn) setShowClassifiedViewers(true);
  };

  const handleOpenInstructions = () => {
    panel.close();
    setShowInstructions(true);
  };

  const handleCloseInstructions = () => setShowInstructions(false);

  const handleAddFootnote = () => {
    onAddFootnote();
    panel.close();
  };

  const handleDelete = () => {
    onDelete();
    panel.close();
  };

  const handleCloseClassifiedViewers = () => setShowClassifiedViewers(false);

  return (
    <>
      {/* NodeActionRow's own button — this is the last control on that row, and
          has to match the ones before it. */}
      <RowActionBtn
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
      </RowActionBtn>

      {panel.open && panel.pos && (
        <FloatingPanel
          ref={panel.panelRef}
          $pos={panel.pos}
          $width={PANEL_WIDTH}
          data-testid={SECTION_MENU_IDS.panel(sectionId)}
        >
          {view === 'actions' ? (
            <ActionList>
              <ActionBtn
                type="button"
                onClick={handleOpenPermissions('approvers')}
                data-testid={SECTION_MENU_IDS.approversAction}
              >
                <UserCheck size={14} />
                מאשרי הסעיף
              </ActionBtn>
              <ActionBtn
                type="button"
                onClick={handleOpenPermissions('editors')}
                data-testid={SECTION_MENU_IDS.editorsAction}
              >
                <Users size={14} />
                עורכי הסעיף
              </ActionBtn>
              <Separator />
              <ActionBtn
                type="button"
                onClick={handleToggleHidden}
                data-testid={SECTION_MENU_IDS.toggleHiddenAction}
              >
                {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
                {isHidden ? 'הצגת סעיף' : 'הסתרת סעיף'}
              </ActionBtn>
              <ActionBtn
                type="button"
                onClick={handleToggleClassified}
                data-testid={SECTION_MENU_IDS.toggleClassifiedAction}
              >
                <Lock size={14} />
                {isClassified ? 'ביטול הגדרה כממודר' : 'הגדרה כסעיף ממודר'}
              </ActionBtn>
              <Separator />
              <ActionBtn
                type="button"
                onClick={handleOpenInstructions}
                data-testid={SECTION_MENU_IDS.instructionsAction}
              >
                <AlertCircle size={14} />
                הנחיות לסעיף
              </ActionBtn>
              <ActionBtn
                type="button"
                onClick={handleAddFootnote}
                data-testid={SECTION_MENU_IDS.addFootnoteAction}
              >
                <FileText size={14} />
                הוספת הערת שוליים
              </ActionBtn>
              <Separator />
              <ActionBtn
                type="button"
                $danger
                onClick={handleDelete}
                data-testid={SECTION_MENU_IDS.deleteAction}
              >
                <Trash2 size={14} />
                מחיקת סעיף
              </ActionBtn>
            </ActionList>
          ) : (
            <PermissionsView>
              <BackRow>
                <BackBtn
                  type="button"
                  onClick={handleBackToActions}
                  data-testid={SECTION_MENU_IDS.backBtn}
                >
                  <ChevronRight size={14} />
                </BackBtn>
                <BackLabel>הרשאות</BackLabel>
              </BackRow>
              <UnderlineTabs tabs={ROLE_TABS} activeId={activeRole} onChange={handleRoleChange} />
              <SearchableMultiSelect
                options={peopleNames}
                selected={permissions[activeRole]}
                onChange={handlePermissionsChange}
                placeholder="חיפוש שם..."
                data-testid={SECTION_MENU_IDS.permissionsSelect}
              />
            </PermissionsView>
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
            onSave={onChangeInstructions}
            onClose={handleCloseInstructions}
          />
        )}
      </Suspense>
    </>
  );
};
