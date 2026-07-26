import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { DocumentPage } from '@/pages/document/DocumentPage';

// First dynamic-segment route in the app. `statuses`/`compare` are the only
// document-page states that change what's rendered in a bookmarkable way —
// everything else (which menu/popover is open) stays local component state.
// `statuses` is a comma-separated SectionStatus list (empty = no filter).
const documentSearchSchema = z.object({
  statuses: z.string().catch(''),
  compare: z.boolean().catch(false),
});

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const Route = createFileRoute('/document/$id')({
  validateSearch: documentSearchSchema,
  component: DocumentPage,
});
