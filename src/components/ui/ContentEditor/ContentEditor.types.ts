export interface EditorDragEvent {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer | null;
  preventDefault(): void;
}

export interface EditorClickEvent {
  target: EventTarget | null;
}

/**
 * The searchreplace plugin's own API, reachable at `editor.plugins.searchreplace`.
 *
 * It is what lets the ribbon's find-and-replace panel be our design and TinyMCE's
 * behaviour at once: the plugin does the matching, the highlighting and the
 * stepping, and its dialog — which we never open — is only one more caller of
 * these same five functions.
 */
export interface SearchReplaceApi {
  /** Highlights every match and returns how many there were. */
  find(text: string, matchCase: boolean, wholeWord: boolean): number;
  next(): void;
  prev(): void;
  replace(text: string, forward?: boolean, all?: boolean): boolean;
  /** Clears the highlights. Must be called, or they stay in the content. */
  done(keepEditorSelection?: boolean): void;
}

export interface TinyMceEditor {
  focus(): void;
  selection: {
    setRng(rng: Range): void;
    placeCaretAt(clientX: number, clientY: number): void;
    getRng(): Range;
    getNode(): Element;
  };
  nodeChanged(): void;
  getBody(): HTMLElement;
  getContent(): string;
  setContent(html: string): void;
  insertContent(html: string): void;
  on(event: 'dragover' | 'drop', callback: (e: EditorDragEvent) => void): void;
  on(event: 'click', callback: (e: EditorClickEvent) => void): void;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
  addCommand(name: string, callback: () => void): void;
  execCommand(name: string, ui?: boolean, value?: unknown): void;
  queryCommandState(name: string): boolean;
  queryCommandValue(name: string): string;
  undoManager: { ignore(callback: () => void): void; add(): void };
  dom: {
    getParent(node: Node | null, selector: string): HTMLElement | null;
    isBlock(node: Node): boolean;
    getStyle(node: Element, name: string, computed?: boolean): string;
    getAttrib(node: Element, name: string): string;
  };
  formatter: {
    apply(name: string, vars?: Record<string, string>): void;
    remove(name: string, vars?: Record<string, string>): void;
  };
  plugins: { searchreplace?: SearchReplaceApi };
}
