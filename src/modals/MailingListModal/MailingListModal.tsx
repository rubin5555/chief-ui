import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { IconTab } from '@/components/ui/IconTab';
import { Select } from '@/components/ui/Select';
import { SearchSlotProvider } from '@/context/SearchSlotContext';
import { MembersPanel } from './components/MembersPanel';
import { ModalSearchInput } from './components/ModalSearchInput';
import { useMailingListModalAnalytics } from './MailingListModal.analytics';
import type { ImportTabId, Member } from './MailingListModal.constants';
import { AGAF_OPTIONS, IMPORT_TABS } from './MailingListModal.constants';
import {
  CancelBtn,
  CloseBtn,
  FieldInput,
  FieldLabel,
  FormSection,
  LeftPanel,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Overlay,
  PlaceholderText,
  RightPanel,
  SearchRow,
  TabBar,
  TabContent,
  WarnText,
} from './MailingListModal.styles';
import { NEW_LIST_IDS } from './MailingListModal.testids';
import { DocTab } from './tabs/DocTab';
import { HamalTab } from './tabs/HamalTab';
import { MirageTab } from './tabs/MirageTab';
import { NetworkTab } from './tabs/NetworkTab';
import { PersonalTab } from './tabs/PersonalTab';

export type ModalMode = 'new' | 'edit' | 'duplicate';

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
  const [preSearchQuery, setPreSearchQuery] = useState('');
  const [autoFocusNetworkSearch, setAutoFocusNetworkSearch] = useState(false);
  const [groupExpanded, setGroupExpanded] = useState<string | null>(null);
  const [searchSlotNode, setSearchSlotNode] = useState<HTMLDivElement | null>(null);

  const [docAdded, setDocAdded] = useState<Set<string>>(new Set());
  const [hamalAdded, setHamalAdded] = useState<Set<string>>(new Set());
  const [mirageAdded, setMirageAdded] = useState<Set<string>>(new Set());
  const [personalAdded, setPersonalAdded] = useState<Set<string>>(new Set());
  const addedMemberIds = new Set(members.map((m) => m.id));

  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setListName(e.target.value);
    setDirty(true);
  };

  const onTabChange = (id: ImportTabId) => {
    setActiveTab(id);
    trackTabChanged(id);
  };

  const activateNetworkFromSearch = () => {
    if (activeTab !== null) return;
    setAutoFocusNetworkSearch(true);
    onTabChange('network');
  };

  const onPreSearchFocus = () => activateNetworkFromSearch();

  const onPreSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPreSearchQuery(e.target.value);
    activateNetworkFromSearch();
  };

  const onToggleGroup = (id: string) => setGroupExpanded((prev) => (prev === id ? null : id));

  const onRemoveMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setDirty(true);
    trackMemberRemoved();
  };

  const onAddMember = (member: Member) => {
    setMembers((prev) => {
      if (prev.some((m) => m.id === member.id || (m.idNumber && m.idNumber === member.idNumber)))
        return prev;
      return [...prev, member];
    });
    setDirty(true);
  };

  const onDocImport = (newMembers: Member[], docIds: string[]) => {
    setMembers((prev) => {
      const existingIds = new Set(prev.map((m) => m.idNumber));
      return [...prev, ...newMembers.filter((m) => !existingIds.has(m.idNumber))];
    });
    setDocAdded((prev) => {
      const next = new Set(prev);
      docIds.forEach((id) => next.add(id));
      return next;
    });
    setDirty(true);
  };

  const onHamalImport = (groups: Member[], groupIds: string[]) => {
    setMembers((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      return [...prev, ...groups.filter((g) => !existingIds.has(g.id))];
    });
    setHamalAdded((prev) => {
      const next = new Set(prev);
      groupIds.forEach((id) => next.add(id));
      return next;
    });
    setDirty(true);
  };

  const onMirageImport = (groups: Member[], groupIds: string[]) => {
    setMembers((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      return [...prev, ...groups.filter((g) => !existingIds.has(g.id))];
    });
    setMirageAdded((prev) => {
      const next = new Set(prev);
      groupIds.forEach((id) => next.add(id));
      return next;
    });
    setDirty(true);
  };

  const onPersonalImport = (newMembers: Member[], listIds: string[]) => {
    setMembers((prev) => {
      const existingIds = new Set(prev.map((m) => m.idNumber));
      return [...prev, ...newMembers.filter((m) => !existingIds.has(m.idNumber))];
    });
    setPersonalAdded((prev) => {
      const next = new Set(prev);
      listIds.forEach((id) => next.add(id));
      return next;
    });
    setDirty(true);
  };

  const {
    trackModalOpened,
    trackTabChanged,
    trackMemberRemoved,
    trackSaveClicked,
    trackCancelled,
  } = useMailingListModalAnalytics();

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  const onOverlayClick = () => {
    trackCancelled(mode);
    onClose();
  };
  const onCardClick = (e: React.MouseEvent) => e.stopPropagation();

  const isDupBlocked = mode === 'duplicate' && listName === initialName;
  const isEditBlocked = mode === 'edit' && !dirty;
  const isDisabled = isDupBlocked || isEditBlocked;

  const onSaveClick = () => {
    if (isDisabled) return;
    trackSaveClicked(mode, members.length);
    onSave(listName, members);
    onClose();
  };

  const tabContent: Record<ImportTabId, React.ReactNode> = {
    network: (
      <NetworkTab
        addedMemberIds={addedMemberIds}
        onAdd={onAddMember}
        initialQuery={preSearchQuery}
        autoFocus={autoFocusNetworkSearch}
      />
    ),
    doc: <DocTab addedDocIds={docAdded} onImport={onDocImport} />,
    hamal: <HamalTab addedGroupIds={hamalAdded} onImport={onHamalImport} />,
    mirage: <MirageTab addedGroupIds={mirageAdded} onImport={onMirageImport} />,
    personal: <PersonalTab addedListIds={personalAdded} onImport={onPersonalImport} />,
  };

  return (
    <Overlay data-testid={NEW_LIST_IDS.overlay} onClick={onOverlayClick}>
      <ModalCard data-testid={NEW_LIST_IDS.root} onClick={onCardClick} dir="rtl">
        <ModalHeader data-testid={NEW_LIST_IDS.header}>
          <ModalTitle>{MODAL_TITLES[mode]}</ModalTitle>
          <CloseBtn
            type="button"
            onClick={() => {
              trackCancelled(mode);
              onClose();
            }}
          >
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody>
          <RightPanel>
            <SearchSlotProvider value={searchSlotNode}>
              <FormSection>
                <div>
                  <FieldLabel htmlFor="list-name">שם רשימת התפוצה</FieldLabel>
                  <FieldInput
                    id="list-name"
                    data-testid={NEW_LIST_IDS.nameInput}
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
                    data-testid={NEW_LIST_IDS.agafSelect}
                    options={AGAF_OPTIONS}
                    placeholder="בחר אגף..."
                  />
                </div>
              </FormSection>

              <TabBar data-testid={NEW_LIST_IDS.tabBar}>
                {IMPORT_TABS.map(({ id, label, Icon }) => (
                  <IconTab
                    key={id}
                    icon={Icon}
                    label={label}
                    isActive={activeTab === id}
                    onClick={() => onTabChange(id)}
                  />
                ))}
              </TabBar>

              <SearchRow ref={setSearchSlotNode} data-testid={NEW_LIST_IDS.searchBar}>
                {activeTab === null && (
                  <ModalSearchInput
                    value={preSearchQuery}
                    onChange={onPreSearchQueryChange}
                    onFocus={onPreSearchFocus}
                    placeholder="בחר מקור ייבוא או חפש לפי שם"
                  />
                )}
              </SearchRow>

              <TabContent data-testid={NEW_LIST_IDS.tabContent}>
                {activeTab !== null ? (
                  tabContent[activeTab]
                ) : (
                  <PlaceholderText>בחר מקור ייבוא או חפש לפי שם</PlaceholderText>
                )}
              </TabContent>
            </SearchSlotProvider>
          </RightPanel>

          <LeftPanel data-testid={NEW_LIST_IDS.membersPanel}>
            <MembersPanel
              members={members}
              groupExpanded={groupExpanded}
              onToggleGroup={onToggleGroup}
              onRemove={onRemoveMember}
            />
          </LeftPanel>
        </ModalBody>

        <ModalFooter data-testid={NEW_LIST_IDS.footer}>
          <CancelBtn
            type="button"
            data-testid={NEW_LIST_IDS.cancelBtn}
            onClick={() => {
              trackCancelled(mode);
              onClose();
            }}
          >
            ביטול
          </CancelBtn>
          <Button
            type="button"
            size="lg"
            data-testid={NEW_LIST_IDS.saveBtn}
            disabled={isDisabled}
            onClick={onSaveClick}
          >
            {SAVE_LABELS[mode]}
          </Button>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
};
