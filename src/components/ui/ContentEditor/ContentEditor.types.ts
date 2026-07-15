export interface EditorDragEvent {
  clientX: number;
  clientY: number;
  dataTransfer: DataTransfer | null;
  preventDefault(): void;
}

export interface EditorClickEvent {
  target: EventTarget | null;
}

export interface TinyMceEditor {
  focus(): void;
  selection: {
    setRng(rng: Range): void;
    placeCaretAt(clientX: number, clientY: number): void;
    getRng(): Range;
  };
  nodeChanged(): void;
  getBody(): HTMLElement;
  getContent(): string;
  setContent(html: string): void;
  insertContent(html: string): void;
  on(event: 'dragover' | 'drop', callback: (e: EditorDragEvent) => void): void;
  on(event: 'click', callback: (e: EditorClickEvent) => void): void;
  on(event: string, callback: () => void): void;
  addCommand(name: string, callback: () => void): void;
  undoManager: { ignore(callback: () => void): void; add(): void };
}
