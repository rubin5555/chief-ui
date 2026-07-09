import { useState } from 'react';

export const useToggleSet = <T extends string>() => {
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
