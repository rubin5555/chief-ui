import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';

export interface ApproverSignature {
  rank: string;
  name: string;
  hasSignature: boolean;
}

export interface SignatureGate {
  requireSignature: () => boolean;
  registerGate: (check: () => boolean) => () => void;
  approverSignatures: ApproverSignature[];
  addApproverSignature: (signature: ApproverSignature) => void;
}

const SignatureGateContext = createContext<SignatureGate | null>(null);

export interface SignatureGateProviderProps {
  children: ReactNode;
}

export const SignatureGateProvider = ({ children }: SignatureGateProviderProps) => {
  const [approverSignatures, setApproverSignatures] = useState<ApproverSignature[]>([]);

  const gateRef = useRef<(() => boolean) | null>(null);

  const registerGate = useCallback((check: () => boolean) => {
    gateRef.current = check;
    return () => {
      if (gateRef.current === check) gateRef.current = null;
    };
  }, []);

  const requireSignature = useCallback(() => gateRef.current?.() ?? true, []);

  const addApproverSignature = useCallback(
    (signature: ApproverSignature) => setApproverSignatures((prev) => [...prev, signature]),
    [],
  );

  const value = useMemo(
    () => ({ requireSignature, registerGate, approverSignatures, addApproverSignature }),
    [requireSignature, registerGate, approverSignatures, addApproverSignature],
  );

  return <SignatureGateContext.Provider value={value}>{children}</SignatureGateContext.Provider>;
};

export const useSignatureGate = (): SignatureGate => {
  const gate = useContext(SignatureGateContext);
  if (!gate) throw new Error('useSignatureGate must be used within a SignatureGateProvider');
  return gate;
};
