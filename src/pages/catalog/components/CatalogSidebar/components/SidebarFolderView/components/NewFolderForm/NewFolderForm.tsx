import { FolderPlus } from 'lucide-react';
import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import { NEW_FOLDER_TEXT } from '../../../../CatalogSidebar.constants';
import {
  InlineActions,
  InlineCancelBtn,
  InlineConfirmBtn,
  InlineForm,
  InlineInput,
} from '../../../../CatalogSidebar.shared.styles';
import { CATALOG_SIDEBAR_IDS } from '../../../../CatalogSidebar.testids';
import { AddFolderBtn, AddFolderLabel } from './NewFolderForm.styles';

interface NewFolderFormProps {
  onCreate: (name: string) => void;
}

export const NewFolderForm = ({ onCreate }: NewFolderFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');

  const close = () => {
    setIsOpen(false);
    setName('');
  };

  const onOpen = () => setIsOpen(true);
  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    close();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') close();
  };

  if (!isOpen) {
    return (
      <AddFolderBtn type="button" data-testid={CATALOG_SIDEBAR_IDS.newFolderBtn} onClick={onOpen}>
        <FolderPlus size={16} />
        <AddFolderLabel>{NEW_FOLDER_TEXT}</AddFolderLabel>
      </AddFolderBtn>
    );
  }

  return (
    <InlineForm onSubmit={onSubmit}>
      {/* The field replaces the button that opened it, so focus follows. */}
      <InlineInput
        autoFocus
        dir="rtl"
        value={name}
        placeholder="שם התיקייה..."
        data-testid={CATALOG_SIDEBAR_IDS.newFolderInput}
        onChange={onNameChange}
        onKeyDown={onKeyDown}
      />
      <InlineActions>
        <InlineConfirmBtn type="submit">צור</InlineConfirmBtn>
        <InlineCancelBtn type="button" onClick={close}>
          ביטול
        </InlineCancelBtn>
      </InlineActions>
    </InlineForm>
  );
};
