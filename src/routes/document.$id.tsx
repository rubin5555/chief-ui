import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { DocumentPage } from '@/pages/document/DocumentPage';
import { ZOOM_DEFAULT, ZOOM_MAX, ZOOM_MIN } from '@/pages/document/document.measurements';

const documentSearchSchema = z.object({
  statuses: z.string().catch(''),
  zoom: z.number().min(ZOOM_MIN).max(ZOOM_MAX).catch(ZOOM_DEFAULT),
  q: z.string().catch(''),
  compareVersion: z.string().catch(''),
});

export type DocumentSearch = z.infer<typeof documentSearchSchema>;

export const Route = createFileRoute('/document/$id')({
  validateSearch: documentSearchSchema,
  component: DocumentPage,
});
