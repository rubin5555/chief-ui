import type { ReactNode } from 'react';
import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from 'react';
import { chunkGuard } from '@/utils/chunkRecovery';

const DocPermissionsModal = lazy(
  chunkGuard(() =>
    import('./DocPermissionsModal').then((m) => ({ default: m.DocPermissionsModal })),
  ),
);

export interface DocPermissionsRequest {
  // Only for a page that holds more than one document — the catalog names the
  // row's document here. A document page leaves it out and the provider's own
  // `docId` answers instead.
  docId?: string;
  levelId?: string;
  sectionId?: string;
}

export interface DocPermissions {
  openDocPermissions: (request?: DocPermissionsRequest) => void;
}

const DocPermissionsContext = createContext<DocPermissions | null>(null);

export interface DocPermissionsProviderProps {
  // The document the dialog is about, for a page that has exactly one. A page
  // listing many leaves this out and names the document per request.
  docId?: string;
  isDistributed: boolean;
  children: ReactNode;
}

export const DocPermissionsProvider = ({
  docId,
  isDistributed,
  children,
}: DocPermissionsProviderProps) => {
  const [request, setRequest] = useState<DocPermissionsRequest | null>(null);

  const openDocPermissions = useCallback(
    (next: DocPermissionsRequest = {}) => setRequest(next),
    [],
  );
  const handleClose = () => setRequest(null);

  const value = useMemo(() => ({ openDocPermissions }), [openDocPermissions]);

  const activeDocId = request?.docId ?? docId;

  return (
    <DocPermissionsContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        {request && activeDocId && (
          <DocPermissionsModal
            key={activeDocId}
            docId={activeDocId}
            isDistributed={isDistributed}
            initialLevelId={request.levelId}
            initialSectionId={request.sectionId}
            onClose={handleClose}
          />
        )}
      </Suspense>
    </DocPermissionsContext.Provider>
  );
};

export const useDocPermissions = (): DocPermissions => {
  const context = useContext(DocPermissionsContext);
  if (!context) throw new Error('useDocPermissions must be used inside a DocPermissionsProvider');
  return context;
};
