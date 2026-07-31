import { FileText, Plus } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
import { chunkGuard } from '../../../../utils/chunkRecovery';
import type { Subject } from '../../types';
import { SubjectHeaderRow, SubjectRoot } from '../components.shared.styles';
import { NodeTitleField } from '../NodeTitleField';
import { ApproverStampList } from './components/ApproverStampList';
import { SignatureTextarea } from './components/SignatureTextarea';
import { useSignatureGate } from './SignatureGateContext';
import { useSignaturesSectionAnalytics } from './SignaturesSection.analytics';
import {
  AddSignatureBtn,
  HeaderActions,
  RequiredWarning,
  SignaturesBody,
  TemplatesBtn,
} from './SignaturesSection.styles';
import { SIGNATURES_SECTION_IDS } from './SignaturesSection.testids';

const SignatureTemplatesModal = lazy(
  chunkGuard(() =>
    import('./components/SignatureTemplatesModal').then((m) => ({
      default: m.SignatureTemplatesModal,
    })),
  ),
);

interface SignatureBlock {
  id: string;
  text: string;
}

const makeBlockId = () => `signature-${self.crypto.randomUUID()}`;
const emptyBlock = (): SignatureBlock => ({ id: makeBlockId(), text: '' });

export interface SignaturesSectionProps {
  subject: Subject;
  highlighted: boolean;
  tree: ReturnType<typeof useDocumentTree>;
  readOnly: boolean;
}

export const SignaturesSection = ({
  subject,
  highlighted,
  tree,
  readOnly,
}: SignaturesSectionProps) => {
  const gate = useSignatureGate();

  const [signatures, setSignatures] = useState<SignatureBlock[]>(() => [emptyBlock()]);
  const [showRequired, setShowRequired] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { trackTemplateUsed, trackSignatureAdded } = useSignaturesSectionAnalytics();

  const signaturesRef = useRef(signatures);
  signaturesRef.current = signatures;

  const handleRequireSignature = useCallback(() => {
    if (signaturesRef.current.some((signature) => signature.text.trim())) return true;

    setShowRequired(true);

    requestAnimationFrame(() =>
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
    return false;
  }, []);

  useEffect(() => gate.registerGate(handleRequireSignature), [gate, handleRequireSignature]);

  const handleTitleChange = (title: string) => tree.updateSubjectTitle(subject.id, title);

  const handleSignatureChange = (id: string) => (value: string) => {
    setSignatures((prev) =>
      prev.map((signature) => (signature.id === id ? { ...signature, text: value } : signature)),
    );

    if (value.trim()) setShowRequired(false);
  };

  const handleAddSignature = () => {
    trackSignatureAdded();
    setSignatures((prev) => [...prev, emptyBlock()]);
  };
  const handleOpenTemplates = () => setShowTemplates(true);
  const handleCloseTemplates = () => setShowTemplates(false);

  const handlePickTemplate = (content: string) => {
    trackTemplateUsed();
    setSignatures((prev) => {
      const empty = prev.find((signature) => signature.text === '');
      if (!empty) return [...prev, { id: makeBlockId(), text: content }];
      return prev.map((signature) =>
        signature.id === empty.id ? { ...signature, text: content } : signature,
      );
    });
    setShowRequired(false);
  };

  return (
    <SubjectRoot
      ref={sectionRef}
      $highlighted={highlighted}
      data-testid={SIGNATURES_SECTION_IDS.root}
    >
      <SubjectHeaderRow>
        <NodeTitleField
          nodeId={subject.id}
          variant="subject"
          value={subject.title}
          onChange={handleTitleChange}
        />

        {!readOnly && (
          <HeaderActions>
            <TemplatesBtn
              type="button"
              data-testid={SIGNATURES_SECTION_IDS.templatesBtn}
              onClick={handleOpenTemplates}
            >
              <FileText size={12} aria-hidden="true" />
              התבניות שלי
            </TemplatesBtn>
            <AddSignatureBtn
              type="button"
              data-testid={SIGNATURES_SECTION_IDS.addBtn}
              onClick={handleAddSignature}
            >
              <Plus size={12} aria-hidden="true" />
              הוספת חתימה נוספת
            </AddSignatureBtn>
          </HeaderActions>
        )}
      </SubjectHeaderRow>

      <SignaturesBody dir="rtl">
        {showRequired && (
          <RequiredWarning role="alert" data-testid={SIGNATURES_SECTION_IDS.requiredWarning}>
            <span aria-hidden="true">⚠</span>
            נדרש לחתום על מסמך זה
          </RequiredWarning>
        )}

        {signatures.map((signature, index) => (
          <SignatureTextarea
            key={signature.id}
            index={index}
            value={signature.text}
            required={showRequired}
            readOnly={readOnly}
            onChange={handleSignatureChange(signature.id)}
          />
        ))}

        <ApproverStampList signatures={gate.approverSignatures} />
      </SignaturesBody>

      <Suspense fallback={null}>
        {showTemplates && (
          <SignatureTemplatesModal onPick={handlePickTemplate} onClose={handleCloseTemplates} />
        )}
      </Suspense>
    </SubjectRoot>
  );
};
