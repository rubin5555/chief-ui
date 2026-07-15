import type { ChangeEvent } from 'react';
import type { ApproverRank, EnvironmentRequestForm } from '../../EnvironmentRequestModal.constants';
import { ApproversField } from '../ApproversField';
import { BodyTypeField } from '../BodyTypeField';
import { CreatorsField } from '../CreatorsField';
import { DistributorsField } from '../DistributorsField';
import { LogoField } from '../LogoField';
import { NameField } from '../NameField';
import { PhoneFields } from '../PhoneFields';
import { TemplatesAndDepartmentsFields } from '../TemplatesAndDepartmentsFields';

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
