import type { ChangeEvent } from 'react';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Select } from '@/components/ui/Select';
import {
  DEPARTMENT_OPTIONS,
  DOC_TYPE_OPTIONS,
  DUPLICATE_NAME_HINT,
  FOLDER_OPTIONS,
} from '../../EditDocDetailsModal.constants';
import {
  FieldGrid,
  FieldHint,
  FullWidthField,
  LabelRow,
  NameInput,
} from '../../EditDocDetailsModal.styles';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import type { DocDetailsForm } from '../../useDocDetailsForm';
import { DocDetailField } from '../DocDetailField';
import { EntitySelector } from '../EntitySelector';

export interface DocDetailsFieldsProps {
  form: DocDetailsForm;
  /** Duplicate mode demands a new name before it will submit. */
  needsRename: boolean;
  /** Past editing, every field is a fact rather than a control (main's isLimitedEdit). */
  isLimitedEdit: boolean;
  onNameTouched: () => void;
}

// The document's editable details, in main's order and its two-column grid
// (Edit.tsx:2271). Split out of EditDocDetailsModal so that component stays the
// modal's chrome, its dirty tracking and its footer — which is where its modes
// differ. The fields are the same in all of them.
//
// The one field that stays editable past editing is the expiry date: main gates
// it on `readOnly` alone (2350), because deciding when a distributed document
// stops applying is a thing you do *after* it is distributed.
export const DocDetailsFields = ({
  form,
  needsRename,
  isLimitedEdit,
  onNameTouched,
}: DocDetailsFieldsProps) => (
  <FieldGrid>
    <FullWidthField>
      <form.Field name="name">
        {(field) => {
          const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
            field.handleChange(event.target.value);
            onNameTouched();
          };

          return (
            <DocDetailField
              name={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
              readOnly={isLimitedEdit}
              value={field.state.value}
              label={
                <LabelRow>
                  שם המסמך
                  {needsRename && (
                    <FieldHint data-testid={EDIT_DOC_DETAILS_MODAL_IDS.duplicateNameHint}>
                      {DUPLICATE_NAME_HINT}
                    </FieldHint>
                  )}
                </LabelRow>
              }
            >
              <NameInput
                id={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                data-testid={EDIT_DOC_DETAILS_MODAL_IDS.nameInput}
                $needsRename={needsRename}
                value={field.state.value}
                onChange={handleChange}
                dir="rtl"
              />
            </DocDetailField>
          );
        }}
      </form.Field>
    </FullWidthField>

    <form.Field name="department">
      {(field) => (
        <DocDetailField
          name="department"
          label="מחלקה"
          readOnly={isLimitedEdit}
          value={field.state.value}
        >
          <Select
            options={DEPARTMENT_OPTIONS}
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.departmentSelect}
          />
        </DocDetailField>
      )}
    </form.Field>

    <form.Field name="docType">
      {(field) => (
        <DocDetailField
          name="docType"
          label="סוג מסמך"
          readOnly={isLimitedEdit}
          value={field.state.value}
        >
          <Select
            options={DOC_TYPE_OPTIONS}
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.docTypeSelect}
          />
        </DocDetailField>
      )}
    </form.Field>

    <FullWidthField>
      <form.Field name="folder">
        {(field) => (
          <DocDetailField
            name="folder"
            label="שיוך לתיקייה מבצעית"
            readOnly={isLimitedEdit}
            value={field.state.value}
          >
            <Select
              options={FOLDER_OPTIONS}
              value={field.state.value}
              onChange={field.handleChange}
              data-testid={EDIT_DOC_DETAILS_MODAL_IDS.folderSelect}
            />
          </DocDetailField>
        )}
      </form.Field>
    </FullWidthField>

    <FullWidthField>
      <form.Field name="entityType">
        {(typeField) => (
          <form.Field name="entityName">
            {(nameField) => (
              <DocDetailField
                name="entity"
                label="שיוך לאמזונס"
                readOnly={isLimitedEdit}
                value={`${typeField.state.value} — ${nameField.state.value}`}
              >
                <EntitySelector
                  entityType={typeField.state.value}
                  entityName={nameField.state.value}
                  onTypeChange={typeField.handleChange}
                  onNameChange={nameField.handleChange}
                />
              </DocDetailField>
            )}
          </form.Field>
        )}
      </form.Field>
    </FullWidthField>

    <form.Field name="effectiveDate">
      {(field) => (
        <DocDetailField
          name="effectiveDate"
          label="כניסה לתוקף"
          readOnly={isLimitedEdit}
          value={field.state.value}
        >
          <DateTimePicker
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.effectiveDate}
          />
        </DocDetailField>
      )}
    </form.Field>

    <form.Field name="expiryDate">
      {(field) => (
        <DocDetailField
          name="expiryDate"
          label="יציאה מתוקף"
          readOnly={false}
          value={field.state.value}
        >
          <DateTimePicker
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.expiryDate}
          />
        </DocDetailField>
      )}
    </form.Field>
  </FieldGrid>
);
