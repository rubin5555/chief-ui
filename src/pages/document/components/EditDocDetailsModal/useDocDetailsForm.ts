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
    // The five fields DocumentHeader actually models. `template`, `orderNum` and
    // `referenceNum` are the document's identity rather than its details, and are
    // not edited here — main shows them in the same dialog but never writes them.
    defaultValues: {
      name: header.name,
      organization: header.organization,
      department: header.department,
      effectiveDate: header.effectiveDate,
      classification: header.classification,
    },
    onSubmit: ({ value }) => onSave({ ...header, ...value }),
  });

export type DocDetailsForm = ReturnType<typeof useDocDetailsForm>;
