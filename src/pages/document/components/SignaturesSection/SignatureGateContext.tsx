import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

/** One approver's mark on the document, drawn as a stamp at the foot of the signatures topic. */
export interface ApproverSignature {
  rank: string;
  name: string;
  /** Whether they picked a signature to go with the approval, which adds the handwritten squiggle. */
  hasSignature: boolean;
}

export interface SignatureGate {
  /**
   * `false` when the document can't move to an approval round yet, having been
   * signed by nobody. Called synchronously from the submit handler, which returns
   * early on a `false` — so the answer has to be a return value, not a state
   * update someone reads on the next render.
   */
  requireSignature: () => boolean;
  /** Called by SignaturesSection on mount. Returns its own cleanup. */
  registerGate: (check: () => boolean) => () => void;
  approverSignatures: ApproverSignature[];
  addApproverSignature: (signature: ApproverSignature) => void;
}

const SignatureGateContext = createContext<SignatureGate | null>(null);

export interface SignatureGateProviderProps {
  children: ReactNode;
}

// Connects two things that sit in different subtrees and can't see each other:
// the approval flow in the sidebar, and the signatures topic three levels inside
// the paper.
//
// Feature-scoped and mounted at DocumentCanvas rather than in src/context —
// nothing outside this page has signatures to gate. The alternatives were lifting
// the signature texts up to DocumentCanvas (they matter to exactly one child) or
// threading a ref down through three passthrough layers, which is what "Shrink
// Prop Lists" exists to prevent.
export const SignatureGateProvider = ({ children }: SignatureGateProviderProps) => {
  const [approverSignatures, setApproverSignatures] = useState<ApproverSignature[]>([]);

  // A ref, not state: registering must not re-render, and what reads it is an
  // event handler rather than a render.
  const gateRef = useRef<(() => boolean) | null>(null);

  const registerGate = useCallback((check: () => boolean) => {
    gateRef.current = check;
    return () => {
      // Guarded so a late cleanup from an unmounting section can't clear a
      // registration a newly-mounted one has already made.
      if (gateRef.current === check) gateRef.current = null;
    };
  }, []);

  // No signatures section on screen means nothing to sign, so nothing to block:
  // a document whose `חתימות` topic was deleted must not become unapprovable.
  const requireSignature = useCallback(() => gateRef.current?.() ?? true, []);

  const addApproverSignature = useCallback(
    (signature: ApproverSignature) => setApproverSignatures((prev) => [...prev, signature]),
    [],
  );

  // Memoised on the one value that changes: without it every DocumentCanvas
  // render — one per keystroke anywhere in the document — would re-render both
  // consumers and re-run the registration effect.
  const value = useMemo(
    () => ({ requireSignature, registerGate, approverSignatures, addApproverSignature }),
    [requireSignature, registerGate, approverSignatures, addApproverSignature],
  );

  return <SignatureGateContext.Provider value={value}>{children}</SignatureGateContext.Provider>;
};

/**
 * Throws outside the provider rather than returning a no-op gate: a silently
 * ungated approval flow is the failure this whole file exists to prevent, and it
 * would be invisible until someone approved an unsigned document.
 */
export const useSignatureGate = (): SignatureGate => {
  const gate = useContext(SignatureGateContext);
  if (!gate) throw new Error('useSignatureGate must be used within a SignatureGateProvider');
  return gate;
};
