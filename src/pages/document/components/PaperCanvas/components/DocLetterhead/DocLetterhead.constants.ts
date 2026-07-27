/**
 * The letterhead's five fields (main's DocHeader, Edit.tsx:545).
 *
 * main keeps five separate `useState`s here, two of them seeded with values that
 * look like they came from a real document. Same fields, same order, same seeds —
 * as one list, so the component holds one record instead of five setters.
 */
export interface LetterheadField {
  id: string;
  label: string;
  initial: string;
  placeholder?: string;
}

export const LETTERHEAD_FIELDS: LetterheadField[] = [
  { id: 'from', label: 'מאת :', initial: '', placeholder: 'לוח הפצה' },
  { id: 'tazach', label: 'תז"ח :', initial: '2026(06)221047' },
  { id: 'to', label: 'אל :', initial: '', placeholder: 'לוח תפוצה' },
  { id: 'location', label: 'מיקום ההוצאה :', initial: '', placeholder: 'לוח הפצה' },
  { id: 'reference', label: 'מס׳ סימוכין :', initial: '123456789098' },
];

export const LETTERHEAD_INITIAL_VALUES: Record<string, string> = Object.fromEntries(
  LETTERHEAD_FIELDS.map((field) => [field.id, field.initial]),
);
