import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { z } from 'zod';
import { DocumentPage } from '@/pages/document/DocumentPage';
import { ZOOM_DEFAULT, ZOOM_MAX, ZOOM_MIN } from '@/pages/document/document.measurements';

// The schema falls back to these, and `stripSearchParams` keeps them out of the
// URL — an untouched document is `/document/123`, not
// `/document/123?statuses=&zoom=100&q=&compareVersion=`.
const DEFAULTS = {
  statuses: '',
  zoom: ZOOM_DEFAULT,
  q: '',
  compareVersion: '',
} as const;

const documentSearchSchema = z.object({
  statuses: z.string().catch(DEFAULTS.statuses),
  zoom: z.number().min(ZOOM_MIN).max(ZOOM_MAX).catch(DEFAULTS.zoom),
  q: z.string().catch(DEFAULTS.q),
  compareVersion: z.string().catch(DEFAULTS.compareVersion),
});

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const Route = createFileRoute('/document/$id')({
  validateSearch: documentSearchSchema,
  search: { middlewares: [stripSearchParams(DEFAULTS)] },
  component: DocumentPage,
});
