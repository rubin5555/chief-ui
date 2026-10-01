import { useMemo, useRef, useState } from 'react';
import { DOCUMENT_FALLBACK, useDocument } from '@/api/docs';
import type { Member } from '@/components/PeoplePicker';
import { MembersPanel, PeopleSourcesPanel } from '@/components/PeoplePicker';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { PermissionLevelNav } from './components/PermissionLevelNav';
import { SectionAssignmentTree } from './components/SectionAssignmentTree';
import { useDocPermissionsModalAnalytics } from './DocPermissionsModal.analytics';
import { buildPermissionLevels } from './DocPermissionsModal.constants';
import { PermissionBody, SideColumn } from './DocPermissionsModal.styles';
import { DOC_PERMISSIONS_MODAL_IDS } from './DocPermissionsModal.testids';

const WIDTH = 1200;
const WIDTH_WITH_SECTIONS = 1260;
const MEMBERS_WIDTH = 240;
const SECTIONS_WIDTH = 288;

export interface DocPermissionsModalProps {
  // Named by whoever opens the dialog, not read off the route: the catalog
  // opens it for a row from `/catalog`, where there is no `$id` to read.
  docId: string;
  isDistributed: boolean;
  initialLevelId?: string;
  initialSectionId?: string;
  onClose: () => void;
}

export const DocPermissionsModal = ({
  docId,
  isDistributed,
  initialLevelId,
  initialSectionId,
  onClose,
}: DocPermissionsModalProps) => {
  const modalRef = useRef<ModalHandle>(null);
  const { data } = useDocument(docId);
  const subjects = data?.subjects ?? DOCUMENT_FALLBACK.subjects;

  const levels = useMemo(() => buildPermissionLevels(isDistributed), [isDistributed]);

  const [activeId, setActiveId] = useState(initialLevelId ?? levels[0].id);
  const [membersByLevel, setMembersByLevel] = useState<Record<string, Member[]>>({});
  const [sectionsByMember, setSectionsByMember] = useState<Record<string, string[]>>({});
  const [selectedSectionIds, setSelectedSectionIds] = useState<string[]>(
    initialSectionId ? [initialSectionId] : [],
  );
  const { trackLevelViewed, trackMembersChanged } = useDocPermissionsModalAnalytics();

  const activeLevel = levels.find((level) => level.id === activeId) ?? levels[0];
  const activeMembers = membersByLevel[activeLevel.id] ?? [];

  const handleMembersChange = (next: Member[]) => {
    if (activeLevel.isSectionScoped && selectedSectionIds.length > 0) {
      const before = new Set(activeMembers.map((member) => member.id));
      const added = next.filter((member) => !before.has(member.id));
      if (added.length > 0) {
        setSectionsByMember((prev) => {
          const updated = { ...prev };
          for (const member of added) {
            updated[member.id] = [...new Set([...(prev[member.id] ?? []), ...selectedSectionIds])];
          }
          return updated;
        });
      }
    }

    trackMembersChanged(activeLevel.label, next.length);
    setMembersByLevel((prev) => ({ ...prev, [activeLevel.id]: next }));
  };

  const handleRemoveMember = (memberId: string) => {
    setMembersByLevel((prev) => ({
      ...prev,
      [activeLevel.id]: (prev[activeLevel.id] ?? []).filter((member) => member.id !== memberId),
    }));
  };

  const handleUnassign = (memberId: string, sectionId: string) => {
    const remaining = (sectionsByMember[memberId] ?? []).filter(
      (candidate) => candidate !== sectionId,
    );
    setSectionsByMember((prev) => ({ ...prev, [memberId]: remaining }));

    if (remaining.length === 0) handleRemoveMember(memberId);
  };

  const handleToggleSection = (sectionId: string) =>
    setSelectedSectionIds((prev) =>
      prev.includes(sectionId)
        ? prev.filter((candidate) => candidate !== sectionId)
        : [...prev, sectionId],
    );

  const handleClearSections = () => setSelectedSectionIds([]);

  const handleLevelChange = (levelId: string) => {
    const level = levels.find((candidate) => candidate.id === levelId);
    if (level) trackLevelViewed(level.label);
    setActiveId(levelId);
  };

  const handleClose = () => modalRef.current?.requestClose();

  const footer = (
    <>
      <Button
        type="button"
        variant="ghost"
        onClick={handleClose}
        data-testid={DOC_PERMISSIONS_MODAL_IDS.cancelBtn}
      >
        ביטול
      </Button>
      <Button type="button" onClick={handleClose} data-testid={DOC_PERMISSIONS_MODAL_IDS.doneBtn}>
        אישור
      </Button>
    </>
  );

  return (
    <Modal
      ref={modalRef}
      title="הרשאות מסמך"
      width={activeLevel.isSectionScoped ? WIDTH_WITH_SECTIONS : WIDTH}
      maxWidth="96vw"
      height="min(600px, 92vh)"
      footer={footer}
      footerAlign="between"
      noBodyPadding
      onClose={onClose}
      data-testid={DOC_PERMISSIONS_MODAL_IDS.root}
    >
      <PermissionBody>
        <PermissionLevelNav levels={levels} activeId={activeId} onSelect={handleLevelChange} />

        <SideColumn $width={activeLevel.isSectionScoped ? SECTIONS_WIDTH : MEMBERS_WIDTH}>
          {activeLevel.isSectionScoped ? (
            <SectionAssignmentTree
              subjects={subjects}
              members={activeMembers}
              sectionsByMember={sectionsByMember}
              selectedSectionIds={selectedSectionIds}
              onToggleSection={handleToggleSection}
              onClearSections={handleClearSections}
              onUnassign={handleUnassign}
            />
          ) : (
            <MembersPanel members={activeMembers} onRemove={handleRemoveMember} title="מורשים" />
          )}
        </SideColumn>

        <PeopleSourcesPanel
          key={activeLevel.id}
          members={activeMembers}
          onMembersChange={handleMembersChange}
        />
      </PermissionBody>
    </Modal>
  );
};
