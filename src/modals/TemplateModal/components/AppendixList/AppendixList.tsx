import { GripVertical, Plus, User, X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useDragReorder } from '@/hooks/useDragReorder';
import type { Appendix, PermissionsTarget } from '../../TemplateModal.constants';
import { HE_ALPHA } from '../../TemplateModal.constants';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import {
  AddNodeButton,
  DragHandle,
  NodeIndex,
  SmallIconBtn,
  TitleInput,
} from '../TemplateModal.shared.styles';
import { AppendixRow } from './AppendixList.styles';

interface AppendixListProps {
  appendices: Appendix[];
  activePermissionsId: string | null;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onTitleChange: (id: string, title: string) => void;
  onReorder: (draggedId: string, targetId: string) => void;
  onTogglePermissions: (target: PermissionsTarget) => void;
  onChangePermissions: (id: string, permissions: Appendix['permissions']) => void;
}

export const AppendixList = ({
  appendices,
  activePermissionsId,
  onAdd,
  onRemove,
  onTitleChange,
  onReorder,
  onTogglePermissions,
  onChangePermissions,
}: AppendixListProps) => {
  const drag = useDragReorder(onReorder);

  const handleTitleChange = (id: string) => (e: ChangeEvent<HTMLInputElement>) =>
    onTitleChange(id, e.target.value);

  const handleRemove = (id: string) => () => onRemove(id);

  const handlePermissions = (appendix: Appendix, label: string) => () =>
    onTogglePermissions({
      id: appendix.id,
      label,
      permissions: appendix.permissions,
      onChangeApprovers: (v) =>
        onChangePermissions(appendix.id, { ...appendix.permissions, approvers: v }),
      onChangeEditors: (v) =>
        onChangePermissions(appendix.id, { ...appendix.permissions, editors: v }),
    });

  return (
    <>
      {appendices.map((appendix, index) => {
        const hasPerms =
          appendix.permissions.approvers.length > 0 || appendix.permissions.editors.length > 0;
        const isActive = activePermissionsId === appendix.id;
        return (
          <AppendixRow
            key={appendix.id}
            data-testid={TEMPLATE_MODAL_IDS.appendix(appendix.id)}
            $isDragging={drag.draggedId === appendix.id}
            $isDragOver={drag.dragOverId === appendix.id}
            {...drag.getDropTargetProps(appendix.id)}
          >
            <DragHandle
              data-testid={TEMPLATE_MODAL_IDS.dragHandle(appendix.id)}
              {...drag.getDragHandleProps(appendix.id)}
            >
              <GripVertical size={12} />
            </DragHandle>
            <NodeIndex>נספח {HE_ALPHA[index]}.</NodeIndex>
            <TitleInput
              value={appendix.title}
              onChange={handleTitleChange(appendix.id)}
              placeholder="שם הנספח..."
              dir="rtl"
            />
            <SmallIconBtn
              type="button"
              data-testid={TEMPLATE_MODAL_IDS.permissionsBtn(appendix.id)}
              $active={isActive}
              $muted={!hasPerms}
              onClick={handlePermissions(appendix, `הרשאות נספח ${HE_ALPHA[index]}`)}
            >
              <User size={12} />
            </SmallIconBtn>
            <SmallIconBtn type="button" onClick={handleRemove(appendix.id)}>
              <X size={12} />
            </SmallIconBtn>
          </AppendixRow>
        );
      })}
      <AddNodeButton type="button" data-testid={TEMPLATE_MODAL_IDS.addAppendixBtn} onClick={onAdd}>
        <Plus size={14} />
        הוספת נספח
      </AddNodeButton>
    </>
  );
};
