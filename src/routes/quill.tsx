import { createFileRoute } from '@tanstack/react-router';
import { QuillDemoPage } from '@/pages/quill/QuillDemoPage';

export const Route = createFileRoute('/quill')({
  component: QuillDemoPage,
});
