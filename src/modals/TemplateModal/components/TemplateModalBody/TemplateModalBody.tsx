import { Plus, X } from 'lucide-react';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { useAppendices } from '../../hooks/useAppendices';
import type { useEmphasis } from '../../hooks/useEmphasis';
import type { useFieldBank } from '../../hooks/useFieldBank';
import type { usePermissionsTarget } from '../../hooks/usePermissionsTarget';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import { AppendixList } from '../AppendixList';
import { DocumentPreview } from '../DocumentPreview';
import { FieldBankBar, FieldBankList } from '../FieldBank';
import { SubjectTree } from '../SubjectTree';
import { AddNodeButton, SmallIconBtn } from '../TemplateModal.shared.styles';
import {
  BodySection,
  EmphasisBox,
  EmphasisLabel,
  Sidebar,
  SidebarFooter,
  SidebarScroll,
} from './TemplateModalBody.styles';

interface TemplateModalBodyProps {
  tree: ReturnType<typeof useDocumentTree>;
  permissions: ReturnType<typeof usePermissionsTarget>;
  appendicesState: ReturnType<typeof useAppendices>;
  fieldBank: ReturnType<typeof useFieldBank>;
  emphasis: ReturnType<typeof useEmphasis>;
  onSubjectAdded: () => void;
  onSectionAdded: () => void;
  onSubSectionAdded: () => void;
  onFieldDragged: (fieldName: string) => void;
}

export const TemplateModalBody = ({
  tree,
  permissions,
  appendicesState,
  fieldBank,
  emphasis,
  onSubjectAdded,
  onSectionAdded,
  onSubSectionAdded,
  onFieldDragged,
}: TemplateModalBodyProps) => {
  const activePermissionsId = permissions.permTarget?.id ?? null;

  return (
    <ContentEditorProvider>
      <BodySection data-testid={TEMPLATE_MODAL_IDS.body}>
        <Sidebar data-testid={TEMPLATE_MODAL_IDS.sidebar}>
          {fieldBank.isFieldBankShown ? (
            <>
              <FieldBankBar
                edge="top"
                showFieldsToggle
                onToggleFields={fieldBank.collapseFieldBank}
                onOpenPicker={fieldBank.openImportPicker}
              />
              <FieldBankList
                fields={fieldBank.importedFields}
                onRemoveField={fieldBank.removeImportedField}
                onToggleOrdered={fieldBank.toggleFieldOrdered}
                onSaveTableDesign={fieldBank.updateFieldTableDesign}
                onOpenPicker={fieldBank.openImportPicker}
                onFieldDragStart={onFieldDragged}
              />
            </>
          ) : (
            <>
              <SidebarScroll>
                <SubjectTree
                  tree={tree}
                  activePermissionsId={activePermissionsId}
                  onTogglePermissions={permissions.togglePermissions}
                  onSubjectAdded={onSubjectAdded}
                  onSectionAdded={onSectionAdded}
                  onSubSectionAdded={onSubSectionAdded}
                />

                <SidebarFooter>
                  <AppendixList
                    appendices={appendicesState.appendices}
                    activePermissionsId={activePermissionsId}
                    onAdd={appendicesState.addAppendix}
                    onRemove={appendicesState.removeAppendix}
                    onTitleChange={appendicesState.changeAppendixTitle}
                    onReorder={appendicesState.reorderAppendix}
                    onTogglePermissions={permissions.togglePermissions}
                    onChangePermissions={appendicesState.changeAppendixPermissions}
                  />
                  {emphasis.hasEmphasis ? (
                    <EmphasisBox>
                      <EmphasisLabel>דגשים לכתיבה</EmphasisLabel>
                      <SmallIconBtn
                        type="button"
                        onClick={emphasis.removeEmphasis}
                        aria-label="הסרת דגשים"
                      >
                        <X size={12} />
                      </SmallIconBtn>
                    </EmphasisBox>
                  ) : (
                    <AddNodeButton type="button" onClick={emphasis.addEmphasis}>
                      <Plus size={14} />
                      הוספת דגשים לכתיבת המסמך
                    </AddNodeButton>
                  )}
                </SidebarFooter>
              </SidebarScroll>
              <FieldBankBar
                edge="bottom"
                showFieldsToggle={fieldBank.importedFields.length > 0}
                onToggleFields={fieldBank.expandFieldBank}
                onOpenPicker={fieldBank.openImportPicker}
              />
            </>
          )}
        </Sidebar>

        <DocumentPreview
          tree={tree}
          appendices={appendicesState.appendices}
          onAppendixTitleChange={appendicesState.changeAppendixTitle}
          onAppendixContentChange={appendicesState.changeAppendixContent}
          hasEmphasis={emphasis.hasEmphasis}
          emphasisText={emphasis.emphasisText}
          onEmphasisTextChange={emphasis.setEmphasisText}
        />
      </BodySection>
    </ContentEditorProvider>
  );
};
