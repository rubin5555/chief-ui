import { useState } from 'react';
import type { Member } from '../MailingListFormModal.constants';

// Each import tab (doc/hamal/mirage/personal) merges newly picked members into the
// list, deduped against members already present, and separately tracks which
// source-side ids (docs/groups/lists) have been added — so the tab can grey out
// rows the user already imported. Shape is identical across tabs; only the
// dedupe key differs (idNumber for people-with-ids, id for groups).
export const useImportSource = (
  dedupeKey: (member: Member) => string | undefined,
  addMembers: (newMembers: Member[], dedupeKey: (member: Member) => string | undefined) => void,
) => {
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());

  const onImport = (newMembers: Member[], sourceIds: string[]) => {
    addMembers(newMembers, dedupeKey);
    setAddedIds((prev) => {
      const next = new Set(prev);
      for (const id of sourceIds) next.add(id);
      return next;
    });
  };

  return { addedIds, onImport };
};
