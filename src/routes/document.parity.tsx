import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ParityGallery } from '@/pages/document/parity/ParityGallery';

const paritySearchSchema = z.object({});

export const Route = createFileRoute('/document/parity')({
  validateSearch: paritySearchSchema,
  component: ParityGallery,
});
