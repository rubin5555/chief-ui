import type { FormEvent } from 'react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';
import type { ModalHandle } from '@/components/ui/Modal';
import { Modal } from '@/components/ui/Modal';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import { chunkGuard } from '../../utils/chunkRecovery';
import { DocumentDetailsForm } from './components/DocumentDetailsForm';
import { PermissionsPopover } from './components/PermissionsPopover';
import { TemplateModalBody } from './components/TemplateModalBody';
import { useAppendices } from './hooks/useAppendices';
import { useEmphasis } from './hooks/useEmphasis';
import { useFieldBank } from './hooks/useFieldBank';
import { usePermissionsTarget } from './hooks/usePermissionsTarget';
import { useTemplateForm } from './hooks/useTemplateForm';
import { useTemplateModalAnalytics } from './TemplateModal.analytics';
import type { TemplateDraft, TemplateModalMode } from './TemplateModal.constants';
import { MODAL_TITLES, SAVE_LABELS } from './TemplateModal.constants';
import { DetailsSection } from './TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from './TemplateModal.testids';

const DataImportModal = lazy(
  chunkGuard(() =>
    import('@/modals/DataImportModal').then((m) => ({ default: m.DataImportModal })),
  ),
);

interface TemplateModalProps {
  mode?: TemplateModalMode;
  initialName?: string;
  departmentOptions: string[];
  currentUserId?: string;
  onClose: () => void;
  onSave: (draft: TemplateDraft) => void;
}

const FORM_ID = 'template-details-form';

export const TemplateModal = ({
  mode = 'new',
  initialName = '',
  departmentOptions,
  currentUserId,
  onClose,
  onSave,
}: TemplateModalProps) => {
  const form = useTemplateForm(initialName);
  const tree = useDocumentTree();
  const emphasis = useEmphasis();

  const {
    trackModalOpened,
    trackSubjectAdded,
    trackSectionAdded,
    trackSubSectionAdded,
    trackPermissionsChanged,
    trackFieldsImported,
    trackFieldDragged,
    trackSaveClicked,
    trackCancelled,
  } = useTemplateModalAnalytics();

  const appendicesState = useAppendices();
  const fieldBank = useFieldBank(trackFieldsImported);
  const permissions = usePermissionsTarget(trackPermissionsChanged);

  useEffect(() => {
    trackModalOpened(mode);
  }, [mode, trackModalOpened]);

  const isStructureDirty =
    tree.subjects.length > 0 ||
    appendicesState.appendices.length > 0 ||
    fieldBank.importedFields.length > 0 ||
    emphasis.hasEmphasis;

  const modalRef = useRef<ModalHandle>(null);

  const handleClose = () => {
    trackCancelled(mode);
    modalRef.current?.requestClose();
  };

  const onDetailsFormSubmit = (e: FormEvent) => {
    e.preventDefault();
    const isDupBlocked = mode === 'duplicate' && form.state.values.name === initialName;
    const isEditBlocked = mode === 'edit' && !form.state.isDirty && !isStructureDirty;
    if (isDupBlocked || isEditBlocked) return;

    trackSaveClicked(mode);
    onSave({
      mode,
      values: form.state.values,
      subjects: tree.subjects,
      appendices: appendicesState.appendices,
      fields: fieldBank.importedFields,
      emphasis: { enabled: emphasis.hasEmphasis, text: emphasis.emphasisText },
    });
    modalRef.current?.requestClose();
  };

  const body = (
    <TemplateModalBody
      tree={tree}
      permissions={permissions}
      appendicesState={appendicesState}
      fieldBank={fieldBank}
      emphasis={emphasis}
      onSubjectAdded={trackSubjectAdded}
      onSectionAdded={trackSectionAdded}
      onSubSectionAdded={trackSubSectionAdded}
      onFieldDragged={trackFieldDragged}
    />
  );

  const footer = (
    <form.Subscribe selector={(state) => ({ isDirty: state.isDirty, name: state.values.name })}>
      {({ isDirty, name }) => {
        const isDupBlocked = mode === 'duplicate' && name === initialName;
        const isEditBlocked = mode === 'edit' && !isDirty && !isStructureDirty;
        const isDisabled = isDupBlocked || isEditBlocked;

        return (
          <>
            <Button
              type="button"
              variant="secondary"
              size="lg"
              data-testid={TEMPLATE_MODAL_IDS.cancelBtn}
              onClick={handleClose}
            >
              ביטול
            </Button>
            <Button
              type="submit"
              form={FORM_ID}
              size="lg"
              disabled={isDisabled}
              data-testid={TEMPLATE_MODAL_IDS.saveBtn}
            >
              {SAVE_LABELS[mode]}
            </Button>
          </>
        );
      }}
    </form.Subscribe>
  );

  return (
    <Modal
      ref={modalRef}
      title={MODAL_TITLES[mode]}
      onClose={onClose}
      onRequestClose={handleClose}
      footer={footer}
      width={1140}
      maxWidth="96vw"
      height="90vh"
      noBodyPadding
      data-testid={TEMPLATE_MODAL_IDS.root}
    >
      <DetailsSection id={FORM_ID} onSubmit={onDetailsFormSubmit}>
        <DocumentDetailsForm
          form={form}
          mode={mode}
          initialName={initialName}
          departmentOptions={departmentOptions}
        />
      </DetailsSection>

      {currentUserId ? <CollabProvider userId={currentUserId}>{body}</CollabProvider> : body}

      {permissions.permTarget && (
        <PermissionsPopover
          target={permissions.permTarget}
          onClose={permissions.closePermissions}
          onPermissionsChanged={permissions.changePermissions}
        />
      )}

      {fieldBank.isImportPickerOpen && (
        <Suspense fallback={<ModalLoading />}>
          <DataImportModal
            existingFields={fieldBank.importedFields}
            onAdd={fieldBank.addImportedFields}
            onRemove={fieldBank.removeImportedField}
            onClose={fieldBank.closeImportPicker}
          />
        </Suspense>
      )}
    </Modal>
  );
};
