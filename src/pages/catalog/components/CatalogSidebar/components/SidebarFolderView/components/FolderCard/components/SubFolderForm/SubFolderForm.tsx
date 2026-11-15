import type { ChangeEvent, FormEvent, KeyboardEvent } from 'react';
import { useState } from 'react';
import {
  InlineActions,
  InlineCancelBtn,
  InlineConfirmBtn,
  InlineForm,
  InlineInput,
} from '../../../../../../CatalogSidebar.shared.styles';
import { SubFormWrap } from './SubFolderForm.styles';

interface SubFolderFormProps {
  onCreate: (name: string) => void;
  onCancel: () => void;
}

export const SubFolderForm = ({ onCreate, onCancel }: SubFolderFormProps) => {
  const [name, setName] = useState('');

  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') onCancel();
  };

  return (
    <SubFormWrap>
      <InlineForm onSubmit={onSubmit}>
        {/* Opened from the row's menu, so focus follows the reveal. */}
        <InlineInput
          autoFocus
          dir="rtl"
          value={name}
          placeholder="שם תת-התיקייה..."
          onChange={onNameChange}
          onKeyDown={onKeyDown}
        />
        <InlineActions>
          <InlineConfirmBtn type="submit">אישור</InlineConfirmBtn>
          <InlineCancelBtn type="button" onClick={onCancel}>
            ביטול
          </InlineCancelBtn>
        </InlineActions>
      </InlineForm>
    </SubFormWrap>
  );
};
