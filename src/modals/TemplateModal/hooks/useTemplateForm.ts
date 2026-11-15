import { useForm } from '@tanstack/react-form';
import { emptyTemplateFormValues } from '../TemplateModal.constants';

// The form lives here rather than inline in TemplateModal so its API type can be
// read straight off the hook. `ReactFormExtendedApi` takes twelve generics — one
// per validator slot — and hand-writing them drifts the moment a validator is
// added, which is what pushed the old `TemplateFormApi` to `any` in every slot.
export const useTemplateForm = (initialName: string) =>
  useForm({
    defaultValues: emptyTemplateFormValues(initialName),
    onSubmit: () => {},
  });

export type TemplateFormApi = ReturnType<typeof useTemplateForm>;
