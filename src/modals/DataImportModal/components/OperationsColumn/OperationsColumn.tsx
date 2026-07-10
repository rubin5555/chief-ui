import { ChevronDown } from 'lucide-react';
import type { SourceOperation } from '../../DataImportModal.constants';
import { DATA_IMPORT_IDS } from '../../DataImportModal.testids';
import type { DataImportPicker } from '../../useDataImportPicker';
import { ColumnEmptyState, ColumnHeading, ColumnPane, RowGroup } from '../columns.shared.styles';
import { InstancePicker } from '../InstancePicker';
import { OperationParams } from '../OperationParams';
import {
  InstanceCountBadge,
  OperationChevron,
  OperationName,
  OperationRow,
} from './OperationsColumn.styles';

interface OperationsColumnProps {
  picker: DataImportPicker;
  onOperationSelected: (operation: SourceOperation) => void;
}

const COLUMN_WIDTH = 320;

export const OperationsColumn = ({ picker, onOperationSelected }: OperationsColumnProps) => {
  const handleOperationPick = (operation: SourceOperation) => () => {
    if (picker.selectedOperation?.id !== operation.id) onOperationSelected(operation);
    picker.pickOperation(operation);
  };

  return (
    <ColumnPane $width={COLUMN_WIDTH} data-testid={DATA_IMPORT_IDS.operationsColumn}>
      <ColumnHeading $raised>פעולה</ColumnHeading>
      {picker.selectedSystem ? (
        picker.selectedSystem.operations.map((operation) => {
          const isActive = picker.selectedOperation?.id === operation.id;
          const isPanelVisible = isActive && picker.isInstancePanelOpen;
          const hasBadge = isActive && picker.selectedInstances.length > 0;
          return (
            <RowGroup key={operation.id}>
              <OperationRow
                type="button"
                $isActive={isActive}
                $hasBadge={hasBadge}
                onClick={handleOperationPick(operation)}
                data-testid={DATA_IMPORT_IDS.operationRow(operation.id)}
              >
                {hasBadge && (
                  <InstanceCountBadge>{picker.selectedInstances.length}</InstanceCountBadge>
                )}
                <OperationChevron $isRotated={isPanelVisible} $isActive={isActive}>
                  <ChevronDown size={14} />
                </OperationChevron>
                <OperationName $isActive={isActive}>{operation.name}</OperationName>
              </OperationRow>
              {isPanelVisible && (
                <>
                  <OperationParams operation={operation} picker={picker} />
                  <InstancePicker picker={picker} />
                </>
              )}
            </RowGroup>
          );
        })
      ) : (
        <ColumnEmptyState>
          <p>בחר מערכת</p>
        </ColumnEmptyState>
      )}
    </ColumnPane>
  );
};
