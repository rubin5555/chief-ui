import { useState } from 'react';

// Backs the common "new / edit / duplicate" modal pattern: a mode plus the
// entity being edited (null in 'new' mode). Callers resolve the entity
// themselves (e.g. finding it by id) before calling `open`.
export const useEntityModal = <TMode extends string, TEntity>() => {
  const [mode, setMode] = useState<TMode | null>(null);
  const [editing, setEditing] = useState<TEntity | null>(null);

  const open = (nextMode: TMode, entity: TEntity | null = null) => {
    setEditing(entity);
    setMode(nextMode);
  };

  const close = () => {
    setMode(null);
    setEditing(null);
  };

  return { mode, editing, open, close };
};
