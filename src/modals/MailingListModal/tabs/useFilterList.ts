import { useState } from 'react';

export const useFilterList = <T extends string>() => {
  const [active, setActive] = useState<T[]>([]);

  const toggle = (value: T) =>
    setActive((prev) =>
      prev.includes(value) ? prev.filter((x) => x !== value) : [...prev, value],
    );

  const clear = () => setActive([]);

  const has = (value: T) => active.includes(value);

  return { active, toggle, clear, has } as const;
};
