import { useState } from 'react';
import type { Member } from '../PeoplePicker.constants';

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
