import type { AttachmentFile } from '../../types';

/**
 * Turn picked files into the shape the document actually stores.
 *
 * A `File` never enters the DTO: it can't be serialised, and the document has to
 * stay a plain object. What is kept is the name, the size, and an object URL
 * minted here so the attachments modal can offer a download without holding the
 * blob itself. Whoever mints these owns revoking them — see AttachmentPicker.
 */
export const toAttachmentFiles = (files: File[]): AttachmentFile[] =>
  files.map((file) => ({
    id: `attachment-${self.crypto.randomUUID()}`,
    name: file.name,
    size: file.size,
    objectUrl: URL.createObjectURL(file),
  }));

/** main renders every size in whole KB, however small (Edit.tsx:4870). */
export const formatSizeKb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

/**
 * Download an attachment by clicking a link that was never in the document.
 *
 * The anchor isn't appended to the DOM: a detached element's `click()` still
 * triggers the browser's download path, and appending one would flash a stray
 * node into the page for a frame.
 */
export const downloadAttachment = (attachment: AttachmentFile) => {
  if (!attachment.objectUrl) return;
  const link = document.createElement('a');
  link.href = attachment.objectUrl;
  link.download = attachment.name;
  link.click();
};
