import type { ChangeEvent } from 'react';
import { Select } from '@/components/ui/Select';
import {
  CLASSIFICATION_LEVELS,
  CLASSIFICATION_TAGS,
  ENVIRONMENT_OPTIONS,
  TEMPLATE_OPTIONS,
} from '../../EditDocDetailsModal.constants';
import { EDIT_DOC_DETAILS_MODAL_IDS } from '../../EditDocDetailsModal.testids';
import type { DocDetailsForm } from '../../useDocDetailsForm';
import { PlainInput } from '../components.shared.styles';
import { DocDetailField } from '../DocDetailField';
import { IdentityGrid } from './DocIdentityFields.styles';

export interface DocIdentityFieldsProps {
  form: DocDetailsForm;
}

// The five facts `DocFactsGrid` shows read-only, plus the classification tag,
// made editable. Only a document being created renders this; everywhere else
// these are settled and the facts grid is the right component.
export const DocIdentityFields = ({ form }: DocIdentityFieldsProps) => (
  <IdentityGrid data-testid={EDIT_DOC_DETAILS_MODAL_IDS.identityGrid}>
    <form.Field name="organization">
      {(field) => (
        <DocDetailField
          readOnly={false}
          name="organization"
          label="ארגון"
          value={field.state.value}
        >
          <Select
            options={ENVIRONMENT_OPTIONS}
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.organizationSelect}
          />
        </DocDetailField>
      )}
    </form.Field>

    <form.Field name="classification">
      {(field) => {
        // Changing the level invalidates whatever tag was picked under the old
        // one, so the tag is cleared rather than left dangling.
        const handleChange = (value: string) => {
          field.handleChange(value);
          form.setFieldValue('classificationTag', '');
        };

        return (
          <DocDetailField
            name="classification"
            readOnly={false}
            label="סיווג"
            value={field.state.value}
          >
            <Select
              options={CLASSIFICATION_LEVELS}
              value={field.state.value}
              onChange={handleChange}
              data-testid={EDIT_DOC_DETAILS_MODAL_IDS.classificationSelect}
            />
          </DocDetailField>
        );
      }}
    </form.Field>

    <form.Subscribe selector={(state) => state.values.classification}>
      {(classification) => {
        const tags = CLASSIFICATION_TAGS[classification];
        if (!tags) return null;

        return (
          <form.Field name="classificationTag">
            {(field) => (
              <DocDetailField
                readOnly={false}
                name="classificationTag"
                label="תגית סיווג"
                value={field.state.value}
              >
                <Select
                  options={tags}
                  value={field.state.value}
                  onChange={field.handleChange}
                  data-testid={EDIT_DOC_DETAILS_MODAL_IDS.classificationTagSelect}
                />
              </DocDetailField>
            )}
          </form.Field>
        );
      }}
    </form.Subscribe>

    <form.Field name="template">
      {(field) => (
        <DocDetailField
          readOnly={false}
          name="template"
          label="בחירת תבנית"
          value={field.state.value}
        >
          <Select
            options={TEMPLATE_OPTIONS}
            value={field.state.value}
            onChange={field.handleChange}
            data-testid={EDIT_DOC_DETAILS_MODAL_IDS.templateSelect}
          />
        </DocDetailField>
      )}
    </form.Field>

    <form.Field name="orderNum">
      {(field) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
          field.handleChange(event.target.value);

        return (
          <DocDetailField
            name="orderNum"
            readOnly={false}
            label="מס׳ פקודה"
            value={field.state.value}
          >
            <PlainInput
              dir="rtl"
              placeholder="1"
              value={field.state.value}
              data-testid={EDIT_DOC_DETAILS_MODAL_IDS.orderNumInput}
              onChange={handleChange}
            />
          </DocDetailField>
        );
      }}
    </form.Field>

    <form.Field name="updateNum">
      {(field) => {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) =>
          field.handleChange(event.target.value);

        return (
          <DocDetailField
            name="updateNum"
            readOnly={false}
            label="מספר עדכון (מקור)"
            value={field.state.value}
          >
            <PlainInput
              dir="rtl"
              placeholder="מספר עדכון"
              value={field.state.value}
              data-testid={EDIT_DOC_DETAILS_MODAL_IDS.updateNumInput}
              onChange={handleChange}
            />
          </DocDetailField>
        );
      }}
    </form.Field>
  </IdentityGrid>
);
