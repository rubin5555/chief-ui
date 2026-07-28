import type { OutlineNode } from '../../../OutlineSectionItem';

// A miniature of main's outline: a topic with sections, one of which has
// sub-sections, so the recursion has something to recurse into.
export const DEMO_OUTLINE: OutlineNode = {
  id: 'demo-topic',
  title: 'כללי',
  children: [
    {
      id: 'demo-section-1',
      title: 'מטרת המסמך',
      children: [
        { id: 'demo-sub-1', title: 'רקע' },
        { id: 'demo-sub-2', title: 'תחולה' },
      ],
    },
    { id: 'demo-section-2', title: 'הגדרות' },
  ],
};

export const DEMO_RENAME_NODE: OutlineNode = { id: 'demo-renaming', title: 'נושא חדש' };
