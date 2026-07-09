import { useForm } from '@tanstack/react-form';
import { Plus, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import { useDocumentTree } from '@/hooks/useDocumentTree';
import { reorderById } from '@/utils/reorderById';
import { AppendixList } from './components/AppendixList';
import { DocumentDetailsForm } from './components/DocumentDetailsForm';
import { DocumentPreview } from './components/DocumentPreview';
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
  SmallIconBtn,
} from './TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from './TemplateModal.testids';

interface TemplateModalProps {
  mode?: TemplateModalMode;
  initialName?: string;
  departmentOptions: string[];
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

  const {
    trackModalOpened,
    trackSubjectAdded,
    trackSectionAdded,
    trackSubSectionAdded,
    trackPermissionsChanged,
    trackSaveClicked,
    trackCancelled,
  } = useTemplateModalAnalytics();

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  // No backend yet, so every mode starts from an empty structure — any subject,
  // appendix, or emphasis text present means the user changed something this session.
  const isStructureDirty = tree.subjects.length > 0 || appendices.length > 0 || hasEmphasis;

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

        <ContentEditorProvider>
          <BodySection data-testid={TEMPLATE_MODAL_IDS.body}>
            <Sidebar data-testid={TEMPLATE_MODAL_IDS.sidebar}>
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
      </ModalCard>
    </Overlay>
  );
};
