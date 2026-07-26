import type { ChangeEvent, FormEvent } from 'react';
import { useState } from 'react';
import { NETWORK_PEOPLE_FALLBACK, useNetworkPeople } from '@/api/networkPeople';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { SearchableMultiSelect } from '@/components/ui/SearchableMultiSelect';
import { Body, BodyTextarea, Field, FieldLabel } from './DistributeDoc.styles';
import { DISTRIBUTE_DOC_IDS } from './DistributeDoc.testids';

export interface DistributeDocProps {
  docName: string;
  onClose: () => void;
  onSend: (recipients: string[], body: string) => void;
}

const FORM_ID = 'distribute-doc-form';

const buildDefaultBody = (docName: string) =>
  `מכותבים שלום,\nמצ״ב פקודה "${docName}":\nלחצו כאן למעבר לפקודה\nעיונכם.\nבברכה,`;

// Renamed from main's ShareDocModal. Per the phased plan this becomes a
// reduced share preview rather than a second live DocToolbar instance
// sharing state with the main editor -- the message body is a plain
// textarea, and recipients are picked from the same personnel roster used
// elsewhere (src/api/networkPeople.ts) via SearchableMultiSelect, the same
// scope-limiting choice made in Phase 5 for the classified-viewers picker.
export const DistributeDoc = ({ docName, onClose, onSend }: DistributeDocProps) => {
  const { data } = useNetworkPeople();
  const people = data ?? NETWORK_PEOPLE_FALLBACK.networkPeople;

  const [recipients, setRecipients] = useState<string[]>([]);
  const [body, setBody] = useState(buildDefaultBody(docName));

  const handleBodyChange = (e: ChangeEvent<HTMLTextAreaElement>) => setBody(e.target.value);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSend(recipients, body);
  };

  return (
    <Modal
      title="שיתוף המסמך"
      onClose={onClose}
      width={560}
      data-testid={DISTRIBUTE_DOC_IDS.root}
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            סגור
          </Button>
          <Button
            type="submit"
            form={FORM_ID}
            disabled={recipients.length === 0}
            data-testid={DISTRIBUTE_DOC_IDS.sendBtn}
          >
            שלח
          </Button>
        </>
      }
    >
      <Body id={FORM_ID} onSubmit={onSubmit}>
        <Field>
          <FieldLabel>נמענים</FieldLabel>
          <SearchableMultiSelect
            options={people.map((person) => person.name)}
            selected={recipients}
            onChange={setRecipients}
            placeholder="בחר נמענים..."
            data-testid={DISTRIBUTE_DOC_IDS.recipientsSelect}
          />
        </Field>

        <Field>
          <FieldLabel>תוכן ההודעה</FieldLabel>
          <BodyTextarea
            value={body}
            onChange={handleBodyChange}
            dir="rtl"
            data-testid={DISTRIBUTE_DOC_IDS.body}
          />
        </Field>
      </Body>
    </Modal>
  );
};
