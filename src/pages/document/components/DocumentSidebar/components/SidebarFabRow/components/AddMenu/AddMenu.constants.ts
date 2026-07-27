import { FileInput, FolderPlus, Lightbulb, Paperclip } from 'lucide-react';
import type { ElementType } from 'react';

/**
 * What the sidebar's `+` offers (main's ADD_ACTIONS, Edit.tsx:287).
 *
 * main dispatches these by comparing the clicked *label* string
 * (`if (label === 'יצירת נושא חדש')`, 3573), so a copy edit silently breaks the
 * action. Each carries an id instead, and the label is free to change.
 */
export type AddActionId = 'subject' | 'appendix' | 'import' | 'emphasis';

export const ADD_ACTIONS: { id: AddActionId; label: string; Icon: ElementType }[] = [
  { id: 'subject', label: 'יצירת נושא חדש', Icon: FolderPlus },
  { id: 'appendix', label: 'הוספת נספחים', Icon: Paperclip },
  { id: 'import', label: 'יבוא סעיפים ממסמך אחר', Icon: FileInput },
  { id: 'emphasis', label: 'הוספת דגשים לכתיבת המסמך', Icon: Lightbulb },
];
