import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { ImportPanel } from './components/ImportPanel';
import { MembersPanel } from './components/MembersPanel';
import { useMailingListModalAnalytics } from './MailingListModal.analytics';
import type { ImportTabId, Member } from './MailingListModal.constants';
import { BodyLayout, CancelBtn, LeftPanel } from './MailingListModal.styles';
import { NEW_LIST_IDS } from './MailingListModal.testids';
import { DocTab } from './tabs/DocTab';
import { HamalTab } from './tabs/HamalTab';
import { MirageTab } from './tabs/MirageTab';
import { NetworkTab } from './tabs/NetworkTab';
import { PersonalTab } from './tabs/PersonalTab';
import { useImportSource } from './useImportSource';

export type ModalMode = 'new' | 'edit' | 'duplicate';

const FORM_ID = 'mailing-list-form';

const byIdNumber = (m: Member) => m.idNumber;
const byId = (m: Member) => m.id;

interface MailingListModalProps {
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

export const MailingListModal = ({
  mode = 'new',
  initialName = '',
  initialMembers = [],
  onClose,
  onSave,
}: MailingListModalProps) => {
  const [listName, setListName] = useState(initialName);
  const [dirty, setDirty] = useState(false);
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [activeTab, setActiveTab] = useState<ImportTabId | null>(null);
  const [networkInitialQuery, setNetworkInitialQuery] = useState('');
  const [autoFocusNetworkSearch, setAutoFocusNetworkSearch] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<string | null>(null);

  const addedMemberIds = new Set(members.map((m) => m.id));

  const addMembers = (newMembers: Member[], dedupeKey: (member: Member) => string | undefined) => {
    setMembers((prev) => {
      const existingKeys = new Set(prev.map(dedupeKey));
      return [...prev, ...newMembers.filter((m) => !existingKeys.has(dedupeKey(m)))];
    });
    setDirty(true);
  };

  const { addedIds: docAdded, onImport: onDocImport } = useImportSource(byIdNumber, addMembers);
  const { addedIds: hamalAdded, onImport: onHamalImport } = useImportSource(byId, addMembers);
  const { addedIds: mirageAdded, onImport: onMirageImport } = useImportSource(byId, addMembers);
  const { addedIds: personalAdded, onImport: onPersonalImport } = useImportSource(
    byIdNumber,
    addMembers,
  );

  const {
    trackModalOpened,
    trackTabChanged,
    trackMemberRemoved,
    trackSaveClicked,
    trackCancelled,
  } = useMailingListModalAnalytics();

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
    setDirty(true);
  };

  const onTabChange = (id: ImportTabId) => {
    setActiveTab(id);
    trackTabChanged(id);
  };

  // Called at most once per modal lifetime: ImportPanel's pre-search box unmounts as soon as
  // activeTab flips away from null, so this only fires on the focus/first-keystroke that
  // switches into the network tab.
  const onActivateNetworkFromSearch = (query: string) => {
    if (activeTab !== null) return;
    setNetworkInitialQuery(query);
    setAutoFocusNetworkSearch(true);
    onTabChange('network');
  };

  const onToggleGroup = useCallback(
    (id: string) => setGroupExpanded((prev) => (prev === id ? null : id)),
    [],
  );

  const onRemoveMember = useCallback(
    (id: string) => {
      setMembers((prev) => prev.filter((m) => m.id !== id));
      setDirty(true);
      trackMemberRemoved();
    },
    [trackMemberRemoved],
  );

  const onAddMember = (member: Member) => {
    setMembers((prev) => {
      if (prev.some((m) => m.id === member.id || (m.idNumber && m.idNumber === member.idNumber)))
        return prev;
      return [...prev, member];
    });
    setDirty(true);
  };

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  const modalRef = useRef<ModalHandle>(null);

  const handleCancel = () => {
    trackCancelled(mode);
    modalRef.current?.requestClose();
  };
  const handleTabSelect = (id: ImportTabId) => () => onTabChange(id);

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

  const tabContent: Record<ImportTabId, React.ReactNode> = {
    network: (
      <NetworkTab
        addedMemberIds={addedMemberIds}
        onAdd={onAddMember}
        initialQuery={networkInitialQuery}
        autoFocus={autoFocusNetworkSearch}
      />
    ),
    doc: <DocTab addedDocIds={docAdded} onImport={onDocImport} />,
    hamal: <HamalTab addedGroupIds={hamalAdded} onImport={onHamalImport} />,
    mirage: <MirageTab addedGroupIds={mirageAdded} onImport={onMirageImport} />,
    personal: <PersonalTab addedListIds={personalAdded} onImport={onPersonalImport} />,
  };

  const footer = (
    <>
      <CancelBtn type="button" data-testid={NEW_LIST_IDS.cancelBtn} onClick={handleCancel}>
        ביטול
      </CancelBtn>
      <Button
        type="submit"
        form={FORM_ID}
        size="lg"
        data-testid={NEW_LIST_IDS.saveBtn}
        disabled={isDisabled}
      >
        {SAVE_LABELS[mode]}
      </Button>
    </>
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
      data-testid={NEW_LIST_IDS.root}
    >
      <BodyLayout>
        <ImportPanel
          formId={FORM_ID}
          onFormSubmit={onFormSubmit}
          listName={listName}
          onNameChange={onNameChange}
          isDupBlocked={isDupBlocked}
          activeTab={activeTab}
          onTabSelect={handleTabSelect}
          onActivateNetworkFromSearch={onActivateNetworkFromSearch}
          tabContent={tabContent}
        />

        <LeftPanel data-testid={NEW_LIST_IDS.membersPanel}>
          <MembersPanel
            members={members}
            groupExpanded={groupExpanded}
            onToggleGroup={onToggleGroup}
            onRemove={onRemoveMember}
          />
        </LeftPanel>
      </BodyLayout>
    </Modal>
  );
};
