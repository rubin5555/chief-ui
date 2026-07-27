import { EyeOff, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ContentEditor } from '@/components/ui/ContentEditor';
import { useDebounce } from '@/hooks/useDebounce';
import type { Footnote, SectionMeta } from '../../types';
import { AttachmentChipList } from '../AttachmentPicker';
import { FootnoteList } from './components/FootnoteList';
import { BodyRoot, ClassifiedBox, HiddenNotice } from './EditableSectionBody.styles';
import { EDITABLE_SECTION_BODY_IDS } from './EditableSectionBody.testids';

export interface EditableSectionBodyProps {
  id: string;
  depth: 'section' | 'subSection';
  content: string;
  meta: SectionMeta;
  onContentChange: (content: string) => void;
  /** Opens the same dialog the node's paperclip does — the chips are a way in, not a second list. */
  onOpenAttachments: () => void;
  readOnly: boolean;
  onFootnotesChange: (footnotes: Footnote[]) => void;
}

const PLACEHOLDER: Record<EditableSectionBodyProps['depth'], string> = {
  section: 'תוכן הסעיף...',
  subSection: 'תוכן תת הסעיף...',
};

const MIN_HEIGHT: Record<EditableSectionBodyProps['depth'], number> = {
  section: 60,
  subSection: 50,
};

// The body of a section or sub-section: the editor, or whichever notice replaces
// it when the node is hidden or classified, plus its footnotes and attachments.
// The heading and its action cluster belong to the owning SectionBlock /
// SubSectionBlock, matching main's structure.
export const EditableSectionBody = ({
  id,
  depth,
  content,
  meta,
  onContentChange,
  onOpenAttachments,
  readOnly,
  onFootnotesChange,
}: EditableSectionBodyProps) => {
  const isClassified = meta.classification.level !== null;

  // ContentEditor stays fully responsive on every keystroke; only the outward
  // tree mutation (which re-renders the whole canvas) is debounced, per
  // .claude/skills/react-engineering.md's "Input-Driven Action Debouncing".
  const [draft, setDraft] = useState(content);
  const debouncedDraft = useDebounce(draft, 300);

  // Only re-fire when the debounced draft itself changes; content/
  // onContentChange are read, not depended on.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    if (debouncedDraft !== content) onContentChange(debouncedDraft);
  }, [debouncedDraft]);

  // If this section gets filtered out of the tree (a status-filter change, e.g.
  // via FilterPanel) before the 300ms debounce above fires, the pending commit
  // would otherwise be silently dropped when this component unmounts. Flush any
  // unflushed draft on unmount as a safety net, independent of the debounce
  // timer. Refs avoid a stale closure — this only needs the values as of the
  // actual unmount, not whatever render scheduled the effect.
  const draftRef = useRef(draft);
  draftRef.current = draft;
  const contentRef = useRef(content);
  contentRef.current = content;
  const onContentChangeRef = useRef(onContentChange);
  onContentChangeRef.current = onContentChange;

  useEffect(
    () => () => {
      if (draftRef.current !== contentRef.current) onContentChangeRef.current(draftRef.current);
    },
    [],
  );

  return (
    <BodyRoot data-testid={EDITABLE_SECTION_BODY_IDS.root(id)}>
      {meta.hidden ? (
        <HiddenNotice>
          <EyeOff size={14} />
          סעיף מוסתר
        </HiddenNotice>
      ) : isClassified ? (
        <ClassifiedBox>
          <Lock size={14} />
          תוכן ממודר — {meta.classification.level}
        </ClassifiedBox>
      ) : (
        <div data-testid={EDITABLE_SECTION_BODY_IDS.content(id)}>
          <ContentEditor
            id={id}
            value={draft}
            onChange={setDraft}
            placeholder={PLACEHOLDER[depth]}
            minHeight={MIN_HEIGHT[depth]}
          />
        </div>
      )}

      <FootnoteList
        nodeId={id}
        footnotes={meta.footnotes}
        readOnly={readOnly}
        onChange={onFootnotesChange}
      />

      <AttachmentChipList nodeId={id} attachments={meta.attachments} onOpen={onOpenAttachments} />
    </BodyRoot>
  );
};
