import type { ReactNode } from 'react';
import { createContext, lazy, Suspense, useCallback, useContext, useMemo, useState } from 'react';

const DocPermissionsModal = lazy(() =>
  import('./DocPermissionsModal').then((m) => ({ default: m.DocPermissionsModal })),
);

export interface DocPermissionsRequest {
  /** Which of the five permissions to open on. Defaults to the first. */
  levelId?: string;
  /** Preselected in the section tree, for the two per-section permissions. */
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

/**
 * The document permissions dialog has two ways in that sit in different subtrees:
 * the navbar toolbar's key button, and a section's 3-dots menu, four levels deep
 * inside the paper. main wires the second to the first through a `permTrigger`
 * prop threaded down from the page (TopNavbar.tsx:1093); this is that wire, with
 * the state and the dialog kept together in one place instead.
 *
 * Feature-scoped, and mounted at DocumentCanvas rather than living in
 * src/context: nothing outside this page has a document to permission. The
 * provider owns *and renders* the dialog, so this is not the callback context
 * `.claude/skills/modal-placement.md` rules out — that one puts a modal's state
 * in one subtree and its rendering in another, which is what going through
 * DocumentActionsSlot would have done.
 */
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
