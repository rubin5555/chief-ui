import { useForm } from '@tanstack/react-form';
import { Plus, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { lazy, Suspense, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import { ModalLoading } from '@/components/ui/ModalLoading';
import { CollabProvider } from '@/context/CollabContext';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DynamicField } from '@/modals/DataImportModal';
import { reorderById } from '@/utils/reorderById';
import { AppendixList } from './components/AppendixList';
import { DocumentDetailsForm } from './components/DocumentDetailsForm';
import { DocumentPreview } from './components/DocumentPreview';
import { FieldBankBar, FieldBankList } from './components/FieldBank';
import { PermissionsPopover } from './components/PermissionsPopover';
import { SubjectTree } from './components/SubjectTree';
import { useTemplateModalAnalytics } from './TemplateModal.analytics';
import type {
  Appendix,
  PermissionsTarget,
  TemplateDraft,
  TemplateModalMode,
} from './TemplateModal.constants';
import { emptyTemplateFormValues, MODAL_TITLES, SAVE_LABELS } from './TemplateModal.constants';
import {
  AddNodeButton,
  BodySection,
  CloseBtn,
  DetailsSection,
  EmphasisBox,
  EmphasisLabel,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Overlay,
  Sidebar,
  SidebarFooter,
  SidebarScroll,
  SmallIconBtn,
} from './TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from './TemplateModal.testids';

const DataImportModal = lazy(() =>
  import('@/modals/DataImportModal').then((m) => ({ default: m.DataImportModal })),
);

interface TemplateModalProps {
  mode?: TemplateModalMode;
  initialName?: string;
  departmentOptions: string[];
  // Identifies this user on the collab server (plan §2/§6) — lock ownership
  // and remote-cursor labels are keyed by this id. Undefined disables collab
  // entirely (ContentEditorProvider degrades to its pre-collab local-only
  // behavior), which is what standalone/unauthenticated callers get today.
  currentUserId?: string;
  onClose: () => void;
  onSave: (draft: TemplateDraft) => void;
}

const makeAppendix = (): Appendix => ({
  id: `appendix-${self.crypto.randomUUID()}`,
  title: '',
  content: '',
  permissions: { approvers: [], editors: [] },
});

export const TemplateModal = ({
  mode = 'new',
  initialName = '',
  departmentOptions,
  currentUserId,
  onClose,
  onSave,
}: TemplateModalProps) => {
  const form = useForm({
    defaultValues: emptyTemplateFormValues(initialName),
    onSubmit: () => {},
  });
  const tree = useDocumentTree();
  const [appendices, setAppendices] = useState<Appendix[]>([]);
  const [hasEmphasis, setHasEmphasis] = useState(false);
  const [emphasisText, setEmphasisText] = useState('');
  const [permTarget, setPermTarget] = useState<PermissionsTarget | null>(null);
  const [importedFields, setImportedFields] = useState<DynamicField[]>([]);
  const [isFieldBankExpanded, setIsFieldBankExpanded] = useState(false);
  const [isImportPickerOpen, setIsImportPickerOpen] = useState(false);

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

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  // No backend yet, so every mode starts from an empty structure — any subject,
  // appendix, imported field, or emphasis text present means the user changed
  // something this session.
  const isStructureDirty =
    tree.subjects.length > 0 || appendices.length > 0 || importedFields.length > 0 || hasEmphasis;

  const handleClose = () => {
    trackCancelled(mode);
    onClose();
  };

  const onOverlayClick = () => handleClose();
  const onCardClick = (e: MouseEvent) => e.stopPropagation();

  const handleTogglePermissions = (target: PermissionsTarget) => {
    setPermTarget((prev) => (prev?.id === target.id ? null : target));
  };

  const handleClosePermissions = () => setPermTarget(null);

  const handlePermissionsChanged = (role: 'approvers' | 'editors', value: string[]) => {
    trackPermissionsChanged(role);
    setPermTarget((prev) =>
      prev ? { ...prev, permissions: { ...prev.permissions, [role]: value } } : prev,
    );
  };

  const handleAddAppendix = () => setAppendices((prev) => [...prev, makeAppendix()]);
  const handleRemoveAppendix = (id: string) =>
    setAppendices((prev) => prev.filter((appendix) => appendix.id !== id));
  const handleReorderAppendix = (draggedId: string, targetId: string) =>
    setAppendices((prev) => reorderById(prev, draggedId, targetId));
  const handleAppendixTitleChange = (id: string, title: string) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, title })));
  const handleAppendixContentChange = (id: string, content: string) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, content })));
  const handleAppendixPermissionsChange = (id: string, permissions: Appendix['permissions']) =>
    setAppendices((prev) => prev.map((a) => (a.id !== id ? a : { ...a, permissions })));

  const handleAddEmphasis = () => setHasEmphasis(true);
  const handleRemoveEmphasis = () => {
    setHasEmphasis(false);
    setEmphasisText('');
  };

  const handleOpenImportPicker = () => setIsImportPickerOpen(true);
  const handleCloseImportPicker = () => setIsImportPickerOpen(false);
  const handleCollapseFieldBank = () => setIsFieldBankExpanded(false);
  const handleExpandFieldBank = () => setIsFieldBankExpanded(true);
  const handleAddImportedFields = (fields: DynamicField[]) => {
    trackFieldsImported(fields.length);
    setImportedFields((prev) => [...prev, ...fields]);
    setIsFieldBankExpanded(true);
  };
  const handleRemoveImportedField = (id: string) =>
    setImportedFields((prev) => prev.filter((field) => field.id !== id));

  const isFieldBankShown = isFieldBankExpanded && importedFields.length > 0;

  // ContentEditorProvider degrades to local-only activation (no lock
  // gating/remote cursors) when it finds no CollabProvider above it — the
  // wrapper is only mounted once a real user identity is available.
  const body = (
    <ContentEditorProvider>
      <BodySection data-testid={TEMPLATE_MODAL_IDS.body}>
        <Sidebar data-testid={TEMPLATE_MODAL_IDS.sidebar}>
          {isFieldBankShown ? (
            <>
              <FieldBankBar
                edge="top"
                showFieldsToggle
                onToggleFields={handleCollapseFieldBank}
                onOpenPicker={handleOpenImportPicker}
              />
              <FieldBankList
                fields={importedFields}
                onRemoveField={handleRemoveImportedField}
                onOpenPicker={handleOpenImportPicker}
                onFieldDragStart={trackFieldDragged}
              />
            </>
          ) : (
            <>
              <SidebarScroll>
                <SubjectTree
                  tree={tree}
                  activePermissionsId={permTarget?.id ?? null}
                  onTogglePermissions={handleTogglePermissions}
                  onSubjectAdded={trackSubjectAdded}
                  onSectionAdded={trackSectionAdded}
                  onSubSectionAdded={trackSubSectionAdded}
                />

                <SidebarFooter>
                  <AppendixList
                    appendices={appendices}
                    activePermissionsId={permTarget?.id ?? null}
                    onAdd={handleAddAppendix}
                    onRemove={handleRemoveAppendix}
                    onTitleChange={handleAppendixTitleChange}
                    onReorder={handleReorderAppendix}
                    onTogglePermissions={handleTogglePermissions}
                    onChangePermissions={handleAppendixPermissionsChange}
                  />
                  {hasEmphasis ? (
                    <EmphasisBox>
                      <EmphasisLabel>דגשים לכתיבה</EmphasisLabel>
                      <SmallIconBtn
                        type="button"
                        onClick={handleRemoveEmphasis}
                        aria-label="הסרת דגשים"
                      >
                        <X size={12} />
                      </SmallIconBtn>
                    </EmphasisBox>
                  ) : (
                    <AddNodeButton type="button" onClick={handleAddEmphasis}>
                      <Plus size={14} />
                      הוספת דגשים לכתיבת המסמך
                    </AddNodeButton>
                  )}
                </SidebarFooter>
              </SidebarScroll>
              <FieldBankBar
                edge="bottom"
                showFieldsToggle={importedFields.length > 0}
                onToggleFields={handleExpandFieldBank}
                onOpenPicker={handleOpenImportPicker}
              />
            </>
          )}
        </Sidebar>

        <DocumentPreview
          tree={tree}
          appendices={appendices}
          onAppendixTitleChange={handleAppendixTitleChange}
          onAppendixContentChange={handleAppendixContentChange}
          hasEmphasis={hasEmphasis}
          emphasisText={emphasisText}
          onEmphasisTextChange={setEmphasisText}
        />
      </BodySection>
    </ContentEditorProvider>
  );

  return (
    <Overlay data-testid={TEMPLATE_MODAL_IDS.overlay} onClick={onOverlayClick}>
      <ModalCard data-testid={TEMPLATE_MODAL_IDS.root} onClick={onCardClick} dir="rtl">
        <ModalHeader data-testid={TEMPLATE_MODAL_IDS.header}>
          <ModalTitle>{MODAL_TITLES[mode]}</ModalTitle>
          <CloseBtn type="button" data-testid={TEMPLATE_MODAL_IDS.closeBtn} onClick={handleClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <DetailsSection>
          <DocumentDetailsForm
            form={form}
            mode={mode}
            initialName={initialName}
            departmentOptions={departmentOptions}
          />
        </DetailsSection>

        {currentUserId ? <CollabProvider userId={currentUserId}>{body}</CollabProvider> : body}

        <form.Subscribe selector={(state) => ({ isDirty: state.isDirty, name: state.values.name })}>
          {({ isDirty, name }) => {
            const isDupBlocked = mode === 'duplicate' && name === initialName;
            const isEditBlocked = mode === 'edit' && !isDirty && !isStructureDirty;
            const isDisabled = isDupBlocked || isEditBlocked;

            const handleSaveClick = () => {
              if (isDisabled) return;
              trackSaveClicked(mode);
              onSave({
                mode,
                values: form.state.values,
                subjects: tree.subjects,
                appendices,
                fields: importedFields,
                emphasis: { enabled: hasEmphasis, text: emphasisText },
              });
              onClose();
            };

            return (
              <ModalFooter data-testid={TEMPLATE_MODAL_IDS.footer}>
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
                  type="button"
                  size="lg"
                  disabled={isDisabled}
                  data-testid={TEMPLATE_MODAL_IDS.saveBtn}
                  onClick={handleSaveClick}
                >
                  {SAVE_LABELS[mode]}
                </Button>
              </ModalFooter>
            );
          }}
        </form.Subscribe>

        {permTarget && (
          <PermissionsPopover
            target={permTarget}
            onClose={handleClosePermissions}
            onPermissionsChanged={handlePermissionsChanged}
          />
        )}

        {isImportPickerOpen && (
          <Suspense fallback={<ModalLoading />}>
            <DataImportModal
              existingFields={importedFields}
              onAdd={handleAddImportedFields}
              onRemove={handleRemoveImportedField}
              onClose={handleCloseImportPicker}
            />
          </Suspense>
        )}
      </ModalCard>
    </Overlay>
  );
};
