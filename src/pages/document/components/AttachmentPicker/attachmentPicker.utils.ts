import type { AttachmentFile } from '../../types';

export const toAttachmentFiles = (files: File[]): AttachmentFile[] =>
  files.map((file) => ({
    id: `attachment-${self.crypto.randomUUID()}`,
    name: file.name,
    size: file.size,
    objectUrl: URL.createObjectURL(file),
  }));

export const formatSizeKb = (bytes: number) => `${Math.round(bytes / 1024)} KB`;

export const downloadAttachment = (attachment: AttachmentFile) => {
  if (!attachment.objectUrl) return;
  const link = document.createElement('a');
  link.href = attachment.objectUrl;
  link.download = attachment.name;
  link.click();
};
