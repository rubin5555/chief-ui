import { FileInput, FolderPlus, Lightbulb, Paperclip } from 'lucide-react';
import type { ElementType } from 'react';

export type AddActionId = 'subject' | 'appendix' | 'import' | 'emphasis';

export const ADD_ACTIONS: { id: AddActionId; label: string; Icon: ElementType }[] = [
  { id: 'subject', label: 'יצירת נושא חדש', Icon: FolderPlus },
  { id: 'appendix', label: 'הוספת נספחים', Icon: Paperclip },
  { id: 'import', label: 'יבוא סעיפים ממסמך אחר', Icon: FileInput },
  { id: 'emphasis', label: 'הוספת דגשים לכתיבת המסמך', Icon: Lightbulb },
];
