import { useMemo, useRef, useState } from 'react';
import { NETWORK_PEOPLE_FALLBACK, useNetworkPeople } from '@/api/networkPeople';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import type { UnderlineTab } from '@/components/ui/UnderlineTabs';
import { UnderlineTabs } from '@/components/ui/UnderlineTabs';
import { useDocPermissionsModalAnalytics } from './DocPermissionsModal.analytics';
import { buildPermissionLevels } from './DocPermissionsModal.constants';
import {
  LevelDescription,
  LevelHeader,
  LevelIcon,
  LevelName,
  MemberCount,
  MembersLabel,
  PermissionBody,
} from './DocPermissionsModal.styles';
import { DOC_PERMISSIONS_MODAL_IDS } from './DocPermissionsModal.testids';

export interface DocPermissionsModalProps {
  /** Changes what the second permission is called, and what it grants. */
  isDistributed: boolean;
  onClose: () => void;
}

// Who may do what with the document as a whole (main's DocPermissionsModal,
// TopNavbar.tsx:211): five levels, each with its own list of people and its own
// description of what the level actually grants.
//
// **Scope.** main pairs each level with a full importer — mailing lists, HML
// groups, network directories, an Excel upload — which is the same machinery
// `src/modals/MailingListModal` already implements for a different purpose. Here
// each level takes people from the network roster through the app's own
// multi-select. The five levels and their wording are main's; the way people get
// into them is dev's existing one.
//
// **State.** Members are local: there is no document-permissions shape on the API
// to persist them to yet, and inventing one would put a field on the DTO that no
// backend has agreed to.
export const DocPermissionsModal = ({ isDistributed, onClose }: DocPermissionsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const { data } = useNetworkPeople();
  const peopleNames = (data ?? NETWORK_PEOPLE_FALLBACK.networkPeople).map((person) => person.name);

  const levels = useMemo(() => buildPermissionLevels(isDistributed), [isDistributed]);

  const [activeId, setActiveId] = useState(levels[0].id);
  const [membersByLevel, setMembersByLevel] = useState<Record<string, string[]>>({});
  const { trackLevelViewed, trackMembersChanged } = useDocPermissionsModalAnalytics();

  const activeLevel = levels.find((level) => level.id === activeId) ?? levels[0];
  const activeMembers = membersByLevel[activeLevel.id] ?? [];

  const tabs: UnderlineTab[] = levels.map((level) => ({ id: level.id, label: level.label }));

  const handleMembersChange = (names: string[]) => {
    trackMembersChanged(activeLevel.label, names.length);
    setMembersByLevel((prev) => ({ ...prev, [activeLevel.id]: names }));
  };

  const handleLevelChange = (id: string) => {
    const level = levels.find((candidate) => candidate.id === id);
    if (level) trackLevelViewed(level.label);
    setActiveId(id);
  };

  const handleClose = () => modalRef.current?.requestClose();

  const { Icon } = activeLevel;

  return (
    <Modal
      ref={modalRef}
      title="הרשאות מסמך"
      width={560}
      maxHeight="80vh"
      onClose={onClose}
      footer={
        <Button type="button" onClick={handleClose} data-testid={DOC_PERMISSIONS_MODAL_IDS.doneBtn}>
          סיום
        </Button>
      }
      data-testid={DOC_PERMISSIONS_MODAL_IDS.root}
    >
      <PermissionBody>
        <UnderlineTabs tabs={tabs} activeId={activeId} onChange={handleLevelChange} />

        <LevelHeader>
          <LevelIcon>
            <Icon size={16} aria-hidden="true" />
          </LevelIcon>
          <LevelName>{activeLevel.label}</LevelName>
        </LevelHeader>

        <LevelDescription data-testid={DOC_PERMISSIONS_MODAL_IDS.description}>
          {activeLevel.description}
        </LevelDescription>

        <MembersLabel>
          מורשים
          <MemberCount data-testid={DOC_PERMISSIONS_MODAL_IDS.memberCount}>
            {activeMembers.length}
          </MemberCount>
        </MembersLabel>

        {/* Keyed by level so switching tabs remounts the control: without it the
            open dropdown and its search text would carry across to a level they
            were never typed for. */}
        <SearchableMultiSelect
          key={activeLevel.id}
          options={peopleNames}
          selected={activeMembers}
          onChange={handleMembersChange}
          placeholder="חיפוש שם..."
          data-testid={DOC_PERMISSIONS_MODAL_IDS.membersSelect}
        />
      </PermissionBody>
    </Modal>
  );
};
