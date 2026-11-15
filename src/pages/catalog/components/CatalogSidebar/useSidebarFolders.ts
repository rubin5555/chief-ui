import { useState } from 'react';
import type { FolderNode } from './CatalogSidebar.constants';
import { SEED_FOLDERS } from './CatalogSidebar.constants';

const withIds = (seed: Record<string, Omit<FolderNode, 'id'>[]>): Record<string, FolderNode[]> =>
  Object.fromEntries(
    Object.entries(seed).map(([dept, nodes]) => [
      dept,
      nodes.map((node) => ({ ...node, id: crypto.randomUUID() })),
    ]),
  );

// Folder CRUD is client-side only, as it is on main — there is no folder
// mutation on the API yet, and a stub one would add a round trip without adding
// a source of truth. When folders get a backend this hook is the seam.
export const useSidebarFolders = () => {
  const [folders, setFolders] = useState<Record<string, FolderNode[]>>(() => withIds(SEED_FOLDERS));

  const create = (dept: string, name: string) =>
    setFolders((prev) => ({
      ...prev,
      [dept]: [
        ...(prev[dept] ?? []),
        { id: crypto.randomUUID(), name, subs: [], subCollapsed: false },
      ],
    }));

  const update = (dept: string, id: string, patch: Partial<FolderNode>) =>
    setFolders((prev) => ({
      ...prev,
      [dept]: (prev[dept] ?? []).map((node) => (node.id === id ? { ...node, ...patch } : node)),
    }));

  const remove = (dept: string, id: string) =>
    setFolders((prev) => ({
      ...prev,
      [dept]: (prev[dept] ?? []).filter((node) => node.id !== id),
    }));

  const forDept = (dept: string) => folders[dept] ?? [];

  return { folders, forDept, create, update, remove };
};

export type SidebarFolders = ReturnType<typeof useSidebarFolders>;
