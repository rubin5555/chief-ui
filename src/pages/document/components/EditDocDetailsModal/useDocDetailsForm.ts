import { useForm } from '@tanstack/react-form';
import type { DocumentHeader } from '../../types';

/**
 * The document-details form, in its own module so the modal and its field set can
 * both name its type without one importing the other.
 *
 * Typing `DocDetailsFields`'s prop structurally instead was tried and abandoned:
 * TanStack Form's `Field` is generic over every field and validator, and a
 * hand-written approximation of it disagrees with the real one on details like
 * whether a render prop may return a promise.
 */
export const useDocDetailsForm = (
  header: DocumentHeader,
  onSave: (header: DocumentHeader) => void,
) =>
  useForm({
    // Everything main's dialog lets you change. `template`, `organization`,
    // `classification`, `orderNum`, `updateNum` and `referenceNum` are absent on
    // purpose: main shows them in the same dialog but never writes them, because
    // they are settled when the document is created — see DocFactsGrid.
    defaultValues: {
      name: header.name,
      department: header.department,
      docType: header.docType,
      folder: header.folder,
      entityType: header.entityType,
      entityName: header.entityName,
      effectiveDate: header.effectiveDate,
      expiryDate: header.expiryDate,
      pdfAccess: header.pdfAccess,
      cancelApproval: header.cancelApproval,
      watermark: header.watermark,
      distributeNatzura: header.distributeNatzura,
    },
    onSubmit: ({ value }) => onSave({ ...header, ...value }),
  });

export type DocDetailsForm = ReturnType<typeof useDocDetailsForm>;
