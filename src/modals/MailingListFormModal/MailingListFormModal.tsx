import { useEffect, useRef, useState } from 'react';
import type { Member } from '@/components/PeoplePicker';
import { MembersPanel, PeopleSourcesPanel } from '@/components/PeoplePicker';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useMailingListFormModalAnalytics } from './MailingListFormModal.analytics';
import { AGAF_OPTIONS } from './MailingListFormModal.constants';
import {
  BodyLayout,
  CancelBtn,
  FieldInput,
  FieldLabel,
  FormSection,
  MembersColumn,
  WarnText,
} from './MailingListFormModal.styles';
import { MAILING_LIST_FORM_IDS } from './MailingListFormModal.testids';

export type ModalMode = 'new' | 'edit' | 'duplicate';

const FORM_ID = 'mailing-list-form';

const SOURCES_WIDTH = 700;

interface MailingListFormModalProps {
  mode?: ModalMode;
  initialName?: string;
  initialMembers?: Member[];
  onClose: () => void;
  onSave: (name: string, members: Member[]) => void;
}

const MODAL_TITLES: Record<ModalMode, string> = {
  new: 'רשימת תפוצה חדשה',
  edit: 'עריכת רשימת תפוצה',
  duplicate: 'שכפול רשימת תפוצה',
};

const SAVE_LABELS: Record<ModalMode, string> = {
  new: 'צור רשימה',
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
};

export const MailingListFormModal = ({
  mode = 'new',
  initialName = '',
  initialMembers = [],
  onClose,
  onSave,
}: MailingListFormModalProps) => {
  const [listName, setListName] = useState(initialName);
  const [dirty, setDirty] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const modalRef = useRef<ModalHandle>(null);

  const {
    trackModalOpened,
    trackTabChanged,
    trackMemberRemoved,
    trackSaveClicked,
    trackCancelled,
  } = useMailingListFormModalAnalytics();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
    setDirty(true);
  };

  const onMembersChange = (next: Member[]) => {
    setMembers(next);
    setDirty(true);
  };

  const onRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDirty(true);
    trackMemberRemoved();
  };

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  const handleCancel = () => {
    trackCancelled(mode);
    modalRef.current?.requestClose();
  };

  const isDupBlocked = mode === 'duplicate' && listName === initialName;
  const isEditBlocked = mode === 'edit' && !dirty;
  const isDisabled = isDupBlocked || isEditBlocked;

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isDisabled) return;
    trackSaveClicked(mode, members.length);
    onSave(listName, members);
    modalRef.current?.requestClose();
  };

  const footer = (
    <>
      <CancelBtn type="button" data-testid={MAILING_LIST_FORM_IDS.cancelBtn} onClick={handleCancel}>
        ביטול
      </CancelBtn>
      <Button
        type="submit"
        form={FORM_ID}
        size="lg"
        data-testid={MAILING_LIST_FORM_IDS.saveBtn}
        disabled={isDisabled}
      >
        {SAVE_LABELS[mode]}
      </Button>
    </>
  );

  const nameAndDepartment = (
    <FormSection id={FORM_ID} onSubmit={onFormSubmit}>
      <div>
        <FieldLabel htmlFor="list-name">שם רשימת התפוצה</FieldLabel>
        <FieldInput
          id="list-name"
          data-testid={MAILING_LIST_FORM_IDS.nameInput}
          type="text"
          value={listName}
          onChange={onNameChange}
          placeholder="הזן שם רשימה..."
          $warn={isDupBlocked}
        />
        {isDupBlocked && <WarnText>יש לשנות את שם הרשימה לפני השכפול</WarnText>}
      </div>
      <div>
        <FieldLabel htmlFor="list-agaf">בחירת אגף</FieldLabel>
        <Select
          id="list-agaf"
          data-testid={MAILING_LIST_FORM_IDS.agafSelect}
          options={AGAF_OPTIONS}
          placeholder="בחר אגף..."
        />
      </div>
    </FormSection>
  );

  return (
    <Modal
      ref={modalRef}
      title={MODAL_TITLES[mode]}
      onClose={onClose}
      onRequestClose={handleCancel}
      footer={footer}
      footerAlign="between"
      width={1140}
      maxWidth="96vw"
      height="90vh"
      noBodyPadding
      data-testid={MAILING_LIST_FORM_IDS.root}
    >
      <BodyLayout>
        <PeopleSourcesPanel
          members={members}
          onMembersChange={onMembersChange}
          header={nameAndDepartment}
          width={SOURCES_WIDTH}
          onTabChange={trackTabChanged}
        />

        <MembersColumn>
          <MembersPanel members={members} onRemove={onRemoveMember} />
        </MembersColumn>
      </BodyLayout>
    </Modal>
  );
};
