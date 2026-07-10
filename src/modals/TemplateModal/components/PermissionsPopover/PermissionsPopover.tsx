import { X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useState } from 'react';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import type { PermissionsTarget } from '../../TemplateModal.constants';
import { PERMISSION_NAME_OPTIONS } from '../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import {
  PermCardBody,
  PermCardCloseBtn,
  PermCardHeader,
  PermCardOverlay,
  PermCardTitle,
  PermCardWrap,
} from './PermissionsPopover.styles';

type PermissionRole = 'approvers' | 'editors';

const ROLE_TABS: UnderlineTab[] = [
  { id: 'approvers', label: 'מאשר הסעיף' },
  { id: 'editors', label: 'עורכי הסעיף' },
];

interface PermissionsPopoverProps {
  target: PermissionsTarget;
  onClose: () => void;
  onPermissionsChanged: (role: PermissionRole, value: string[]) => void;
}

export const PermissionsPopover = ({
  target,
  onClose,
  onPermissionsChanged,
}: PermissionsPopoverProps) => {
  const [activeRole, setActiveRole] = useState<PermissionRole>('approvers');

  const stopPropagation = (e: MouseEvent) => e.stopPropagation();
  const handleRoleChange = (id: string) => setActiveRole(id as PermissionRole);

  const handleApproversChange = (value: string[]) => {
    target.onChangeApprovers(value);
    onPermissionsChanged('approvers', value);
  };

  const handleEditorsChange = (value: string[]) => {
    target.onChangeEditors(value);
    onPermissionsChanged('editors', value);
  };

  return (
    <PermCardOverlay>
      <PermCardWrap
        dir="rtl"
        data-testid={TEMPLATE_MODAL_IDS.permissionsPopover}
        onClick={stopPropagation}
      >
        <PermCardHeader>
          <PermCardTitle>{target.label}</PermCardTitle>
          <PermCardCloseBtn type="button" onClick={onClose} aria-label="סגירה">
            <X size={16} />
          </PermCardCloseBtn>
        </PermCardHeader>
        <PermCardBody>
          <UnderlineTabs tabs={ROLE_TABS} activeId={activeRole} onChange={handleRoleChange} />
          {activeRole === 'approvers' ? (
            <SearchableMultiSelect
              options={PERMISSION_NAME_OPTIONS}
              selected={target.permissions.approvers}
              onChange={handleApproversChange}
              placeholder="חיפוש שם, קבוצה או רשימה..."
            />
          ) : (
            <SearchableMultiSelect
              options={PERMISSION_NAME_OPTIONS}
              selected={target.permissions.editors}
              onChange={handleEditorsChange}
              placeholder="חיפוש שם, קבוצה או רשימה..."
            />
          )}
        </PermCardBody>
      </PermCardWrap>
    </PermCardOverlay>
  );
};
