import type { InitOptions } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

// `searchreplace` is loaded for its API, not its button: the ribbon's own
// find-and-replace panel calls `editor.plugins.searchreplace` directly and its
// dialog is never opened. Same for `table` and `directionality`, whose commands
// the ribbon runs — a plugin here means "these commands exist", not "these
// buttons appear", because no TinyMCE toolbar is rendered at all (see below).
export const TINYMCE_PLUGINS = 'lists table directionality link image searchreplace';

// No upload backend exists yet, so dropped/pasted/picked images are embedded as base64
// data URLs directly in the field's HTML rather than uploaded — this is what makes
// drag-and-drop image insertion work standalone, with paste_data_images/automatic_uploads
// below wiring drag-drop and clipboard paste through this same handler.
const imagesUploadHandler: NonNullable<InitOptions['images_upload_handler']> = (blobInfo) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject('Image read failed');
    reader.readAsDataURL(blobInfo.blob());
  });

// DataTransfer types for draggable content chips (e.g. imported source-system fields).
// The presence type marks a drag as chip-carrying during dragover (getData is unreadable
// until drop), and the html type carries the actual snippet inserted at the drop caret.
export const CONTENT_CHIP_MIME = 'application/x-content-chip';
export const CONTENT_CHIP_HTML_MIME = 'text/x-content-chip-html';

// TinyMCE's own init option for this is `license_key`, but tinymce-react's InitOptions
// type deliberately omits it (typed as DoNotUse) — the library wants the GPL license
// key passed via the <Editor licenseKey /> prop instead, where it re-adds it internally
// as `license_key` before calling tinymce.init(). Pass this as `licenseKey` on every
// <Editor> instance rather than spreading it into `init`.
export const TINYMCE_LICENSE_KEY = 'gpl';

export const TINYMCE_INIT: InitOptions = {
  skin: false,
  content_css: false,
  menubar: false,
  // TinyMCE renders no toolbar of its own. The ribbon above the sheet is ours
  // (see components/EditorRibbon), and it drives this editor through the same
  // commands the silver theme's buttons would have run — so what is given up here
  // is the drawing, not the behaviour.
  toolbar: false,
  // And no context toolbar over a table either — that one is ours as well (see
  // components/TableEditBar). An empty string is how the table plugin is told not
  // to register it; `false` is not a value it accepts.
  table_toolbar: '',
  plugins: TINYMCE_PLUGINS,
  directionality: 'rtl',
  promotion: false,
  resize: false,
  statusbar: false,
  entity_encoding: 'raw',
  paste_data_images: true,
  automatic_uploads: true,
  images_upload_handler: imagesUploadHandler,
};
