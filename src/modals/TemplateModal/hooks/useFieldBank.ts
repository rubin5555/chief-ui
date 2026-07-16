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

  // List-shaped fields only: flips ul <-> ol for every future drag of this field (the
  // field bank is the source of truth — a chip already dropped into a section keeps its
  // own choice via the ↕ toggle inside the editor, see useTinyMceSetup).
  const toggleFieldOrdered = (id: string) =>
    setImportedFields((prev) =>
      prev.map((field) =>
        field.id === id && field.shape === 'list' ? { ...field, ordered: !field.ordered } : field,
      ),
    );

  // Saved from TableDesignModal — table-shape fields always use it; list-shape fields
  // only when the user opts into rendering as a styled table (renderAsTable).
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
