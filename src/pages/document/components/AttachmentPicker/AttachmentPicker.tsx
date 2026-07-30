import { Paperclip } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import type { AttachmentFile } from '../../types';
import { ACTION_ICON_SIZE, ActionBtn, type ActionTone } from '../NodeActionRow';
import { useAttachmentPickerAnalytics } from './AttachmentPicker.analytics';
import { HiddenFileInput } from './AttachmentPicker.styles';
import { ATTACHMENT_PICKER_IDS } from './AttachmentPicker.testids';
import { toAttachmentFiles } from './attachmentPicker.utils';

const AttachmentsModal = lazy(() =>
  import('./components/AttachmentsModal').then((m) => ({ default: m.AttachmentsModal })),
);

export interface AttachmentPickerProps {
  nodeId: string;
  attachments: AttachmentFile[];
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChange: (attachments: AttachmentFile[]) => void;
  tone?: ActionTone;
}

export const AttachmentPicker = ({
  nodeId,
  attachments,
  isOpen,
  onOpenChange,
  onChange,
  tone = 'default',
}: AttachmentPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { trackFilesAttached, trackFileRemoved } = useAttachmentPickerAnalytics();

  const mintedUrlsRef = useRef<string[]>([]);

  useEffect(
    () => () => {
      for (const url of mintedUrlsRef.current) URL.revokeObjectURL(url);
      mintedUrlsRef.current = [];
    },
    [],
  );

  const openPicker = () => inputRef.current?.click();

  const handleFilesChosen = (event: ChangeEvent<HTMLInputElement>) => {
    const chosen = Array.from(event.target.files ?? []);

    event.target.value = '';
    if (chosen.length === 0) return;

    trackFilesAttached(chosen.length);
    const added = toAttachmentFiles(chosen);
    for (const attachment of added) {
      if (attachment.objectUrl) mintedUrlsRef.current.push(attachment.objectUrl);
    }

    onChange([...attachments, ...added]);

    onOpenChange(true);
  };

  const handleRemove = (attachmentId: string) => {
    trackFileRemoved();
    const removed = attachments.find((attachment) => attachment.id === attachmentId);
    if (removed?.objectUrl) {
      URL.revokeObjectURL(removed.objectUrl);
      mintedUrlsRef.current = mintedUrlsRef.current.filter((url) => url !== removed.objectUrl);
    }
    onChange(attachments.filter((attachment) => attachment.id !== attachmentId));
  };

  const handleClose = () => onOpenChange(false);

  return (
    <>
      <ActionBtn
        type="button"
        $tone={tone}
        $active={attachments.length > 0}
        title="הוספת קבצים"
        aria-label="הוספת קבצים"
        data-testid={ATTACHMENT_PICKER_IDS.trigger(nodeId)}
        onClick={openPicker}
      >
        <Paperclip size={ACTION_ICON_SIZE} aria-hidden="true" />
      </ActionBtn>

      <HiddenFileInput
        ref={inputRef}
        type="file"
        multiple
        tabIndex={-1}
        aria-label="בחירת קבצים לצירוף"
        data-testid={ATTACHMENT_PICKER_IDS.input(nodeId)}
        onChange={handleFilesChosen}
      />

      <Suspense fallback={null}>
        {isOpen && (
          <AttachmentsModal
            attachments={attachments}
            onAddMore={openPicker}
            onRemove={handleRemove}
            onClose={handleClose}
          />
        )}
      </Suspense>
    </>
  );
};
