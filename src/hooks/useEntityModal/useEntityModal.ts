import { useState } from 'react';

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
