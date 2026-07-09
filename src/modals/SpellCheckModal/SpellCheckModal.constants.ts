export interface Step {
  step: number;
  text: string;
  hasIcon?: boolean;
  hasToggle?: boolean;
}

export const STEPS: Step[] = [
  { step: 1, text: 'יש לפתוח את קובץ ההתקנה שירד אליכם' },
  { step: 2, text: 'יש להכנס לתפריט של הכרום הנמצא למעלה ונראה כך:', hasIcon: true },
  { step: 3, text: 'בתפריט יש לבחור ב־settings' },
  { step: 4, text: 'יש ללחוץ בתפריט בצד שמאל Languages (במידה ולא נראה לעין, תרשמו בחיפוש)' },
  {
    step: 5,
    text: 'במידה ויש עברית (Hebrew) ברשימה, יש למחוק ע״י לחיצה על התפריט ולאחר מכן Remove',
  },
  { step: 6, text: 'יש ללחוץ על הכפתור add languages ואז להוסיף Hebrew' },
  { step: 7, text: 'יש להפעיל את הכפתור ליד על מנת להפעיל בדיקת איות:', hasToggle: true },
];
