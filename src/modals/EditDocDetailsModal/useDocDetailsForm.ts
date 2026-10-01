import { useForm } from '@tanstack/react-form';
import type { DocumentHeader } from '@/pages/document/types';

export const useDocDetailsForm = (
  header: DocumentHeader,
  onSave: (header: DocumentHeader) => void,
) =>
  useForm({
    defaultValues: {
      name: header.name,
      // Editable only while creating; settled facts everywhere else.
      organization: header.organization,
      classification: header.classification,
      classificationTag: header.classificationTag ?? '',
      template: header.template,
      orderNum: header.orderNum,
      updateNum: header.updateNum,
      displayName: header.displayName ?? '',
      summary: header.summary ?? '',
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
