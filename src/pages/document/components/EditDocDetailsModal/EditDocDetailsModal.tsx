import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LIMITED_EDIT_STATUSES } from '../../document.constants';
import type { DocumentHeader } from '../../types';
import { DocDetailsFields } from './components/DocDetailsFields';
import {
  type EditDocDetailsMode,
  MODAL_TITLES,
  SUBMIT_LABELS,
} from './EditDocDetailsModal.constants';
import { Body, DirtyWarning } from './EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from './EditDocDetailsModal.testids';
import { useDocDetailsForm } from './useDocDetailsForm';

export interface EditDocDetailsModalProps {
  mode: EditDocDetailsMode;
  header: DocumentHeader;
  /** Decides whether the fields are editable at all — see LIMITED_EDIT_STATUSES. */
  docStatus: string;
  onClose: () => void;
  onSave: (header: DocumentHeader) => void;
  /**
   * Approval mode only: the details step has been accepted, and `isDirty` says
   * whether the document's values were changed on the way through — which decides
   * whether the round starts straight away or asks about it first.
   */
  onContinue?: (isDirty: boolean) => void;
}

const FORM_ID = 'edit-doc-details-form';

// The document's details, in five modes that differ only in their title, their
// submit label and what submitting means (main's EditDocDetailsModal, Edit.tsx:2220).
//
// `edit` saves and closes. `approval` is the review step into an approval round:
// it saves too — main doesn't, which makes its own "these changes apply to this
// version only" warning a promise about edits it then discards — and then hands
// the flow on. `duplicate` refuses to submit until the copy has been renamed.
//
// Only `edit` and `approval` have triggers today; duplicate and the two issue
// modes wait on a catalog page dev doesn't have.
export const EditDocDetailsModal = ({
  mode,
  header,
  docStatus,
  onClose,
  onSave,
  onContinue,
}: EditDocDetailsModalProps) => {
  // Whether the name has been edited, which is what duplicate mode is waiting for.
  // Tracked separately from `isDirty` because any other field going dirty must not
  // count as having renamed the copy.
  const [nameTouched, setNameTouched] = useState(false);

  const form = useDocDetailsForm(header, onSave);

  const isLimitedEdit = LIMITED_EDIT_STATUSES.has(docStatus);
  const needsRename = mode === 'duplicate' && !nameTouched;

  const handleNameTouched = () => setNameTouched(true);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (needsRename) return;

    // Approval mode saves *and* continues: the warning it may raise next is about
    // these edits, so they have to have happened.
    if (mode === 'approval') {
      const isDirty = form.state.isDirty;
      if (isDirty) onSave({ ...header, ...form.state.values });
      onContinue?.(isDirty);
      return;
    }

    form.handleSubmit();
  };

  return (
    <Modal
      title={MODAL_TITLES[mode]}
      onClose={onClose}
      width={480}
      data-testid={EDIT_DOC_DETAILS_MODAL_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            ביטול
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={needsRename}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.submitBtn}
          >
            {SUBMIT_LABELS[mode]}
          </Button>
        </>
      }
    >
      <Body id={FORM_ID} onSubmit={handleSubmit}>
        {/* Only in edit mode. Approval mode raises the same point as a dialog of
            its own once you continue, and saying it twice would be noise. */}
        {mode === 'edit' && (
          <form.Subscribe selector={(state) => state.isDirty}>
            {(isDirty) =>
              isDirty && (
                <DirtyWarning data-testid={EDIT_DOC_DETAILS_MODAL_IDS.dirtyWarning}>
                  השינויים ייכנסו לתוקף החל מהגרסה הבאה של המסמך בלבד.
                </DirtyWarning>
              )
            }
          </form.Subscribe>
        )}

        <DocDetailsFields
          form={form}
          needsRename={needsRename}
          isLimitedEdit={isLimitedEdit}
          onNameTouched={handleNameTouched}
        />
      </Body>
    </Modal>
  );
};
