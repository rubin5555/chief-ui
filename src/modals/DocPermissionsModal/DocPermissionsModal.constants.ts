import { Eye, Network, PenLine, UserCheck } from 'lucide-react';
import type { ElementType } from 'react';

export interface PermissionLevel {
  id: string;
  label: string;
  Icon: ElementType;
  description: string;
  isSectionScoped?: boolean;
}

export const SECTION_PERMISSION_LEVEL_IDS = {
  editors: 'section-editors',
  approvers: 'section-approvers',
} as const;

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
