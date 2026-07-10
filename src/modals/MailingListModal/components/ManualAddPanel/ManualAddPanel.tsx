import { Plus, X } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import type { Member } from '../../MailingListModal.constants';
import {
  PopoverCloseBtn,
  PopoverForm,
  PopoverHeader,
  PopoverInput,
  PopoverLabel,
  PopoverSaveBtn,
  PopoverTitle,
} from './ManualAddPanel.styles';

interface Props {
  onSave: (member: Member) => void;
}

export const ManualAddPanel = ({ onSave }: Props) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const panel = useFloatingPanel();

  const onToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    panel.toggle(260);
    setUsername('');
    setDisplayName('');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!username.trim()) return;

    onSave({
      id: `manual-${Date.now()}`,
      name: displayName || username,
      idNumber: username,
      environment: '',
    });

    panel.close();
    setUsername('');
    setDisplayName('');
  };

  const onUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value);
  const onDisplayNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setDisplayName(e.target.value);

  return (
    <>
      <Button ref={panel.btnRef} onClick={onToggle} type="button" size="xs">
        <Plus size={14} />
        הוספה ידנית
      </Button>

      {panel.open && panel.pos && (
        <FloatingPanel ref={panel.panelRef} $pos={panel.pos} $width={280}>
          <PopoverHeader>
            <PopoverTitle>הוספה ידנית</PopoverTitle>
            <PopoverCloseBtn type="button" onClick={panel.close}>
              <X size={16} color={gray[400]} />
            </PopoverCloseBtn>
          </PopoverHeader>

          <PopoverForm onSubmit={onSubmit}>
            <div>
              <PopoverLabel>שם משתמש / ת.ז.</PopoverLabel>
              <PopoverInput
                type="text"
                value={username}
                onChange={onUsernameChange}
                placeholder="הזן שם משתמש..."
                autoComplete="new-password"
                dir="rtl"
              />
            </div>
            <div>
              <PopoverLabel>שם תצוגה (אופציונלי)</PopoverLabel>
              <PopoverInput
                type="text"
                value={displayName}
                onChange={onDisplayNameChange}
                placeholder="הזן שם..."
                autoComplete="new-password"
                dir="rtl"
              />
            </div>
            <PopoverSaveBtn type="submit" disabled={!username.trim()}>
              הוסף לרשימה
            </PopoverSaveBtn>
          </PopoverForm>
        </FloatingPanel>
      )}
    </>
  );
};
