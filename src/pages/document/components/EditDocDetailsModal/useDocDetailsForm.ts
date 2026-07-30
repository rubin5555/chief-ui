import { useForm } from '@tanstack/react-form';
import type { DocumentHeader } from '../../types';

export const useDocDetailsForm = (
  header: DocumentHeader,
  onSave: (header: DocumentHeader) => void,
) =>
  useForm({
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
