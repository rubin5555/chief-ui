import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { DocumentPage } from '@/pages/document/DocumentPage';

// First dynamic-segment route in the app. `panel`/`compare` are the only
// document-page states that change what's rendered in a bookmarkable way —
// everything else (which menu/popover is open) stays local component state.
const documentSearchSchema = z.object({
  panel: z.string().catch(''),
  compare: z.boolean().catch(false),
});

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const Route = createFileRoute('/document/$id')({
  validateSearch: documentSearchSchema,
  component: DocumentPage,
});
