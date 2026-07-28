import { ChevronRight } from 'lucide-react';
import { NETWORK_PEOPLE_FALLBACK, useNetworkPeople } from '@/api/networkPeople';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import type { NodePermissions } from '../../../../types';
import { SECTION_MENU_IDS } from '../../SectionMenu.testids';
import { BackBtn, BackLabel, BackRow, PermissionsView } from './SectionPermissionsView.styles';

export type PermissionRole = keyof NodePermissions;

const ROLE_TABS: UnderlineTab[] = [
  { id: 'approvers', label: 'מאשרי הסעיף' },
  { id: 'editors', label: 'עורכי הסעיף' },
];

export interface SectionPermissionsViewProps {
  permissions: NodePermissions;
  activeRole: PermissionRole;
  onRoleChange: (role: PermissionRole) => void;
  onChange: (names: string[]) => void;
  onBack: () => void;
}

// The menu's second view: who approves this section and who may edit it.
//
// The roster query lives here rather than in SectionMenu, so it is fetched by the
// one section whose permissions are being looked at instead of by every section
// on the page.
//
// **Divergence.** main routes these two actions to the *document*-level
// permissions modal (Edit.tsx:3189), which then can't say which section you came
// from. Per-section permissions are per-section data, so they are edited here.
export const SectionPermissionsView = ({
  permissions,
  activeRole,
  onRoleChange,
  onChange,
  onBack,
}: SectionPermissionsViewProps) => {
  const { data } = useNetworkPeople();
  const peopleNames = (data ?? NETWORK_PEOPLE_FALLBACK.networkPeople).map((person) => person.name);

  const handleRoleChange = (id: string) => onRoleChange(id as PermissionRole);

  return (
    <PermissionsView>
      <BackRow>
        <BackBtn
          type="button"
          aria-label="חזרה"
          onClick={onBack}
          data-testid={SECTION_MENU_IDS.backBtn}
        >
          <ChevronRight size={14} aria-hidden="true" />
        </BackBtn>
        <BackLabel>הרשאות</BackLabel>
      </BackRow>
      <UnderlineTabs tabs={ROLE_TABS} activeId={activeRole} onChange={handleRoleChange} />
      <SearchableMultiSelect
        options={peopleNames}
        selected={permissions[activeRole]}
        onChange={onChange}
        placeholder="חיפוש שם..."
        data-testid={SECTION_MENU_IDS.permissionsSelect}
      />
    </PermissionsView>
  );
};
