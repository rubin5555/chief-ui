import { useState } from 'react';
import { useToggleSet } from '../useToggleSet';

export const useTabSelection = () => {
  const selected = useToggleSet<string>();
  const [expanded, setExpanded] = useState<string | null>(null);

  const onToggleExpand = (id: string) => setExpanded((prev) => (prev === id ? null : id));
  const handleRowClick = (id: string, isAdded: boolean) => () => {
    if (!isAdded) onToggleExpand(id);
  };
  const handleCheckClick = (id: string, isAdded: boolean) => (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isAdded) selected.toggle(id);
  };
  const handleToggleExpand = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(id);
  };

  return {
    selected,
    expanded,
    onToggleExpand,
    handleRowClick,
    handleCheckClick,
    handleToggleExpand,
  } as const;
};
