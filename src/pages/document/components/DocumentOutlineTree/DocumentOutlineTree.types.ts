import type { useDragReorder } from '@/hooks/useDragReorder';

/**
 * Which edge of a hovered row a drop would land against, or `null` when this row
 * isn't the current drop target. Its own type so the row components and the shared
 * styles can both name it without importing each other.
 */
export type DropEdge = 'top' | 'bottom' | null;

/**
 * The rename/delete state of the whole tree, passed down whole.
 *
 * All of it lives in DocumentOutlineTree because all of it is single-valued:
 * exactly one row is being renamed at a time, and exactly one delete is pending.
 * Bundling it beats threading six loose callbacks through three levels of rows
 * (.claude/skills/react-engineering.md, "Shrink Prop Lists").
 */
export interface OutlineEditingApi {
  /** The row showing a rename input, if any. */
  renamingId: string | null;
  /**
   * A freshly created topic, which opens in a rename input like any other but
   * deletes itself if you leave it unnamed — so an accidental `+` costs nothing.
   */
  editingNewId: string | null;
  startRename: (id: string) => void;
  /**
   * Leaves rename mode. The title itself is written by the row, which is the only
   * thing that knows its own path through the tree — `updateSubSectionTitle` wants
   * three ids, and collecting them up here would mean storing the path alongside
   * the id just to hand it back down.
   */
  stopRename: () => void;
  /** Names a new topic, or drops it again when the name is empty. */
  saveNew: (title: string) => void;
  requestDelete: (target: OutlineDeleteTarget) => void;
  /**
   * Fired by a row after it adds a child, so the tree can report it. The rows add
   * through `tree` directly — they are the only ones holding the ids — which
   * leaves them no way to be observed otherwise, and importing analytics into a
   * nested row is what .claude/skills/analytics-component.md rules out.
   */
  onNodeAdded: (level: OutlineDeleteTarget['level']) => void;
}

/**
 * A delete waiting on confirmation: what to say in the dialog, and what to do if
 * the answer is yes. Carrying the action itself is what keeps DocumentOutlineTree
 * from needing to know which of the three levels asked.
 */
export interface OutlineDeleteTarget {
  level: 'subject' | 'section' | 'subSection';
  onConfirm: () => void;
}

/** One useDragReorder instance per level — each already scopes itself to the parent holding both ids. */
export interface OutlineDragApi {
  subjects: ReturnType<typeof useDragReorder>;
  sections: ReturnType<typeof useDragReorder>;
  subSections: ReturnType<typeof useDragReorder>;
}

/** Which topics are open. Single object rather than a Set plus a setter, so rows can't reach past `toggle`. */
export interface OutlineExpandApi {
  isExpanded: (subjectId: string) => boolean;
  toggle: (subjectId: string) => void;
}
