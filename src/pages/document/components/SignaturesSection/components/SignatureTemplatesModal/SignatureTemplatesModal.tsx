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
  onPick: (content: string) => void;
  onClose: () => void;
}

export const SignatureTemplatesModal = ({ onPick, onClose }: SignatureTemplatesModalProps) => {
  const { data } = useSignatures();
  const templates = (data ?? SIGNATURES_FALLBACK.signatures).templates;

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
