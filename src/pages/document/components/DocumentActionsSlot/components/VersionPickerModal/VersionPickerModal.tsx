import { DOC_VERSIONS_FALLBACK, useDocVersions } from '@/api/docs';
import { Modal } from '@/components/ui/Modal';
import { useVersionPickerModalAnalytics } from './VersionPickerModal.analytics';
import {
  CurrentTag,
  VersionLabel,
  VersionList,
  VersionMain,
  VersionMeta,
  VersionRow,
} from './VersionPickerModal.styles';
import { VERSION_PICKER_MODAL_IDS } from './VersionPickerModal.testids';

export interface VersionPickerModalProps {
  docId: string;
  onPick: (label: string) => void;
  onClose: () => void;
}

// Which earlier version to compare the document against (main's picker,
// TopNavbar.tsx:1682), opened by the navbar's compare icon.
//
// The query is inside this lazy component, so the version history is fetched when
// someone asks to compare rather than on every document load.
//
// The version tagged `נוכחית` is offered like the rest: it is the one you are
// comparing *from*, and picking it is a legitimate way to say "nothing to
// compare" — hiding it would leave the tag explaining a row that isn't there.
export const VersionPickerModal = ({ docId, onPick, onClose }: VersionPickerModalProps) => {
  const { data } = useDocVersions(docId);
  const versions = data ?? DOC_VERSIONS_FALLBACK;
  const { trackComparisonStarted } = useVersionPickerModalAnalytics();

  const handlePick = (label: string) => () => {
    trackComparisonStarted(label);
    onPick(label);
    onClose();
  };

  return (
    <Modal
      title="השוואה לגרסה"
      width={460}
      maxHeight="70vh"
      noBodyPadding
      onClose={onClose}
      data-testid={VERSION_PICKER_MODAL_IDS.root}
    >
      <VersionList>
        {versions.map((version) => (
          <VersionRow
            key={version.label}
            type="button"
            data-testid={VERSION_PICKER_MODAL_IDS.version(version.label)}
            onClick={handlePick(version.label)}
          >
            <VersionMain>
              <VersionLabel>{version.label}</VersionLabel>
              <VersionMeta>
                {version.datetime} · {version.ref} · {version.approvedBy}
              </VersionMeta>
            </VersionMain>
            {version.tag && <CurrentTag>{version.tag}</CurrentTag>}
          </VersionRow>
        ))}
      </VersionList>
    </Modal>
  );
};
