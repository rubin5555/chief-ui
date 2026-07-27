/**
 * The explanation behind the `!` badge next to the document's status (main's
 * inline ternary, Edit.tsx:3802). Only the two draft statuses have one — the
 * later ones are self-explanatory, and main shows no badge for them at all, so a
 * status missing from this map renders no badge rather than an empty tooltip.
 */
export const STATUS_TIPS: Record<string, string> = {
  'טיוטה פנימית':
    'רק בעלי פקודה יכולים לצפות במסמך זה. כדי שכלל העורכים יראו את המסמך, הפץ את המסמך לסטטוס ׳בהכנה׳',
  בהכנה: 'כל העורכים יכולים לראות מסמך זה',
};
