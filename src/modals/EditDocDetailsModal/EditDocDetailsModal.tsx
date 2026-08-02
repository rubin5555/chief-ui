import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { LIMITED_EDIT_STATUSES } from '@/pages/document/document.constants';
import type { DocumentHeader } from '@/pages/document/types';
import { DocDetailsFields } from './components/DocDetailsFields';
import { DocFactsGrid } from './components/DocFactsGrid';
import { DocOptionsCard } from './components/DocOptionsCard';
import { useEditDocDetailsModalAnalytics } from './EditDocDetailsModal.analytics';
import {
  type EditDocDetailsMode,
  MODAL_MAX_HEIGHT,
  MODAL_TITLES,
  MODAL_WIDTH,
  ORDER_NUM_DIGITS,
  SUBMIT_LABELS,
} from './EditDocDetailsModal.constants';
import { Body, DirtyWarning } from './EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from './EditDocDetailsModal.testids';
import { useDocDetailsForm } from './useDocDetailsForm';

export interface EditDocDetailsModalProps {
  mode: EditDocDetailsMode;
  header: DocumentHeader;
  docStatus: string;
  onClose: () => void;
  onSave: (header: DocumentHeader) => void;
  onContinue?: (isDirty: boolean) => void;
}

const FORM_ID = 'edit-doc-details-form';

export const EditDocDetailsModal = ({
  mode,
  header,
  docStatus,
  onClose,
  onSave,
  onContinue,
}: EditDocDetailsModalProps) => {
  const [nameTouched, setNameTouched] = useState(false);

  const { trackDetailsSaved, trackReviewContinued } = useEditDocDetailsModalAnalytics();
  const form = useDocDetailsForm(header, onSave);

  const isLimitedEdit = LIMITED_EDIT_STATUSES.has(docStatus);
  const needsRename = mode === 'duplicate' && !nameTouched;

  const orderNum =
    mode === 'issue-new'
      ? String(Number(header.orderNum) + 1).padStart(ORDER_NUM_DIGITS, '0')
      : header.orderNum;
  const updateNum =
    mode === 'issue-update' ? String(Number(header.updateNum) + 1) : header.updateNum;

  const handleNameTouched = () => setNameTouched(true);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (needsRename) return;

    if (mode === 'approval') {
      const isDirty = form.state.isDirty;
      trackReviewContinued(isDirty);
      if (isDirty) onSave({ ...header, ...form.state.values });
      onContinue?.(isDirty);
      return;
    }

    trackDetailsSaved(mode);
    form.handleSubmit();
  };

  return (
    <Modal
      title={MODAL_TITLES[mode]}
      onClose={onClose}
      width={MODAL_WIDTH}
      maxHeight={MODAL_MAX_HEIGHT}
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

        <DocFactsGrid
          classification={header.classification}
          template={header.template}
          organization={header.organization}
          orderNum={orderNum}
          updateNum={updateNum}
        />

        <DocDetailsFields
          form={form}
          needsRename={needsRename}
          isLimitedEdit={isLimitedEdit}
          onNameTouched={handleNameTouched}
        />

        <DocOptionsCard form={form} isLimitedEdit={isLimitedEdit} />
      </Body>
    </Modal>
  );
};
