import { useQuery } from '@apollo/client';
import { ChevronLeft, Database, X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect } from 'react';
import {
  GET_SOURCE_SYSTEMS_QUERY,
  type GetSourceSystemsResult,
  SOURCE_SYSTEMS_FALLBACK,
} from '@/api/sourceSystems';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { useDialogClose } from '@/hooks/useDialogClose';
import { ColumnHeading, ColumnPane, RowGroup } from './components/columns.shared.styles';
import { FieldsColumn } from './components/FieldsColumn';
import { OperationsColumn } from './components/OperationsColumn';
import { useDataImportAnalytics } from './DataImportModal.analytics';
import type { DynamicField, SourceOperation, SourceSystem } from './DataImportModal.constants';
import { MODAL_TITLE } from './DataImportModal.constants';
import {
  Card,
  CloseBtn,
  Footer,
  FooterHint,
  Header,
  HeaderTitle,
  HeaderTitleWrap,
  Overlay,
  PickerBody,
  SubmitBtn,
  SystemChevron,
  SystemName,
  SystemRow,
} from './DataImportModal.styles';
import { DATA_IMPORT_IDS } from './DataImportModal.testids';
import { useDataImportPicker } from './useDataImportPicker';

export interface DataImportModalProps {
  existingFields: DynamicField[];
  onAdd: (fields: DynamicField[]) => void;
  onRemove: (id: string) => void;
  onClose: () => void;
}

const SYSTEMS_COLUMN_WIDTH = 144;

export const DataImportModal = ({
  existingFields,
  onAdd,
  onRemove,
  onClose,
}: DataImportModalProps) => {
  const {
    trackModalOpened,
    trackSystemSelected,
    trackOperationSelected,
    trackFieldsLinked,
    trackFieldUnlinked,
    trackClosed,
  } = useDataImportAnalytics();

  const handleFieldRemoved = (field: DynamicField) => {
    trackFieldUnlinked(field.fieldName);
    onRemove(field.id);
  };

  const picker = useDataImportPicker({ existingFields, onAdd, onRemove: handleFieldRemoved });

  const { data, loading: systemsLoading } =
    useQuery<GetSourceSystemsResult>(GET_SOURCE_SYSTEMS_QUERY);
  const sourceSystems = data?.sourceSystems ?? SOURCE_SYSTEMS_FALLBACK.sourceSystems;

  useEffect(() => {
    trackModalOpened();
  }, []);

  const { isClosing, requestClose } = useDialogClose(onClose);

  const handleClose = () => {
    trackClosed(existingFields.length);
    requestClose();
  };

  const handleCardMouseDown = (e: MouseEvent) => e.stopPropagation();

  const handleSystemPick = (system: SourceSystem) => () => {
    if (picker.selectedSystem?.id !== system.id) trackSystemSelected(system.name);
    picker.pickSystem(system);
  };

  const handleOperationSelected = (operation: SourceOperation) =>
    trackOperationSelected(operation.name);

  const handleFieldToggled = (_fieldName: string, result: { added: number; removed: number }) => {
    if (result.added > 0) trackFieldsLinked(result.added);
  };

  return (
    <Overlay>
      <Card
        dir="rtl"
        onMouseDown={handleCardMouseDown}
        data-testid={DATA_IMPORT_IDS.root}
        $closing={isClosing}
      >
        <Header data-testid={DATA_IMPORT_IDS.header}>
          <HeaderTitleWrap>
            <Database size={16} />
            <HeaderTitle>{MODAL_TITLE}</HeaderTitle>
          </HeaderTitleWrap>
          <CloseBtn
            type="button"
            onClick={handleClose}
            aria-label="סגירה"
            data-testid={DATA_IMPORT_IDS.closeBtn}
          >
            <X size={16} />
          </CloseBtn>
        </Header>

        <PickerBody>
          <ColumnPane $width={SYSTEMS_COLUMN_WIDTH} data-testid={DATA_IMPORT_IDS.systemsColumn}>
            <ColumnHeading>מערכת</ColumnHeading>
            {systemsLoading ? (
              <InlineSpinner />
            ) : (
              sourceSystems.map((system) => {
                const isActive = picker.selectedSystem?.id === system.id;
                return (
                  <RowGroup key={system.id}>
                    <SystemRow
                      type="button"
                      $isActive={isActive}
                      onClick={handleSystemPick(system)}
                      data-testid={DATA_IMPORT_IDS.systemRow(system.id)}
                    >
                      <SystemChevron $isActive={isActive}>
                        <ChevronLeft size={12} />
                      </SystemChevron>
                      <SystemName $isActive={isActive}>{system.name}</SystemName>
                    </SystemRow>
                  </RowGroup>
                );
              })
            )}
          </ColumnPane>

          <OperationsColumn picker={picker} onOperationSelected={handleOperationSelected} />
          <FieldsColumn picker={picker} onFieldToggled={handleFieldToggled} />
        </PickerBody>

        <Footer>
          <FooterHint data-testid={DATA_IMPORT_IDS.footerHint}>
            {existingFields.length > 0
              ? `${existingFields.length} שדות נבחרו`
              : 'לחץ על שדה להוספה מיידית'}
          </FooterHint>
          <SubmitBtn type="button" onClick={handleClose} data-testid={DATA_IMPORT_IDS.submitBtn}>
            הוסף שדות
          </SubmitBtn>
        </Footer>
      </Card>
    </Overlay>
  );
};
