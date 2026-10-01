export const MODAL_WIDTH = 640;
export const MODAL_MAX_HEIGHT = '88vh';

export const LOGO_COLUMN_WIDTH = 110;

export const MESSAGE_MIN_HEIGHT = 260;

export const MESSAGE_PADDING = 16;

export const buildDefaultBody = (docName: string) =>
  ['מכותבים שלום,', `מצ״ב פקודה ״${docName}״ :`, 'לחצו כאן למעבר לפקודה', 'עיונכם.', 'בברכה,']
    .map((line) => `<p>${line}</p>`)
    .join('');
