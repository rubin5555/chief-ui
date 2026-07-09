export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export const FAQ_ENTRIES: FaqEntry[] = [
  {
    id: 'faq-1',
    question: 'איך מחפשים מסמך?',
    answer:
      'כדי לחפש מסמך, השתמש בשדה החיפוש בחלק העליון של המסך או עבור לתפריט "כל המסמכים" בסרגל הצד.',
  },
  {
    id: 'faq-2',
    question: 'איך מבקשים הרשאה?',
    answer:
      'לחץ על המסמך הרצוי, בחר "בקש הרשאה" מהתפריט, ובחר את סוג ההרשאה הנדרשת (צפייה או עריכה).',
  },
  {
    id: 'faq-3',
    question: 'איך יוצרים תיקייה חדשה?',
    answer: 'לחץ על כפתור "+" בחלק העליון של רשימת המסמכים, בחר "תיקייה חדשה" והזן את שם התיקייה.',
  },
];

export const TRAINING_PANEL_WIDTH = 208;
export const FAQ_PANEL_WIDTH = 320;
