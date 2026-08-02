import { Network } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { EnvironmentRequestFormFields } from './components/EnvironmentRequestFormFields';
import { useEnvironmentRequestModalAnalytics } from './EnvironmentRequestModal.analytics';
import type { ApproverRank, EnvironmentRequestForm } from './EnvironmentRequestModal.constants';
import { createEmptyEnvironmentRequestForm } from './EnvironmentRequestModal.constants';
import { FormEl } from './EnvironmentRequestModal.styles';
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
  }, [trackModalOpened]);

  const modalRef = useRef<ModalHandle>(null);

  const onCancelClick = () => {
    trackCancelled();
    modalRef.current?.requestClose();
  };

  const onBodyTypeChange = useCallback(
    (bodyType: string) => setForm((f) => ({ ...f, bodyType })),
    [],
  );
  const onNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, name: e.target.value })),
    [],
  );

  const onLogoChange = useCallback(
    (logoPreview: string) => {
      setForm((f) => ({ ...f, logoPreview }));
      trackLogoUploaded();
    },
    [trackLogoUploaded],
  );
  const onLogoFileSelect = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => onLogoChange(ev.target?.result as string);
      reader.readAsDataURL(file);
    },
    [onLogoChange],
  );
  const onLogoClear = useCallback(() => setForm((f) => ({ ...f, logoPreview: '' })), []);

  const onCreatorChange = useCallback(
    (index: number) => (v: string) =>
      setForm((f) => {
        const creators = [...f.creators];
        creators[index] = v;
        return { ...f, creators };
      }),
    [],
  );

  const onApproverChange = useCallback(
    (rank: ApproverRank, selected: string[]) =>
      setForm((f) => ({ ...f, approvers: { ...f.approvers, [rank]: selected } })),
    [],
  );

  const onDistributorsChange = useCallback(
    (distributors: string[]) => setForm((f) => ({ ...f, distributors })),
    [],
  );

  const onMobilePhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, mobilePhone: e.target.value })),
    [],
  );
  const onRedPhoneChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((f) => ({ ...f, redPhone: e.target.value })),
    [],
  );

  const onTemplatesChange = useCallback(
    (templates: string[]) => setForm((f) => ({ ...f, templates })),
    [],
  );
  const onDepartmentsChange = useCallback(
    (departments: string[]) => setForm((f) => ({ ...f, departments })),
    [],
  );

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    trackSubmitClicked(form.bodyType);
    onSubmit(form);
    modalRef.current?.requestClose();
  };

  const footer = (
    <>
      <Button
        type="button"
        variant="secondary"
        size="lg"
        data-testid={ENV_REQUEST_MODAL_IDS.cancelBtn}
        onClick={onCancelClick}
      >
        ביטול
      </Button>
      <Button type="submit" size="lg" form={FORM_ID} data-testid={ENV_REQUEST_MODAL_IDS.submitBtn}>
        שלח בקשה
      </Button>
    </>
  );

  return (
    <Modal
      ref={modalRef}
      title="בקשת פתיחת סביבה"
      icon={<Network size={16} />}
      onClose={onClose}
      onRequestClose={onCancelClick}
      footer={footer}
      width={620}
      data-testid={ENV_REQUEST_MODAL_IDS.root}
    >
      <FormEl id={FORM_ID} onSubmit={onFormSubmit}>
        <EnvironmentRequestFormFields
          form={form}
          onBodyTypeChange={onBodyTypeChange}
          onNameChange={onNameChange}
          onLogoFileSelect={onLogoFileSelect}
          onLogoClear={onLogoClear}
          onCreatorChange={onCreatorChange}
          onApproverChange={onApproverChange}
          onDistributorsChange={onDistributorsChange}
          onMobilePhoneChange={onMobilePhoneChange}
          onRedPhoneChange={onRedPhoneChange}
          onTemplatesChange={onTemplatesChange}
          onDepartmentsChange={onDepartmentsChange}
        />
      </FormEl>
    </Modal>
  );
};
