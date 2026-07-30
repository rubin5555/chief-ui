import { useState } from 'react';
import orgLogo from '@/assets/orgLogo.svg';
import { Button } from '@/components/ui/Button';
import {
  ContentEditor,
  ContentEditorProvider,
  ContentEditorToolbar,
} from '@/components/ui/ContentEditor';
import { Modal } from '@/components/ui/Modal';
import { useDistributeDocAnalytics } from './DistributeDoc.analytics';
import { Divider, Logo, LogoColumn, MessageColumn, MessageRow } from './DistributeDoc.styles';
import { DISTRIBUTE_DOC_IDS } from './DistributeDoc.testids';
import {
  buildDefaultBody,
  MESSAGE_MIN_HEIGHT,
  MESSAGE_PADDING,
  MODAL_MAX_HEIGHT,
  MODAL_WIDTH,
} from './distributeDoc.constants';

export interface DistributeDocProps {
  docName: string;
  onClose: () => void;
  onSend: (body: string) => void;
}

/**
 * main's ShareDocModal (Edit.tsx:3082): the message the document goes out with,
 * shown as the mail it will become — the system's mark beside the text, a ribbon
 * over it, and nothing else.
 *
 * No recipients field, because main has none: who receives a distributed document
 * is settled by the approval round's חמ״ל groups, not chosen again here. An
 * earlier port added a picker; it asked a question the flow had already answered.
 *
 * The ribbon is main's, and it formats what it points at — see
 * `ui/ContentEditor/components/EditorRibbon`.
 *
 * This dialog brings its own `ContentEditorProvider`, shadowing the document
 * page's: it opens from inside the canvas, and sharing that provider would have
 * the ribbon here and the sheet's own ribbon both pointed at whichever field was
 * touched last.
 */
export const DistributeDoc = ({ docName, onClose, onSend }: DistributeDocProps) => {
  const [body, setBody] = useState(() => buildDefaultBody(docName));
  const { trackDistributeSent } = useDistributeDocAnalytics();

  const handleSend = () => {
    trackDistributeSent();
    onSend(body);
  };

  return (
    <Modal
      title="שיתוף המסמך ב-OUTLOOK ובצאט"
      onClose={onClose}
      width={MODAL_WIDTH}
      maxHeight={MODAL_MAX_HEIGHT}
      noBodyPadding
      data-testid={DISTRIBUTE_DOC_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            סגור
          </Button>
          <Button type="button" onClick={handleSend} data-testid={DISTRIBUTE_DOC_IDS.sendBtn}>
            שלח
          </Button>
        </>
      }
    >
      <ContentEditorProvider>
        {/* Full width, above the row — main's ribbon spans the dialog rather than
            sitting in the message's own box (Edit.tsx:3100). */}
        <ContentEditorToolbar />

        <MessageRow>
          <LogoColumn>
            <Logo src={orgLogo} alt="לוגו המערכת" data-testid={DISTRIBUTE_DOC_IDS.logo} />
          </LogoColumn>
          <Divider aria-hidden="true" />
          <MessageColumn data-testid={DISTRIBUTE_DOC_IDS.body}>
            {/* `inset` rather than the default card: main's message is a bare
                textarea on the dialog's own surface, and of the two looks the
                editor has, the tinted one is the one that isn't a card. */}
            <ContentEditor
              id={`distribute-body-${docName}`}
              value={body}
              onChange={setBody}
              minHeight={MESSAGE_MIN_HEIGHT - MESSAGE_PADDING * 2}
              inset
            />
          </MessageColumn>
        </MessageRow>
      </ContentEditorProvider>
    </Modal>
  );
};
