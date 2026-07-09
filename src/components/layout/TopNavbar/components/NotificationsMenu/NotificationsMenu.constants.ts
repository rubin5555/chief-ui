export const NOTIFICATION_ICONS = {
  VIEW: 'view',
  EDIT: 'edit',
} as const;

export type NotificationIconType = (typeof NOTIFICATION_ICONS)[keyof typeof NOTIFICATION_ICONS];

export interface NotificationItem {
  id: string;
  icon: NotificationIconType;
  text: string;
  time: string;
}

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    icon: NOTIFICATION_ICONS.VIEW,
    text: 'נוהל בטיחות 2026 הופץ אליך לצפייה',
    time: 'לפני 5 דקות',
  },
  {
    id: 'n2',
    icon: NOTIFICATION_ICONS.EDIT,
    text: 'התבקשת לערוך את סעיף 3.1 בנוהל גיוס עובדים',
    time: 'לפני שעה',
  },
  { id: 'n3', icon: NOTIFICATION_ICONS.VIEW, text: 'תקנון משמעת עודכן לגרסה חדשה', time: 'אתמול' },
];

export const PANEL_WIDTH = 340;
