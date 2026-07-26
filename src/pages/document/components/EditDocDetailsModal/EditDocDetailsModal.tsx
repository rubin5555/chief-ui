import { useForm } from '@tanstack/react-form';
import type { ChangeEvent } from 'react';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import type { DocumentHeader } from '../../types';
import {
  CLASSIFICATION_OPTIONS,
  DEPARTMENT_OPTIONS,
  type EditDocDetailsMode,
  MODAL_TITLES,
  ORGANIZATION_OPTIONS,
  SUBMIT_LABELS,
} from './EditDocDetailsModal.constants';
import {
  Body,
  CancelBtn,
  DirtyWarning,
  Field,
  FieldLabel,
  FieldRow,
  NameInput,
  SubmitBtn,
} from './EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from './EditDocDetailsModal.testids';

export interface EditDocDetailsModalProps {
  mode: EditDocDetailsMode;
  header: DocumentHeader;
  onClose: () => void;
  onSave: (header: DocumentHeader) => void;
}

// Multi-mode per the phased plan (edit/duplicate/issue-update/issue-new),
// pattern-matched on TemplateModal.tsx's `useForm` + mode-prop shape. Only
// `edit` has a real trigger wired up today (DocHeaderCard's pencil icon) --
// duplicate/issue-update/issue-new have no doc-list/catalog page in dev yet
// to navigate from/to, so they're implemented but not yet reachable from
// the UI. Fields are limited to what DocumentHeader actually models (name/
// organization/department/effectiveDate/classification) -- template/
// orderNum/referenceNum are treated as fixed identity, not edited here.
export const EditDocDetailsModal = ({
  mode,
  header,
  onClose,
  onSave,
}: EditDocDetailsModalProps) => {
  const form = useForm({
    defaultValues: {
      name: header.name,
      organization: header.organization,
      department: header.department,
      effectiveDate: header.effectiveDate,
      classification: header.classification,
    },
    onSubmit: ({ value }) => onSave({ ...header, ...value }),
  });

  const handleSubmit = () => form.handleSubmit();

  return (
    <Modal
      title={MODAL_TITLES[mode]}
      onClose={onClose}
      width={480}
      data-testid={EDIT_DOC_DETAILS_MODAL_IDS.root}
      footer={
        <>
          <CancelBtn type="button" onClick={onClose}>
            ביטול
          </CancelBtn>
          <SubmitBtn
            type="button"
            onClick={handleSubmit}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.submitBtn}
          >
            {SUBMIT_LABELS[mode]}
          </SubmitBtn>
        </>
      }
    >
      <Body>
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

        <form.Field name="name">
          {(field) => {
            const handleChange = (e: ChangeEvent<HTMLInputElement>) =>
              field.handleChange(e.target.value);
            return (
              <Field>
                <FieldLabel htmlFor={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}>שם המסמך</FieldLabel>
                <NameInput
                  id={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                  value={field.state.value}
                  onChange={handleChange}
                  dir="rtl"
                />
              </Field>
            );
          }}
        </form.Field>

        <FieldRow>
          <form.Field name="organization">
            {(field) => (
              <Field>
                <FieldLabel as="span">ארגון</FieldLabel>
                <Select
                  options={ORGANIZATION_OPTIONS}
                  value={field.state.value}
                  onChange={field.handleChange}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.organizationSelect}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="department">
            {(field) => (
              <Field>
                <FieldLabel as="span">מחלקה</FieldLabel>
                <Select
                  options={DEPARTMENT_OPTIONS}
                  value={field.state.value}
                  onChange={field.handleChange}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.departmentSelect}
                />
              </Field>
            )}
          </form.Field>
        </FieldRow>

        <FieldRow>
          <form.Field name="classification">
            {(field) => (
              <Field>
                <FieldLabel as="span">סיווג</FieldLabel>
                <Select
                  options={CLASSIFICATION_OPTIONS}
                  value={field.state.value}
                  onChange={field.handleChange}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.classificationSelect}
                />
              </Field>
            )}
          </form.Field>

          <form.Field name="effectiveDate">
            {(field) => (
              <Field>
                <FieldLabel as="span">תאריך תוקף</FieldLabel>
                <DateTimePicker
                  value={field.state.value}
                  onChange={field.handleChange}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.effectiveDate}
                />
              </Field>
            )}
          </form.Field>
        </FieldRow>
      </Body>
    </Modal>
  );
};
