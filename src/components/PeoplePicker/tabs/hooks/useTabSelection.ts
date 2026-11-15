import { useState } from 'react';

const useToggleSet = <T extends string>() => {
  const [set, setSet] = useState<Set<T>>(new Set());

  const toggle = (id: T) =>
    setSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const reset = () => setSet(new Set());

  return { set, toggle, reset } as const;
};

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
