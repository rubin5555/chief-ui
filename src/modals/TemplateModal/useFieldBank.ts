import { useState } from 'react';
import type { DynamicField } from '@/modals/DataImportModal';

export const useFieldBank = (trackFieldsImported: (count: number) => void) => {
  const [importedFields, setImportedFields] = useState<DynamicField[]>([]);
  const [isFieldBankExpanded, setIsFieldBankExpanded] = useState(false);
  const [isImportPickerOpen, setIsImportPickerOpen] = useState(false);

  const openImportPicker = () => setIsImportPickerOpen(true);
  const closeImportPicker = () => setIsImportPickerOpen(false);
  const collapseFieldBank = () => setIsFieldBankExpanded(false);
  const expandFieldBank = () => setIsFieldBankExpanded(true);

  const addImportedFields = (fields: DynamicField[]) => {
    trackFieldsImported(fields.length);
    setImportedFields((prev) => [...prev, ...fields]);
    setIsFieldBankExpanded(true);
  };

  const removeImportedField = (id: string) =>
    setImportedFields((prev) => prev.filter((field) => field.id !== id));

  const isFieldBankShown = isFieldBankExpanded && importedFields.length > 0;

  return {
    importedFields,
    isFieldBankShown,
    isImportPickerOpen,
    openImportPicker,
    closeImportPicker,
    collapseFieldBank,
    expandFieldBank,
    addImportedFields,
    removeImportedField,
  };
};
