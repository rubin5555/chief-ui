import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { CollabDemoPage } from '@/pages/collab/CollabDemoPage';

const collabSearchSchema = z.object({});

export const Route = createFileRoute('/collab')({
  validateSearch: collabSearchSchema,
  component: CollabDemoPage,
});
