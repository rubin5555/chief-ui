import type { TinyQuillToolbarState } from '@workspace/tiny-quill-editor';
import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { RemoteCursorInfo } from '@/collab/types';
import { useCollabContext } from './CollabContext';

const EMPTY_CURSORS = new Map<string, RemoteCursorInfo | null>();

export interface ContentEditorContextValue {
  toolbarId: string;
  activeTinyToolbar: TinyQuillToolbarState | null;
  setActiveTinyToolbar: (toolbar: TinyQuillToolbarState | null) => void;
  activeId: string | null;
  // The *field* being edited, as opposed to `activeId`'s editor instance. The
  // toolbar acts on the editor for most things, but a footnote belongs to the
  // section rather than to the text inside it.
  activeFieldId: string | null;
  setActive: (id: string | null) => void;
  requestActivate: (fieldId: string, instanceId: string) => void;
  remoteCursors: Map<string, RemoteCursorInfo | null>;
  // Whether this page holds footnotes at all — the document does, the share
  // and template dialogs use the same editor and the same ribbon and do not.
  // That is a different question from whether one can be added *right now*,
  // which is what `addFootnoteToActive` being null answers.
  supportsFootnotes: boolean;
  // Returns the marker the new footnote is numbered with, so the caller can
  // reference it from the text it was added for.
  addFootnoteToActive: (() => string) | null;
}

const ContentEditorContext = createContext<ContentEditorContextValue | null>(null);

export interface ContentEditorProviderProps {
  // How the page adds a footnote to a field, if it can, returning the marker
  // it was numbered with. Left out by a page whose editors have nothing under
  // them to add one to.
  onAddFootnote?: (fieldId: string) => string;
  children: ReactNode;
}

export const ContentEditorProvider = ({ onAddFootnote, children }: ContentEditorProviderProps) => {
  const toolbarId = useRef(`ce-shared-tb-${self.crypto.randomUUID()}`);
  const [activeTinyToolbar, setActiveTinyToolbar] = useState<TinyQuillToolbarState | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const collab = useCollabContext();

  const setActive = useCallback((id: string | null) => {
    setActiveId(id);
    if (id === null) {
      setActiveFieldId(null);
      setActiveTinyToolbar(null);
    }
  }, []);

  const requestActivate = useCallback((fieldId: string, instanceId: string) => {
    setActiveId(instanceId);
    setActiveFieldId(fieldId);
  }, []);

  const addFootnoteToActive = useMemo(
    () => (onAddFootnote && activeFieldId ? () => onAddFootnote(activeFieldId) : null),
    [onAddFootnote, activeFieldId],
  );

  const value = useMemo<ContentEditorContextValue>(
    () => ({
      toolbarId: toolbarId.current,
      activeTinyToolbar,
      setActiveTinyToolbar,
      activeId,
      activeFieldId,
      setActive,
      requestActivate,
      supportsFootnotes: onAddFootnote !== undefined,
      addFootnoteToActive,
      remoteCursors: collab?.remoteCursors ?? EMPTY_CURSORS,
    }),
    [
      activeTinyToolbar,
      activeId,
      activeFieldId,
      setActive,
      collab,
      requestActivate,
      onAddFootnote,
      addFootnoteToActive,
    ],
  );

  return <ContentEditorContext.Provider value={value}>{children}</ContentEditorContext.Provider>;
};

export const useContentEditorContext = () => {
  return useContext(ContentEditorContext);
};
