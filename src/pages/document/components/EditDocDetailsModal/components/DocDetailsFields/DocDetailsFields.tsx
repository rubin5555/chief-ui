import type { ChangeEvent } from 'react';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Select } from '@/components/ui/Select';
import {
  CLASSIFICATION_OPTIONS,
  DEPARTMENT_OPTIONS,
  DUPLICATE_NAME_HINT,
  ORGANIZATION_OPTIONS,
} from '../../EditDocDetailsModal.constants';
import {
  Field,
  FieldHint,
  FieldLabel,
  FieldRow,
  LabelRow,
  NameInput,
  ReadOnlyValue,
} from '../../EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import type { DocDetailsForm } from '../../useDocDetailsForm';

export interface DocDetailsFieldsProps {
  form: DocDetailsForm;
  /** Duplicate mode demands a new name before it will submit. */
  needsRename: boolean;
  /** Past editing, every field is a fact rather than a control (main's isLimitedEdit). */
  isLimitedEdit: boolean;
  onNameTouched: () => void;
}

// The document's editable details. Split out of EditDocDetailsModal so that
// component stays the modal's chrome, its dirty tracking and its footer — which is
// where its four modes differ. The fields are the same in all of them.
export const DocDetailsFields = ({
  form,
  needsRename,
  isLimitedEdit,
  onNameTouched,
}: DocDetailsFieldsProps) => (
  <>
    <form.Field name="name">
      {(field) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          field.handleChange(event.target.value);
          onNameTouched();
        };

        return (
          <Field>
            <FieldLabel htmlFor={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}>
              <LabelRow>
                שם המסמך
                {needsRename && (
                  <FieldHint data-testid={EDIT_DOC_DETAILS_MODAL_IDS.duplicateNameHint}>
                    {DUPLICATE_NAME_HINT}
                  </FieldHint>
                )}
              </LabelRow>
            </FieldLabel>
            {isLimitedEdit ? (
              <ReadOnlyValue data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue('name')}>
                {field.state.value}
              </ReadOnlyValue>
            ) : (
              <NameInput
                id={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                $needsRename={needsRename}
                value={field.state.value}
                onChange={handleChange}
                dir="rtl"
              />
            )}
          </Field>
        );
      }}
    </form.Field>

    <FieldRow>
      <form.Field name="organization">
        {(field) => (
          <Field>
            <FieldLabel as="span">ארגון</FieldLabel>
            {isLimitedEdit ? (
              <ReadOnlyValue data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue('organization')}>
                {field.state.value}
              </ReadOnlyValue>
            ) : (
              <Select
                options={ORGANIZATION_OPTIONS}
                value={field.state.value}
                onChange={field.handleChange}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.organizationSelect}
              />
            )}
          </Field>
        )}
      </form.Field>

      <form.Field name="department">
        {(field) => (
          <Field>
            <FieldLabel as="span">מחלקה</FieldLabel>
            {isLimitedEdit ? (
              <ReadOnlyValue data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue('department')}>
                {field.state.value}
              </ReadOnlyValue>
            ) : (
              <Select
                options={DEPARTMENT_OPTIONS}
                value={field.state.value}
                onChange={field.handleChange}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.departmentSelect}
              />
            )}
          </Field>
        )}
      </form.Field>
    </FieldRow>

    <FieldRow>
      <form.Field name="classification">
        {(field) => (
          <Field>
            <FieldLabel as="span">סיווג</FieldLabel>
            {isLimitedEdit ? (
              <ReadOnlyValue
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue('classification')}
              >
                {field.state.value}
              </ReadOnlyValue>
            ) : (
              <Select
                options={CLASSIFICATION_OPTIONS}
                value={field.state.value}
                onChange={field.handleChange}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.classificationSelect}
              />
            )}
          </Field>
        )}
      </form.Field>

      <form.Field name="effectiveDate">
        {(field) => (
          <Field>
            <FieldLabel as="span">תאריך תוקף</FieldLabel>
            {isLimitedEdit ? (
              <ReadOnlyValue
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.readOnlyValue('effectiveDate')}
              >
                {field.state.value}
              </ReadOnlyValue>
            ) : (
              <DateTimePicker
                value={field.state.value}
                onChange={field.handleChange}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.effectiveDate}
              />
            )}
          </Field>
        )}
      </form.Field>
    </FieldRow>
  </>
);
