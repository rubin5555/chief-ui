import type { ReactNode } from 'react';
import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from 'react';
import { chunkGuard } from '@/utils/chunkRecovery';

const DocPermissionsModal = lazy(
  chunkGuard(() =>
    import('./DocPermissionsModal').then((m) => ({ default: m.DocPermissionsModal })),
  ),
);

export interface DocPermissionsRequest {
  levelId?: string;
  sectionId?: string;
}

export interface DocPermissions {
  openDocPermissions: (request?: DocPermissionsRequest) => void;
}

const DocPermissionsContext = createContext<DocPermissions | null>(null);

export interface DocPermissionsProviderProps {
  isDistributed: boolean;
  children: ReactNode;
}

export const DocPermissionsProvider = ({
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

  return (
    <DocPermissionsContext.Provider value={value}>
      {children}
      <Suspense fallback={null}>
        {request && (
          <DocPermissionsModal
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
