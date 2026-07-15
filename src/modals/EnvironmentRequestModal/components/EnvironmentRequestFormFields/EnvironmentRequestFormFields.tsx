import type { ChangeEvent } from 'react';
import { memo } from 'react';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Select } from '@/components/ui/Select';
import type { ApproverRank, EnvironmentRequestForm } from '../../EnvironmentRequestModal.constants';
import {
  BODY_TYPE_OPTIONS,
  CREATOR_SLOTS,
  DEPARTMENT_OPTIONS,
  ENV_PEOPLE_OPTIONS,
  TEMPLATE_OPTIONS,
} from '../../EnvironmentRequestModal.constants';
import {
  CreatorsStack,
  FieldGrid,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSubLabel,
} from '../../EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';
import { ApproversByRankField } from '../ApproversByRankField';

// Each field below is memoized and receives only its own slice of the form, not the whole
// object — since the parent's setForm spread keeps untouched fields referentially stable,
// typing in one field only re-renders that field's component, not the whole form.

interface BodyTypeFieldProps {
  value: string;
  onChange: (bodyType: string) => void;
}
const BodyTypeField = memo(({ value, onChange }: BodyTypeFieldProps) => (
  <FieldGroup>
    <FieldLabel htmlFor="env-body-type">סוג הגוף</FieldLabel>
    <Select
      id="env-body-type"
      data-testid={ENV_REQUEST_MODAL_IDS.bodyTypeSelect}
      options={BODY_TYPE_OPTIONS}
      value={value}
      onChange={onChange}
      placeholder="בחר סוג גוף..."
    />
  </FieldGroup>
));

interface NameFieldProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const NameField = memo(({ value, onChange }: NameFieldProps) => (
  <FieldGroup>
    <FieldLabel htmlFor="env-name">שם הגוף</FieldLabel>
    <FieldInput
      id="env-name"
      data-testid={ENV_REQUEST_MODAL_IDS.nameInput}
      type="text"
      value={value}
      onChange={onChange}
      placeholder="הזן שם הגוף..."
      dir="rtl"
    />
  </FieldGroup>
));

interface LogoFieldProps {
  previewUrl: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}
const LogoField = memo(({ previewUrl, onFileSelect, onClear }: LogoFieldProps) => (
  <FieldGroup>
    <FieldLabel>תמונת סביבה</FieldLabel>
    <FileUploadField
      data-testid={ENV_REQUEST_MODAL_IDS.logoUpload}
      removeTestId={ENV_REQUEST_MODAL_IDS.logoRemove}
      previewUrl={previewUrl || null}
      onFileSelect={onFileSelect}
      onClear={onClear}
    />
  </FieldGroup>
));

interface CreatorsFieldProps {
  value: string[];
  onChange: (index: number) => (v: string) => void;
}
const CreatorsField = memo(({ value, onChange }: CreatorsFieldProps) => (
  <FieldGroup>
    <FieldLabel>
      יוצרי המסמכים
      <FieldSubLabel>(עד 3)</FieldSubLabel>
    </FieldLabel>
    <CreatorsStack>
      {CREATOR_SLOTS.map((index) => (
        <SearchableSelect
          key={index}
          data-testid={ENV_REQUEST_MODAL_IDS.creatorSelect(index)}
          options={ENV_PEOPLE_OPTIONS}
          value={value[index] ?? ''}
          onChange={onChange(index)}
          placeholder={`שם יוצר ${index + 1}...`}
        />
      ))}
    </CreatorsStack>
  </FieldGroup>
));

interface ApproversFieldProps {
  value: Record<ApproverRank, string[]>;
  onChange: (rank: ApproverRank, selected: string[]) => void;
}
const ApproversField = memo(({ value, onChange }: ApproversFieldProps) => (
  <FieldGroup>
    <FieldLabel>מאשרי המסמכים לפי סוג אישור</FieldLabel>
    <ApproversByRankField value={value} onChange={onChange} options={ENV_PEOPLE_OPTIONS} />
  </FieldGroup>
));

interface DistributorsFieldProps {
  value: string[];
  onChange: (distributors: string[]) => void;
}
const DistributorsField = memo(({ value, onChange }: DistributorsFieldProps) => (
  <FieldGroup>
    <FieldLabel>מפיצי המסמך</FieldLabel>
    <SearchableMultiSelect
      data-testid={ENV_REQUEST_MODAL_IDS.distributorsSelect}
      options={ENV_PEOPLE_OPTIONS}
      selected={value}
      onChange={onChange}
      placeholder="בחר מפיצים..."
    />
  </FieldGroup>
));

