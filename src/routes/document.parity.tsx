import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { ParityGallery } from '@/pages/document/parity/ParityGallery';

// The inspection route for src/pages/document/parity/ — the components ported out
// of main's Edit.tsx that the live page deliberately doesn't use.
//
// A static segment, so it wins over `/document/$id` for this exact path. It takes
// no search params: there is no state here worth putting in a URL, and an empty
// schema says that rather than leaving it unvalidated.
//
// Not linked from the navbar. It is reached by typing the address, because it is a
// review artifact rather than part of the product — and `autoCodeSplitting` keeps
// it out of the live page's bundle entirely.
const paritySearchSchema = z.object({});

export const Route = createFileRoute('/document/parity')({
  validateSearch: paritySearchSchema,
  component: ParityGallery,
});
