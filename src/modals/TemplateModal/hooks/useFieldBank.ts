import { useState } from 'react';
import type { DynamicField, TableDesignOptions } from '@/modals/DataImportModal';

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

  const toggleFieldOrdered = (id: string) =>
    setImportedFields((prev) =>
      prev.map((field) =>
        field.id === id && field.shape === 'list' ? { ...field, ordered: !field.ordered } : field,
      ),
    );

  const updateFieldTableDesign = (
    id: string,
    tableDesign: TableDesignOptions,
    renderAsTable: boolean,
  ) =>
    setImportedFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, tableDesign, renderAsTable } : field)),
    );

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
    toggleFieldOrdered,
    updateFieldTableDesign,
  };
};