interface PhoneFieldsProps {
  mobilePhone: string;
  redPhone: string;
  onMobilePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRedPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const PhoneFields = memo(
  ({ mobilePhone, redPhone, onMobilePhoneChange, onRedPhoneChange }: PhoneFieldsProps) => (
    <FieldGrid>
      <FieldGroup>
        <FieldLabel htmlFor="env-mobile-phone">טלפון נייד ליצירת קשר</FieldLabel>
        <FieldInput
          id="env-mobile-phone"
          data-testid={ENV_REQUEST_MODAL_IDS.mobilePhoneInput}
          type="tel"
          value={mobilePhone}
          onChange={onMobilePhoneChange}
          placeholder="05X-XXXXXXX"
          dir="ltr"
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel htmlFor="env-red-phone">טלפון אדום ליצירת קשר</FieldLabel>
        <FieldInput
          id="env-red-phone"
          data-testid={ENV_REQUEST_MODAL_IDS.redPhoneInput}
          type="tel"
          value={redPhone}
          onChange={onRedPhoneChange}
          placeholder="XXXX"
          dir="ltr"
        />
      </FieldGroup>
    </FieldGrid>
  ),
);

interface TemplatesAndDepartmentsFieldsProps {
  templates: string[];
  departments: string[];
  onTemplatesChange: (templates: string[]) => void;
  onDepartmentsChange: (departments: string[]) => void;
}
const TemplatesAndDepartmentsFields = memo(
  ({
    templates,
    departments,
    onTemplatesChange,
    onDepartmentsChange,
  }: TemplatesAndDepartmentsFieldsProps) => (
    <FieldGrid>
      <FieldGroup>
        <FieldLabel>בחירת תבניות</FieldLabel>
        <MultiSelectDropdown
          data-testid={ENV_REQUEST_MODAL_IDS.templatesSelect}
          options={TEMPLATE_OPTIONS}
          selected={templates}
          onChange={onTemplatesChange}
          placeholder="בחר תבניות..."
        />
      </FieldGroup>
      <FieldGroup>
        <FieldLabel>בחירת מחלקות</FieldLabel>
        <MultiSelectDropdown
          data-testid={ENV_REQUEST_MODAL_IDS.departmentsSelect}
          options={DEPARTMENT_OPTIONS}
          selected={departments}
          onChange={onDepartmentsChange}
          placeholder="בחר מחלקות..."
        />
      </FieldGroup>
    </FieldGrid>
  ),
);

interface EnvironmentRequestFormFieldsProps {
  form: EnvironmentRequestForm;
  onBodyTypeChange: (bodyType: string) => void;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLogoFileSelect: (file: File) => void;
  onLogoClear: () => void;
  onCreatorChange: (index: number) => (v: string) => void;
  onApproverChange: (rank: ApproverRank, selected: string[]) => void;
  onDistributorsChange: (distributors: string[]) => void;
  onMobilePhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onRedPhoneChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTemplatesChange: (templates: string[]) => void;
  onDepartmentsChange: (departments: string[]) => void;
}

export const EnvironmentRequestFormFields = ({
  form,
  onBodyTypeChange,
  onNameChange,
  onLogoFileSelect,
  onLogoClear,
  onCreatorChange,
  onApproverChange,
  onDistributorsChange,
  onMobilePhoneChange,
  onRedPhoneChange,
  onTemplatesChange,
  onDepartmentsChange,
}: EnvironmentRequestFormFieldsProps) => (
  <>
    <BodyTypeField value={form.bodyType} onChange={onBodyTypeChange} />
    <NameField value={form.name} onChange={onNameChange} />
    <LogoField
      previewUrl={form.logoPreview}
      onFileSelect={onLogoFileSelect}
      onClear={onLogoClear}
    />
    <CreatorsField value={form.creators} onChange={onCreatorChange} />
    <ApproversField value={form.approvers} onChange={onApproverChange} />
    <DistributorsField value={form.distributors} onChange={onDistributorsChange} />
    <PhoneFields
      mobilePhone={form.mobilePhone}
      redPhone={form.redPhone}
      onMobilePhoneChange={onMobilePhoneChange}
      onRedPhoneChange={onRedPhoneChange}
    />
    <TemplatesAndDepartmentsFields
      templates={form.templates}
      departments={form.departments}
      onTemplatesChange={onTemplatesChange}
      onDepartmentsChange={onDepartmentsChange}
    />
  </>
);
