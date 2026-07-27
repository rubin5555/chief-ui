import { Paperclip } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { lazy, Suspense, useEffect, useRef } from 'react';
import type { AttachmentFile } from '../../types';
import { ACTION_ICON_SIZE, ActionBtn, type ActionTone } from '../NodeActionRow';
import { HiddenFileInput } from './AttachmentPicker.styles';
import { ATTACHMENT_PICKER_IDS } from './AttachmentPicker.testids';
import { toAttachmentFiles } from './attachmentPicker.utils';

const AttachmentsModal = lazy(() =>
  import('./components/AttachmentsModal').then((m) => ({ default: m.AttachmentsModal })),
);

export interface AttachmentPickerProps {
  nodeId: string;
  attachments: AttachmentFile[];
  /** Open state is the caller's, because the node's chips open this dialog too. */
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onChange: (attachments: AttachmentFile[]) => void;
  tone?: ActionTone;
}

// A node's paperclip: picking files, and the dialog listing what has been picked
// (main, Edit.tsx:4280 and 4848).
//
// `ui/FileUploadField` doesn't fit — it takes one file at a time and is built
// around images (`accept='image/*'`, `onFileSelect: (file: File) => void`).
// Widening a primitive with three existing consumers to serve this would change
// what those three do; this stays feature-local instead.
export const AttachmentPicker = ({
  nodeId,
  attachments,
  isOpen,
  onOpenChange,
  onChange,
  tone = 'default',
}: AttachmentPickerProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Every object URL this component has minted, so they can be released when it
  // goes away. A ref rather than state: nothing renders from it, and it has to
  // survive to the unmount that reads it.
  const mintedUrlsRef = useRef<string[]>([]);

  // The only sanctioned effect here — releasing an external resource on unmount,
  // with no state derived from it. Without this, every file picked in a session
  // holds its blob in memory until the tab closes.
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
    // Resetting the value is what lets the same file be picked twice in a row:
    // without it the input's value doesn't change and no `change` event fires.
    event.target.value = '';
    if (chosen.length === 0) return;

    const added = toAttachmentFiles(chosen);
    for (const attachment of added) {
      if (attachment.objectUrl) mintedUrlsRef.current.push(attachment.objectUrl);
    }

    onChange([...attachments, ...added]);
    // Picking always lands you in the dialog, as in main — the list is the
    // confirmation that the files arrived.
    onOpenChange(true);
  };

  const handleRemove = (attachmentId: string) => {
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
        // Navy once something is attached: the paperclip is also the indicator
        // that this node has files, which is main's cue (Edit.tsx:4282).
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
