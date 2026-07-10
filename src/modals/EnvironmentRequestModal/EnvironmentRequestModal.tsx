import { Network, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { MultiSelectDropdown } from '@/components/ui/MultiSelectDropdown';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import { SearchableSelect } from '@/components/ui/SearchableSelect';
import { Select } from '@/components/ui/Select';
import { ApproversByRankField } from './components/ApproversByRankField';
import { useEnvironmentRequestModalAnalytics } from './EnvironmentRequestModal.analytics';
import type { ApproverRank, EnvironmentRequestForm } from './EnvironmentRequestModal.constants';
import {
  BODY_TYPE_OPTIONS,
  CREATOR_SLOTS,
  createEmptyEnvironmentRequestForm,
  DEPARTMENT_OPTIONS,
  ENV_PEOPLE_OPTIONS,
  TEMPLATE_OPTIONS,
} from './EnvironmentRequestModal.constants';
import {
  CloseBtn,
  CreatorsStack,
  FieldGrid,
  FieldGroup,
  FieldInput,
  FieldLabel,
  FieldSubLabel,
  HeaderIconBadge,
  HeaderTitleGroup,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Overlay,
} from './EnvironmentRequestModal.styles';
import { ENV_REQUEST_MODAL_IDS } from './EnvironmentRequestModal.testids';

const FORM_ID = 'env-request-form';

interface EnvironmentRequestModalProps {
  onClose: () => void;
  onSubmit: (form: EnvironmentRequestForm) => void;
}

export const EnvironmentRequestModal = ({ onClose, onSubmit }: EnvironmentRequestModalProps) => {
  const [form, setForm] = useState<EnvironmentRequestForm>(createEmptyEnvironmentRequestForm);

  const { trackModalOpened, trackLogoUploaded, trackSubmitClicked, trackCancelled } =
    useEnvironmentRequestModalAnalytics();

  useEffect(() => {
    trackModalOpened();
  }, []);

  const onCancelClick = () => {
    trackCancelled();
    onClose();
  };
  const onOverlayClick = () => onCancelClick();
  const onCardClick = (e: React.MouseEvent) => e.stopPropagation();

  const onBodyTypeChange = (bodyType: string) => setForm((f) => ({ ...f, bodyType }));
  const onNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, name: e.target.value }));

  const onLogoChange = (logoPreview: string) => {
    setForm((f) => ({ ...f, logoPreview }));
    trackLogoUploaded();
  };
  const onLogoFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (ev) => onLogoChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const onLogoClear = () => setForm((f) => ({ ...f, logoPreview: '' }));

  const onCreatorChange = (index: number) => (v: string) =>
    setForm((f) => {
      const creators = [...f.creators];
      creators[index] = v;
      return { ...f, creators };
    });

  const onApproverChange = (rank: ApproverRank, selected: string[]) =>
    setForm((f) => ({ ...f, approvers: { ...f.approvers, [rank]: selected } }));

  const onDistributorsChange = (distributors: string[]) => setForm((f) => ({ ...f, distributors }));

  const onMobilePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, mobilePhone: e.target.value }));
  const onRedPhoneChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, redPhone: e.target.value }));

  const onTemplatesChange = (templates: string[]) => setForm((f) => ({ ...f, templates }));
  const onDepartmentsChange = (departments: string[]) => setForm((f) => ({ ...f, departments }));

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackSubmitClicked(form.bodyType);
    onSubmit(form);
    onClose();
  };

  return (
    <Overlay data-testid={ENV_REQUEST_MODAL_IDS.overlay} onClick={onOverlayClick}>
      <ModalCard data-testid={ENV_REQUEST_MODAL_IDS.root} onClick={onCardClick} dir="rtl">
        <ModalHeader data-testid={ENV_REQUEST_MODAL_IDS.header}>
          <HeaderTitleGroup>
            <HeaderIconBadge>
              <Network size={16} />
            </HeaderIconBadge>
            <ModalTitle>בקשת פתיחת סביבה</ModalTitle>
          </HeaderTitleGroup>
          <CloseBtn
            type="button"
            data-testid={ENV_REQUEST_MODAL_IDS.closeBtn}
            onClick={onCancelClick}
          >
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody id={FORM_ID} onSubmit={onFormSubmit}>
          <FieldGroup>
            <FieldLabel htmlFor="env-body-type">סוג הגוף</FieldLabel>
            <Select
              id="env-body-type"
              data-testid={ENV_REQUEST_MODAL_IDS.bodyTypeSelect}
              options={BODY_TYPE_OPTIONS}
              value={form.bodyType}
              onChange={onBodyTypeChange}
              placeholder="בחר סוג גוף..."
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel htmlFor="env-name">שם הגוף</FieldLabel>
            <FieldInput
              id="env-name"
              data-testid={ENV_REQUEST_MODAL_IDS.nameInput}
              type="text"
              value={form.name}
              onChange={onNameChange}
              placeholder="הזן שם הגוף..."
              dir="rtl"
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>תמונת סביבה</FieldLabel>
            <FileUploadField
              data-testid={ENV_REQUEST_MODAL_IDS.logoUpload}
              removeTestId={ENV_REQUEST_MODAL_IDS.logoRemove}
              previewUrl={form.logoPreview || null}
              onFileSelect={onLogoFileSelect}
              onClear={onLogoClear}
            />
          </FieldGroup>

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
                  value={form.creators[index] ?? ''}
                  onChange={onCreatorChange(index)}
                  placeholder={`שם יוצר ${index + 1}...`}
                />
              ))}
            </CreatorsStack>
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>מאשרי המסמכים לפי סוג אישור</FieldLabel>
            <ApproversByRankField
              value={form.approvers}
              onChange={onApproverChange}
              options={ENV_PEOPLE_OPTIONS}
            />
          </FieldGroup>

          <FieldGroup>
            <FieldLabel>מפיצי המסמך</FieldLabel>
            <SearchableMultiSelect
              data-testid={ENV_REQUEST_MODAL_IDS.distributorsSelect}
              options={ENV_PEOPLE_OPTIONS}
              selected={form.distributors}
              onChange={onDistributorsChange}
              placeholder="בחר מפיצים..."
            />
          </FieldGroup>

          <FieldGrid>
            <FieldGroup>
              <FieldLabel htmlFor="env-mobile-phone">טלפון נייד ליצירת קשר</FieldLabel>
              <FieldInput
                id="env-mobile-phone"
                data-testid={ENV_REQUEST_MODAL_IDS.mobilePhoneInput}
                type="tel"
                value={form.mobilePhone}
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
                value={form.redPhone}
                onChange={onRedPhoneChange}
                placeholder="XXXX"
                dir="ltr"
              />
            </FieldGroup>
          </FieldGrid>

          <FieldGrid>
            <FieldGroup>
              <FieldLabel>בחירת תבניות</FieldLabel>
              <MultiSelectDropdown
                data-testid={ENV_REQUEST_MODAL_IDS.templatesSelect}
                options={TEMPLATE_OPTIONS}
                selected={form.templates}
                onChange={onTemplatesChange}
                placeholder="בחר תבניות..."
              />
            </FieldGroup>
            <FieldGroup>
              <FieldLabel>בחירת מחלקות</FieldLabel>
              <MultiSelectDropdown
                data-testid={ENV_REQUEST_MODAL_IDS.departmentsSelect}
                options={DEPARTMENT_OPTIONS}
                selected={form.departments}
                onChange={onDepartmentsChange}
                placeholder="בחר מחלקות..."
              />
            </FieldGroup>
          </FieldGrid>
        </ModalBody>

        <ModalFooter data-testid={ENV_REQUEST_MODAL_IDS.footer}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            data-testid={ENV_REQUEST_MODAL_IDS.cancelBtn}
            onClick={onCancelClick}
          >
            ביטול
          </Button>
          <Button
            type="submit"
            size="lg"
            form={FORM_ID}
            data-testid={ENV_REQUEST_MODAL_IDS.submitBtn}
          >
            שלח בקשה
          </Button>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
};
