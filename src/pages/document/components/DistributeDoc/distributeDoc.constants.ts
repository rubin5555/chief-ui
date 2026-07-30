/** main's share dialog is wider than the app's default (Edit.tsx:3089). */
export const MODAL_WIDTH = 640;
export const MODAL_MAX_HEIGHT = '88vh';

/** The column holding the system's mark, left of the message (Edit.tsx:3105). */
export const LOGO_COLUMN_WIDTH = 110;

/** So a one-line message still opens on an email-shaped panel (Edit.tsx:3103). */
export const MESSAGE_MIN_HEIGHT = 260;

/** The message column's own inset, subtracted when sizing the editor inside it. */
export const MESSAGE_PADDING = 16;

/**
 * The draft the dialog opens on (main's `emailBody`, Edit.tsx:3083), as
 * paragraphs rather than newlines — the body is a rich-text field here, and a
 * `\n` in HTML is whitespace.
 */
export const buildDefaultBody = (docName: string) =>
  ['מכותבים שלום,', `מצ״ב פקודה ״${docName}״ :`, 'לחצו כאן למעבר לפקודה', 'עיונכם.', 'בברכה,']
    .map((line) => `<p>${line}</p>`)
    .join('');
