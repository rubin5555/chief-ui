import { useState } from 'react';
import type {
  DynamicField,
  OperationParamValues,
  SourceOperation,
  SourceSystem,
} from '../DataImportModal.constants';
import { EMPTY_OPERATION_PARAMS } from '../DataImportModal.constants';
import { inferFieldShape } from '../utils/inferFieldShape';

interface UseDataImportPickerArgs {
  existingFields: DynamicField[];
  onAdd: (fields: DynamicField[]) => void;
  onRemove: (field: DynamicField) => void;
}

// All selection state for the import picker: system → operation → instances → fields.
export const useDataImportPicker = ({
  existingFields,
  onAdd,
  onRemove,
}: UseDataImportPickerArgs) => {
  const [selectedSystem, setSelectedSystem] = useState<SourceSystem | null>(null);
  const [selectedOperation, setSelectedOperation] = useState<SourceOperation | null>(null);
  const [selectedInstances, setSelectedInstances] = useState<string[]>([]);
  const [instanceSearch, setInstanceSearch] = useState('');
  const [isInstancePanelOpen, setIsInstancePanelOpen] = useState(false);
  const [expandedField, setExpandedField] = useState<string | null>(null);

  const [operationParams, setOperationParams] = useState<Record<string, OperationParamValues>>({});
  const [nameSearchByOperation, setNameSearchByOperation] = useState<Record<string, string>>({});
  const [nameDropdownOperationId, setNameDropdownOperationId] = useState<string | null>(null);

  const getParams = (operationId: string): OperationParamValues =>
    operationParams[operationId] ?? EMPTY_OPERATION_PARAMS;

  const patchParams = (operationId: string, patch: Partial<OperationParamValues>) =>
    setOperationParams((prev) => ({
      ...prev,
      [operationId]: { ...(prev[operationId] ?? EMPTY_OPERATION_PARAMS), ...patch },
    }));

  const setNameSearch = (operationId: string, value: string) =>
    setNameSearchByOperation((prev) => ({ ...prev, [operationId]: value }));

  const pickName = (operationId: string, name: string) => {
    patchParams(operationId, { name });
    setNameSearch(operationId, '');
    setNameDropdownOperationId(null);
  };

  const pickSystem = (system: SourceSystem) => {
    setSelectedSystem(system);
    setSelectedOperation(null);
    setSelectedInstances([]);
    setInstanceSearch('');
    setIsInstancePanelOpen(false);
  };

  // Re-clicking the open operation collapses/expands its panel instead of resetting it.
  const pickOperation = (operation: SourceOperation) => {
    if (selectedOperation?.id === operation.id) {
      setIsInstancePanelOpen((prev) => !prev);
      return;
    }
    setSelectedOperation(operation);
    setSelectedInstances([]);
    setInstanceSearch('');
    setIsInstancePanelOpen(true);
  };

  const toggleInstance = (instance: string) =>
    setSelectedInstances((prev) =>
      prev.includes(instance) ? prev.filter((i) => i !== instance) : [...prev, instance],
    );

  const closeInstancePanel = () => setIsInstancePanelOpen(false);

  const isFieldLinked = (fieldName: string): boolean =>
    selectedOperation !== null &&
    selectedInstances.length > 0 &&
    selectedInstances.every((instance) =>
      existingFields.some(
        (f) =>
          f.operationId === selectedOperation.id &&
          f.instanceName === instance &&
          f.fieldName === fieldName,
      ),
    );

  // Clicking a field links it for every selected instance; clicking a linked field unlinks it.
  const toggleField = (fieldName: string): { added: number; removed: number } => {
    if (!selectedSystem || !selectedOperation || selectedInstances.length === 0) {
      return { added: 0, removed: 0 };
    }
    const sourceField = selectedOperation.fields.find((f) => f.name === fieldName);
    const value = sourceField?.value ?? '';
    const shape = inferFieldShape(value);
    const toAdd: DynamicField[] = [];
    let removed = 0;
    for (const instance of selectedInstances) {
      const existing = existingFields.find(
        (f) =>
          f.operationId === selectedOperation.id &&
          f.instanceName === instance &&
          f.fieldName === fieldName,
      );
      if (existing) {
        onRemove(existing);
        removed += 1;
        continue;
      }
      toAdd.push({
        id: `df-${self.crypto.randomUUID()}`,
        systemId: selectedSystem.id,
        systemName: selectedSystem.name,
        operationId: selectedOperation.id,
        operationName: selectedOperation.name,
        instanceName: instance,
        fieldName,
        shape,
        value,
        ordered: shape === 'list' ? false : undefined,
      });
    }
    if (toAdd.length > 0) onAdd(toAdd);
    return { added: toAdd.length, removed };
  };

  return {
    selectedSystem,
    selectedOperation,
    selectedInstances,
    instanceSearch,
    setInstanceSearch,
    isInstancePanelOpen,
    expandedField,
    setExpandedField,
    nameSearchByOperation,
    nameDropdownOperationId,
    setNameDropdownOperationId,
    setNameSearch,
    pickName,
    getParams,
    patchParams,
    pickSystem,
    pickOperation,
    toggleInstance,
    closeInstancePanel,
    isFieldLinked,
    toggleField,
  };
};

export type DataImportPicker = ReturnType<typeof useDataImportPicker>;
