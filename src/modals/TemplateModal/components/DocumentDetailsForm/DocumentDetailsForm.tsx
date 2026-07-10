import { DateTimePicker } from '@/components/ui/DateTimePicker';
import { Select } from '@/components/ui/Select';
import { Toggle } from '@/components/ui/Toggle';
import type { TemplateFormApi, TemplateModalMode } from '../../TemplateModal.constants';
import {
  CLASSIFICATION_OPTIONS,
  CLASSIFICATION_TAG_OPTIONS,
  FOLDER_OPTIONS,
  HIGH_CLASSIFICATIONS,
  TEMPLATE_DOC_TYPE_OPTIONS,
} from '../../TemplateModal.constants';
import {
  ApprovalLabel,
  ApprovalRow,
  DetailsGrid,
  FieldGroup,
  FieldLabel,
  FieldRow,
  NameInput,
  WarnText,
} from '../../TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import { DocTypeToggle } from '../DocTypeToggle';

interface DocumentDetailsFormProps {
  form: TemplateFormApi;
  mode: TemplateModalMode;
  initialName: string;
  departmentOptions: string[];
}

export const DocumentDetailsForm = ({
  form,
  mode,
  initialName,
  departmentOptions,
}: DocumentDetailsFormProps) => {
  return (
    <DetailsGrid data-testid={TEMPLATE_MODAL_IDS.detailsForm}>
      <form.Field name="name">
        {(field) => {
          const showWarning = mode === 'duplicate' && field.state.value === initialName;
          const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
            field.handleChange(e.target.value);
          return (
            <FieldGroup>
              <FieldLabel htmlFor={TEMPLATE_MODAL_IDS.nameInput}>שם התבנית</FieldLabel>
              <NameInput
                id={TEMPLATE_MODAL_IDS.nameInput}
                data-testid={TEMPLATE_MODAL_IDS.nameInput}
                $warn={showWarning}
                value={field.state.value}
                onChange={onNameChange}
                placeholder="הזן שם תבנית..."
              />
              {showWarning && <WarnText>יש לשנות את שם התבנית לפני השכפול</WarnText>}
            </FieldGroup>
          );
        }}
      </form.Field>

      <form.Field name="docType">
        {(field) => (
          <FieldGroup>
            <FieldLabel as="span">סוג מסמך</FieldLabel>
            <DocTypeToggle
              options={TEMPLATE_DOC_TYPE_OPTIONS}
              value={field.state.value}
              onChange={field.handleChange}
            />
          </FieldGroup>
        )}
      </form.Field>

      <FieldRow>
        <form.Field name="department">
          {(field) => (
            <FieldGroup $grow>
              <FieldLabel as="span">בחירת אגף</FieldLabel>
              <Select
                data-testid={TEMPLATE_MODAL_IDS.departmentSelect}
                options={departmentOptions}
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="בחר אגף..."
              />
            </FieldGroup>
          )}
        </form.Field>
        <form.Field name="folder">
          {(field) => (
            <FieldGroup $grow>
              <FieldLabel as="span">חיבור לתיקייה</FieldLabel>
              <Select
                data-testid={TEMPLATE_MODAL_IDS.folderSelect}
                options={FOLDER_OPTIONS}
                value={field.state.value}
                onChange={field.handleChange}
                placeholder="בחר תיקייה..."
              />
            </FieldGroup>
          )}
        </form.Field>
      </FieldRow>

      <form.Field name="approvalRoundsEnabled">
        {(field) => (
          <FieldGroup>
            <FieldLabel as="span">&nbsp;</FieldLabel>
            <ApprovalRow>
              <ApprovalLabel>סבב אישורים על סעיפי הפקודה</ApprovalLabel>
              <Toggle
                data-testid={TEMPLATE_MODAL_IDS.approvalToggle}
                checked={field.state.value}
                onChange={field.handleChange}
                aria-label="סבב אישורים על סעיפי הפקודה"
              />
            </ApprovalRow>
          </FieldGroup>
        )}
      </form.Field>

      <form.Field name="classification">
        {(classificationField) => {
          const isHigh = HIGH_CLASSIFICATIONS.includes(classificationField.state.value);
          const handleClassificationChange = (value: string) => {
            classificationField.handleChange(value);
            form.setFieldValue('classificationTag', '');
          };
          return (
            <FieldRow>
              <FieldGroup $grow>
                <FieldLabel as="span">סיווג</FieldLabel>
                <Select
                  data-testid={TEMPLATE_MODAL_IDS.classificationSelect}
                  options={CLASSIFICATION_OPTIONS}
                  value={classificationField.state.value}
                  onChange={handleClassificationChange}
                  placeholder="בחר סיווג..."
                />
              </FieldGroup>
              {isHigh && (
                <form.Field name="classificationTag">
                  {(tagField) => (
                    <FieldGroup $grow>
                      <FieldLabel as="span">תגית</FieldLabel>
                      <Select
                        data-testid={TEMPLATE_MODAL_IDS.classificationTagSelect}
                        options={CLASSIFICATION_TAG_OPTIONS[classificationField.state.value] ?? []}
                        value={tagField.state.value}
                        onChange={tagField.handleChange}
                        placeholder="בחר תגית..."
                      />
                    </FieldGroup>
                  )}
                </form.Field>
              )}
            </FieldRow>
          );
        }}
      </form.Field>

      <FieldRow>
        <form.Field name="effectiveFrom">
          {(field) => (
            <FieldGroup $grow>
              <FieldLabel as="span">כניסה לתוקף</FieldLabel>
              <DateTimePicker
                data-testid={TEMPLATE_MODAL_IDS.effectiveFromPicker}
                value={field.state.value}
                onChange={field.handleChange}
              />
            </FieldGroup>
          )}
        </form.Field>
        <form.Field name="expiryTo">
          {(field) => (
            <FieldGroup $grow>
              <FieldLabel as="span">יציאה מתוקף</FieldLabel>
              <DateTimePicker
                data-testid={TEMPLATE_MODAL_IDS.expiryToPicker}
                value={field.state.value}
                onChange={field.handleChange}
              />
            </FieldGroup>
          )}
        </form.Field>
      </FieldRow>
    </DetailsGrid>
  );
};
