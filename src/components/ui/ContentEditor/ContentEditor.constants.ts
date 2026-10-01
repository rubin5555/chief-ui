import type { InitOptions } from '@tinymce/tinymce-react/lib/cjs/main/ts/components/Editor';

export const TINYMCE_PLUGINS = 'lists table directionality link image searchreplace';

const imagesUploadHandler: NonNullable<InitOptions['images_upload_handler']> = (blobInfo) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject('Image read failed');
    reader.readAsDataURL(blobInfo.blob());
  });

export const CONTENT_CHIP_MIME = 'application/x-content-chip';
export const CONTENT_CHIP_HTML_MIME = 'text/x-content-chip-html';

export const TINYMCE_LICENSE_KEY = 'gpl';

export const TINYMCE_INIT: InitOptions = {
  skin: false,
  content_css: false,
  menubar: false,

  toolbar: false,

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
