import { EXCLUSIVE_GROUPS } from './DocToolbar.constants';

// Pressing an alignment turns the other three off, because a paragraph has one
// alignment; pressing bold just toggles bold. main writes this as a branch inside
// its `setActiveFormats` updater (Edit.tsx:1196-1206).
export const toggleFormat = (active: Set<string>, id: string): Set<string> => {
  const next = new Set(active);
  const group = EXCLUSIVE_GROUPS.find((ids) => ids.includes(id));

  if (!group) {
    if (next.has(id)) next.delete(id);
    else next.add(id);
    return next;
  }

  for (const member of group) next.delete(member);
  if (!active.has(id)) next.add(id);
  return next;
};
