import type { useDragReorder } from '@/hooks/useDragReorder';
import type { Section, Subject, SubSection } from '../../types';

export type DropEdge = 'top' | 'bottom' | null;

export type OutlineRow =
  | { kind: 'subject'; key: string; subject: Subject }
  | {
      kind: 'section';
      key: string;
      subjectId: string;
      section: Section;
      index: number;
      number: number;
      siblingIds: string[];
    }
  | {
      kind: 'subSection';
      key: string;
      subjectId: string;
      sectionId: string;
      subSection: SubSection;
      index: number;
      siblingIds: string[];
    }
  | { kind: 'addSection'; key: string; subjectId: string }
  | { kind: 'addSubSection'; key: string; subjectId: string; sectionId: string };

export interface OutlineEditingApi {
  renamingId: string | null;
  editingNewId: string | null;
  startRename: (id: string) => void;
  stopRename: () => void;
  saveNew: (title: string) => void;
  requestDelete: (target: OutlineDeleteTarget) => void;
  onNodeAdded: (level: OutlineDeleteTarget['level']) => void;
}

export interface OutlineDeleteTarget {
  level: 'subject' | 'section' | 'subSection';
  onConfirm: () => void;
}

export interface OutlineDragApi {
  subjects: ReturnType<typeof useDragReorder>;
  sections: ReturnType<typeof useDragReorder>;
  subSections: ReturnType<typeof useDragReorder>;
}

export interface OutlineExpandApi {
  isExpanded: (subjectId: string) => boolean;
  toggle: (subjectId: string) => void;
}
