import { FileText, Plus } from 'lucide-react';
import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import type { useDocumentTree } from '@/hooks/useDocumentTree';
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

const SignatureTemplatesModal = lazy(() =>
  import('./components/SignatureTemplatesModal').then((m) => ({
    default: m.SignatureTemplatesModal,
  })),
);

/** One signature block. Its id exists only to key the row it renders in. */
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

// The `חתימות` topic, which main renders as its own thing rather than as ordinary
// content (Edit.tsx:4303). It draws the whole topic — heading row included —
// because the heading is where its two actions live, and they act on state this
// component owns.
//
// The signature texts are local. They matter to exactly one part of the document,
// and lifting them to DocumentCanvas to satisfy the approval gate is what
// SignatureGateContext exists to avoid.
export const SignaturesSection = ({
  subject,
  highlighted,
  tree,
  readOnly,
}: SignaturesSectionProps) => {
  const gate = useSignatureGate();
  // Each block carries an id even though main's are a plain string[]: nothing
  // reorders or removes one *yet*, and the first delete button someone adds would
  // otherwise remount every block below it and drop what was being typed.
  const [signatures, setSignatures] = useState<SignatureBlock[]>(() => [emptyBlock()]);
  const [showRequired, setShowRequired] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { trackTemplateUsed, trackSignatureAdded } = useSignaturesSectionAnalytics();

  // Read by the gate check below, which is registered once and must see the
  // current texts rather than the ones from the render that registered it.
  const signaturesRef = useRef(signatures);
  signaturesRef.current = signatures;

  const handleRequireSignature = useCallback(() => {
    if (signaturesRef.current.some((signature) => signature.text.trim())) return true;

    setShowRequired(true);
    // One frame's wait, because the approval dialog closes in the same tick and
    // the page reflows under it — scrolling before that lands on the wrong place.
    // main uses a 100ms timeout for the same reason; a frame is the primitive
    // that actually describes what is being waited for.
    requestAnimationFrame(() =>
      sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }),
    );
    return false;
  }, []);

  // The one sanctioned effect here: registering with an external registry, with
  // its own cleanup, deriving no state. The callback is stable, so this runs on
  // mount and unmount and at no other time.
  useEffect(() => gate.registerGate(handleRequireSignature), [gate, handleRequireSignature]);

  const handleTitleChange = (title: string) => tree.updateSubjectTitle(subject.id, title);

  const handleSignatureChange = (id: string) => (value: string) => {
    setSignatures((prev) =>
      prev.map((signature) => (signature.id === id ? { ...signature, text: value } : signature)),
    );
    // Cleared inline as soon as anything is typed, exactly where main clears it
    // (4315) — the warning is about an empty block, so it goes when the block
    // stops being empty.
    if (value.trim()) setShowRequired(false);
  };

  const handleAddSignature = () => {
    trackSignatureAdded();
    setSignatures((prev) => [...prev, emptyBlock()]);
  };
  const handleOpenTemplates = () => setShowTemplates(true);
  const handleCloseTemplates = () => setShowTemplates(false);

  // A template fills the first empty block rather than always appending: someone
  // who pressed `+` and then went looking for a template meant to fill that one.
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
            // Position is still what labels it: a signature block has no name, so
            // "חתימה 2" is the only thing to call the second one.
            index={index}
            value={signature.text}
            required={showRequired}
            readOnly={readOnly}
            onChange={handleSignatureChange(signature.id)}
          />
        ))}

        {/* Text signatures above, stamps below — main's order (commit a88946f). */}
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
