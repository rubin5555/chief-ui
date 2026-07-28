import { PenLine } from 'lucide-react';
import { SIGNATURES_FALLBACK, useSignatures } from '@/api/signatures';
import { Modal } from '@/components/ui/Modal';
import {
  TemplateIcon,
  TemplateList,
  TemplateName,
  TemplateRow,
} from './SignatureTemplatesModal.styles';
import { SIGNATURE_TEMPLATES_MODAL_IDS } from './SignatureTemplatesModal.testids';

export interface SignatureTemplatesModalProps {
  /** Receives the chosen template's body, which the section drops into a slot. */
  onPick: (content: string) => void;
  onClose: () => void;
}

// The reusable signature bodies, offered under "התבניות שלי" (main,
// Edit.tsx:5149).
//
// The query lives inside this lazy component rather than in the section, so the
// catalog is fetched when someone asks to see it and not on every document load.
export const SignatureTemplatesModal = ({ onPick, onClose }: SignatureTemplatesModalProps) => {
  const { data } = useSignatures();
  const templates = (data ?? SIGNATURES_FALLBACK.signatures).templates;

  // Picking closes the dialog: there is one thing to do here, and staying open
  // after it would invite a second template nobody asked for.
  const handlePick = (content: string) => () => {
    onPick(content);
    onClose();
  };

  return (
    <Modal
      title="התבניות שלי — חתימות"
      width={420}
      maxHeight="70vh"
      noBodyPadding
      onClose={onClose}
      data-testid={SIGNATURE_TEMPLATES_MODAL_IDS.root}
    >
      <TemplateList>
        {templates.map((template) => (
          <TemplateRow
            key={template.id}
            type="button"
            data-testid={SIGNATURE_TEMPLATES_MODAL_IDS.template(template.id)}
            onClick={handlePick(template.content ?? '')}
          >
            <TemplateIcon>
              <PenLine size={16} aria-hidden="true" />
            </TemplateIcon>
            <TemplateName>{template.name}</TemplateName>
          </TemplateRow>
        ))}
      </TemplateList>
    </Modal>
  );
};
