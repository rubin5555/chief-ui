import { Eye, Network, PenLine, UserCheck } from 'lucide-react';
import type { ElementType } from 'react';

/**
 * The document's five permission levels, with main's own descriptions verbatim
 * (TopNavbar.tsx:212). The wording is the substance here — each one says exactly
 * what a person with that permission may and may not do, and paraphrasing it would
 * change what the dialog promises.
 */
export interface PermissionLevel {
  id: string;
  label: string;
  Icon: ElementType;
  description: string;
  /**
   * The last two permissions are granted per section rather than over the whole
   * document — "עורכי הסעיף יוכלו לערוך רק את הסעיף שבעבורו ניתנה להם ההרשאה" —
   * so choosing them swaps the members column for the document's section tree.
   */
  isSectionScoped?: boolean;
}

/**
 * The two per-section permissions, named so that a section's own menu can ask for
 * the one it means without restating the string.
 */
export const SECTION_PERMISSION_LEVEL_IDS = {
  editors: 'section-editors',
  approvers: 'section-approvers',
} as const;

/**
 * `צפייה טרם הפצה` becomes `מורשים לייצוא לוורד` once the document is distributed
 * (main's `isDistributed` branch): before distribution the permission is about
 * seeing a draft, and afterwards there is no draft left to see.
 */
export const buildPermissionLevels = (isDistributed: boolean): PermissionLevel[] => [
  {
    id: 'view-after',
    label: 'צפייה לאחר הפצה',
    Icon: Eye,
    description: 'המשתמשים עם הרשאה זו יוכלו לצפות בתוכן הפקודה לאחר הפצתה.',
  },
  {
    id: 'view-before',
    label: isDistributed ? 'מורשים לייצוא לוורד' : 'צפייה טרם הפצה',
    Icon: Eye,
    description: isDistributed
      ? 'המשתמשים עם הרשאה זו יוכלו לייצא את הפקודה ל-Word.'
      : 'המשתמשים עם הרשאה זו יוכלו לצפות בתוכן הפקודה כשהיא בסטטוס ״בהכנה״ או ״בסבב אישורים״, וייצא אותה ל-Word ו-PDF. הם לא יוכלו לערוך תוכן זה.',
  },
  {
    id: 'manage',
    label: 'ניהול פקודה',
    Icon: Network,
    description:
      'המשתמשים עם הרשאה זו יוכלו לנהל את הפקודה כמו ״בעל פקודה״ — לערוך ולאשר את כל הסעיפים, לשנות את סדר הפקודה ולנהל את הרשאות הצפייה, העריכה והאישור.',
  },
  {
    id: SECTION_PERMISSION_LEVEL_IDS.editors,
    label: 'עורכי סעיפים',
    Icon: PenLine,
    isSectionScoped: true,
    description:
      'המשתמשים עם הרשאה זו יוכלו לערוך את הסעיף כשהפקודה בסטטוס ״בהכנה״. עורכי הסעיף יוכלו לערוך רק את הסעיף שבעבורו ניתנה להם ההרשאה. משתמשים אלו יהיו משויכים לרשימת התפוצה.',
  },
  {
    id: SECTION_PERMISSION_LEVEL_IDS.approvers,
    label: 'מאשרי סעיף',
    Icon: UserCheck,
    isSectionScoped: true,
    description:
      'המשתמשים עם הרשאה זו יוכלו לאשר את הסעיף כשהפקודה בסטטוס ״בהכנה״. מאשרי הסעיף יוכלו לאשר רק את הסעיף שבעבורו ניתנה להם ההרשאה. משתמשים אלו משויכים לרשימת התפוצה.',
  },
];
