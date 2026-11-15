import { AlertCircle, Eye, EyeOff, FileText, Lock, Trash2, UserCheck, Users } from 'lucide-react';
import { SECTION_MENU_IDS } from '../../SectionMenu.testids';
import { ActionBtn, ActionList, Separator } from './SectionMenuActions.styles';

export interface SectionMenuActionsProps {
  isHidden: boolean;
  isClassified: boolean;
  onOpenApprovers: () => void;
  onOpenEditors: () => void;
  onToggleHidden: () => void;
  onToggleClassified: () => void;
  onOpenInstructions: () => void;
  onAddFootnote: () => void;
  onDelete: () => void;
}

export const SectionMenuActions = ({
  isHidden,
  isClassified,
  onOpenApprovers,
  onOpenEditors,
  onToggleHidden,
  onToggleClassified,
  onOpenInstructions,
  onAddFootnote,
  onDelete,
}: SectionMenuActionsProps) => (
  <ActionList>
    <ActionBtn
      type="button"
      onClick={onOpenApprovers}
      data-testid={SECTION_MENU_IDS.approversAction}
    >
      <UserCheck size={14} />
      מאשרי הסעיף
    </ActionBtn>
    <ActionBtn type="button" onClick={onOpenEditors} data-testid={SECTION_MENU_IDS.editorsAction}>
      <Users size={14} />
      עורכי הסעיף
    </ActionBtn>

    <Separator />

    <ActionBtn
      type="button"
      onClick={onToggleHidden}
      data-testid={SECTION_MENU_IDS.toggleHiddenAction}
    >
      {isHidden ? <Eye size={14} /> : <EyeOff size={14} />}
      {isHidden ? 'הצגת סעיף' : 'הסתרת סעיף'}
    </ActionBtn>
    <ActionBtn
      type="button"
      onClick={onToggleClassified}
      data-testid={SECTION_MENU_IDS.toggleClassifiedAction}
    >
      <Lock size={14} />
      {isClassified ? 'ביטול הגדרה כממודר' : 'הגדרה כסעיף ממודר'}
    </ActionBtn>

    <Separator />

    <ActionBtn
      type="button"
      onClick={onOpenInstructions}
      data-testid={SECTION_MENU_IDS.instructionsAction}
    >
      <AlertCircle size={14} />
      הנחיות לסעיף
    </ActionBtn>
    <ActionBtn
      type="button"
      onClick={onAddFootnote}
      data-testid={SECTION_MENU_IDS.addFootnoteAction}
    >
      <FileText size={14} />
      הוספת הערת שוליים
    </ActionBtn>

    <Separator />

    <ActionBtn type="button" $danger onClick={onDelete} data-testid={SECTION_MENU_IDS.deleteAction}>
      <Trash2 size={14} />
      מחיקת סעיף
    </ActionBtn>
  </ActionList>
);
