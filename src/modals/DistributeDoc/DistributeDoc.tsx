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
        <ContentEditorToolbar />

        <MessageRow>
          <LogoColumn>
            <Logo src={orgLogo} alt="לוגו המערכת" data-testid={DISTRIBUTE_DOC_IDS.logo} />
          </LogoColumn>
          <Divider aria-hidden="true" />
          <MessageColumn data-testid={DISTRIBUTE_DOC_IDS.body}>
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
