import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { DocumentPage } from '@/pages/document/DocumentPage';
import { ZOOM_DEFAULT, ZOOM_MAX, ZOOM_MIN } from '@/pages/document/document.measurements';

// First dynamic-segment route in the app. These are the document-page states that
// change what's rendered in a bookmarkable way; everything else (which menu,
// popover or modal is open) stays local component state, per
// .claude/skills/router-state-splitting.md.
//
// `statuses` is a comma-separated SectionStatus list (empty = no filter).
// `zoom` is clamped to the same bounds the navbar's zoom control offers, so a
// hand-edited URL can't put the paper at a scale the UI has no way back from.
// `q` is the in-document search term, and `compareVersion` the version label
// being compared against — both empty when inactive.
const documentSearchSchema = z.object({
  statuses: z.string().catch(''),
  compare: z.boolean().catch(false),
  zoom: z.number().min(ZOOM_MIN).max(ZOOM_MAX).catch(ZOOM_DEFAULT),
  q: z.string().catch(''),
  compareVersion: z.string().catch(''),
});

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const Route = createFileRoute('/document/$id')({
  validateSearch: documentSearchSchema,
  component: DocumentPage,
});
