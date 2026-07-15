import { Plus, X } from 'lucide-react';
import { ContentEditorProvider } from '@/components/ui/ContentEditor';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import type { DynamicField } from '@/modals/DataImportModal';
import type { Appendix, PermissionsTarget } from '../../TemplateModal.constants';
import {
  AddNodeButton,
  BodySection,
  EmphasisBox,
  EmphasisLabel,
  Sidebar,
  SidebarFooter,
  SidebarScroll,
  SmallIconBtn,
} from '../../TemplateModal.styles';
import { TEMPLATE_MODAL_IDS } from '../../TemplateModal.testids';
import { AppendixList } from '../AppendixList';
import { DocumentPreview } from '../DocumentPreview';
import { FieldBankBar, FieldBankList } from '../FieldBank';
import { SubjectTree } from '../SubjectTree';

interface TemplateModalBodyProps {
  tree: ReturnType<typeof useDocumentTree>;
  permTarget: PermissionsTarget | null;
  onTogglePermissions: (target: PermissionsTarget) => void;
  onSubjectAdded: () => void;
  onSectionAdded: () => void;
  onSubSectionAdded: () => void;
  appendices: Appendix[];
  onAddAppendix: () => void;
  onRemoveAppendix: (id: string) => void;
  onReorderAppendix: (draggedId: string, targetId: string) => void;
  onAppendixTitleChange: (id: string, title: string) => void;
  onAppendixContentChange: (id: string, content: string) => void;
  onAppendixPermissionsChange: (id: string, permissions: Appendix['permissions']) => void;
  hasEmphasis: boolean;
  emphasisText: string;
  onEmphasisTextChange: (text: string) => void;
  onAddEmphasis: () => void;
  onRemoveEmphasis: () => void;
  isFieldBankShown: boolean;
  importedFields: DynamicField[];
  onOpenImportPicker: () => void;
  onCollapseFieldBank: () => void;
  onExpandFieldBank: () => void;
  onRemoveImportedField: (id: string) => void;
  onFieldDragged: (fieldName: string) => void;
}

export const TemplateModalBody = ({
  tree,
  permTarget,
  onTogglePermissions,
  onSubjectAdded,
  onSectionAdded,
  onSubSectionAdded,
  appendices,
  onAddAppendix,
  onRemoveAppendix,
  onReorderAppendix,
  onAppendixTitleChange,
  onAppendixContentChange,
  onAppendixPermissionsChange,
  hasEmphasis,
  emphasisText,
  onEmphasisTextChange,
  onAddEmphasis,
  onRemoveEmphasis,
  isFieldBankShown,
  importedFields,
  onOpenImportPicker,
  onCollapseFieldBank,
  onExpandFieldBank,
  onRemoveImportedField,
  onFieldDragged,
}: TemplateModalBodyProps) => {
  const activePermissionsId = permTarget?.id ?? null;

  return (
    <ContentEditorProvider>
      <BodySection data-testid={TEMPLATE_MODAL_IDS.body}>
        <Sidebar data-testid={TEMPLATE_MODAL_IDS.sidebar}>
          {isFieldBankShown ? (
            <>
              <FieldBankBar
                edge="top"
                showFieldsToggle
                onToggleFields={onCollapseFieldBank}
                onOpenPicker={onOpenImportPicker}
              />
              <FieldBankList
                fields={importedFields}
                onRemoveField={onRemoveImportedField}
                onOpenPicker={onOpenImportPicker}
                onFieldDragStart={onFieldDragged}
              />
            </>
          ) : (
            <>
              <SidebarScroll>
                <SubjectTree
                  tree={tree}
                  activePermissionsId={activePermissionsId}
                  onTogglePermissions={onTogglePermissions}
                  onSubjectAdded={onSubjectAdded}
                  onSectionAdded={onSectionAdded}
                  onSubSectionAdded={onSubSectionAdded}
                />

                <SidebarFooter>
                  <AppendixList
                    appendices={appendices}
                    activePermissionsId={activePermissionsId}
                    onAdd={onAddAppendix}
                    onRemove={onRemoveAppendix}
                    onTitleChange={onAppendixTitleChange}
                    onReorder={onReorderAppendix}
                    onTogglePermissions={onTogglePermissions}
                    onChangePermissions={onAppendixPermissionsChange}
                  />
                  {hasEmphasis ? (
                    <EmphasisBox>
                      <EmphasisLabel>דגשים לכתיבה</EmphasisLabel>
                      <SmallIconBtn
                        type="button"
                        onClick={onRemoveEmphasis}
                        aria-label="הסרת דגשים"
                      >
                        <X size={12} />
                      </SmallIconBtn>
                    </EmphasisBox>
                  ) : (
                    <AddNodeButton type="button" onClick={onAddEmphasis}>
                      <Plus size={14} />
                      הוספת דגשים לכתיבת המסמך
                    </AddNodeButton>
                  )}
                </SidebarFooter>
              </SidebarScroll>
              <FieldBankBar
                edge="bottom"
                showFieldsToggle={importedFields.length > 0}
                onToggleFields={onExpandFieldBank}
                onOpenPicker={onOpenImportPicker}
              />
            </>
          )}
        </Sidebar>

        <DocumentPreview
          tree={tree}
          appendices={appendices}
          onAppendixTitleChange={onAppendixTitleChange}
          onAppendixContentChange={onAppendixContentChange}
          hasEmphasis={hasEmphasis}
          emphasisText={emphasisText}
          onEmphasisTextChange={onEmphasisTextChange}
        />
      </BodySection>
    </ContentEditorProvider>
  );
};
