import type { ChangeEvent } from 'react';
import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Select } from '@/components/ui/Select';
import {
  DEPARTMENT_OPTIONS,
  DOC_TYPE_OPTIONS,
  DUPLICATE_NAME_HINT,
  FOLDER_OPTIONS,
} from '../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import type { DocDetailsForm } from '../../useDocDetailsForm';
import {
  FieldGrid,
  FieldHint,
  FullWidthField,
  LabelRow,
  NameInput,
} from '../components.shared.styles';
import { DocDetailField } from '../DocDetailField';
import { EntitySelector } from '../EntitySelector';

export interface DocDetailsFieldsProps {
  form: DocDetailsForm;
  needsRename: boolean;
  isLimitedEdit: boolean;
  onNameTouched: () => void;
}

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
