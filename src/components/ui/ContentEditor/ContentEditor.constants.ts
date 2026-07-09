import type { InitOptions } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

export const TINYMCE_TOOLBAR =
  'bold italic underline strikethrough | forecolor backcolor | ' +
  'bullist numlist | alignright aligncenter alignleft alignjustify | ' +
  'outdent indent | ltr rtl | superscript | link image table | removeformat';

export const TINYMCE_PLUGINS = 'lists table directionality link image';

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
  toolbar: TINYMCE_TOOLBAR,
  plugins: TINYMCE_PLUGINS,
  directionality: 'rtl',
  promotion: false,
  resize: false,
  statusbar: false,
  entity_encoding: 'raw',
  toolbar_persist: true,
  // The floating overflow ("...") drawer TinyMCE normally uses to hide toolbar groups
  // that don't fit never renders when the toolbar is hosted in a custom
  // fixed_toolbar_container — any group past the visible row silently disappears with
  // no error. Wrapping onto a second line instead needs no floating drawer at all.
  toolbar_mode: 'wrap',
  paste_data_images: true,
  automatic_uploads: true,
  images_upload_handler: imagesUploadHandler,
};
