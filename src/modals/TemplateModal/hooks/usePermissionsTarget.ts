import { useState } from 'react';
import type { PermissionsTarget } from '../TemplateModal.constants';

export const usePermissionsTarget = (
  trackPermissionsChanged: (role: 'approvers' | 'editors') => void,
) => {
  const [permTarget, setPermTarget] = useState<PermissionsTarget | null>(null);

  const togglePermissions = (target: PermissionsTarget) => {
    setPermTarget((prev) => (prev?.id === target.id ? null : target));
  };

  const closePermissions = () => setPermTarget(null);

  const changePermissions = (role: 'approvers' | 'editors', value: string[]) => {
    trackPermissionsChanged(role);
    setPermTarget((prev) =>
      prev ? { ...prev, permissions: { ...prev.permissions, [role]: value } } : prev,
    );
  };

  return { permTarget, togglePermissions, closePermissions, changePermissions };
};
