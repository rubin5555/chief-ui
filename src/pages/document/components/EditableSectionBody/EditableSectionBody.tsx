import { EyeOff, Lock, Paperclip } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ContentEditor } from '@/components/ui/ContentEditor';
import { useDebounce } from '@/hooks/useDebounce';
import type { NodePermissions, SectionMeta } from '../../types';
import { SectionChat } from '../SectionChat';
import { SectionMenu } from '../SectionMenu';
import {
  AttachmentChip,
  AttachmentChips,
  ClassifiedBox,
  FootnoteList,
  HeadingIndex,
  HeadingRow,
  HeadingTitle,
  HiddenNotice,
  SectionBlock,
  StatusBadge,
} from './EditableSectionBody.styles';
import { EDITABLE_SECTION_BODY_IDS } from './EditableSectionBody.testids';

export interface EditableSectionBodyProps {
  id: string;
  depth: 'section' | 'subSection';
  index: string;
  title: string;
  content: string;
  meta: SectionMeta;
  permissions: NodePermissions;
  onContentChange: (content: string) => void;
  onChangePermissions: (role: 'approvers' | 'editors', value: string[]) => void;
  onToggleHidden: () => void;
  onToggleClassified: () => void;
  onChangeClassificationViewers: (ids: string[]) => void;
  onDelete: () => void;
}

const PLACEHOLDER: Record<EditableSectionBodyProps['depth'], string> = {
  section: 'תוכן הסעיף...',
  subSection: 'תוכן תת הסעיף...',
};

const MIN_HEIGHT: Record<EditableSectionBodyProps['depth'], number> = {
  section: 60,
  subSection: 50,
};

// One component covering what main's Edit.tsx duplicated 3x (topic/section/
// sub-section content blocks; subjects are headings only in dev's tree
// model, so this covers section/subSection).
export const EditableSectionBody = ({
  id,
  depth,
  index,
  title,
  content,
  meta,
  permissions,
  onContentChange,
  onChangePermissions,
  onToggleHidden,
  onToggleClassified,
  onChangeClassificationViewers,
  onDelete,
}: EditableSectionBodyProps) => {
  const isMuted = depth === 'subSection';
  const isClassified = meta.classification.level !== null;

  // ContentEditor stays fully responsive on every keystroke; only the
  // outward tree mutation (which re-renders the whole canvas) is debounced,
  // per .claude/skills/react-engineering.md's "Input-Driven Action
  // Debouncing" recipe.
  const [draft, setDraft] = useState(content);
  const debouncedDraft = useDebounce(draft, 300);

  // Only re-fire when the debounced draft itself changes; content/
  // onContentChange are read, not depended on.
  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    if (debouncedDraft !== content) onContentChange(debouncedDraft);
  }, [debouncedDraft]);

  // If this section gets filtered out of the tree (a status-filter change,
  // e.g. via FilterPanel) before the 300ms debounce above fires, the pending
  // commit would otherwise be silently dropped when this component unmounts.
  // Flush any unflushed draft on unmount as a safety net, independent of the
  // debounce timer. Refs avoid a stale closure — this only needs the values
  // as of the actual unmount, not whatever render scheduled the effect.
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
    <SectionBlock $depth={depth} data-testid={EDITABLE_SECTION_BODY_IDS.root(id)}>
      <HeadingRow>
        <HeadingIndex $muted={isMuted}>{index}</HeadingIndex>
        <HeadingTitle $muted={isMuted}>{title}</HeadingTitle>
        <StatusBadge
          $status={meta.status}
          data-testid={EDITABLE_SECTION_BODY_IDS.statusBadge(id)}
        />
        <SectionChat sectionId={id} title={title || 'סעיף ללא שם'} />
        <SectionMenu
          sectionId={id}
          permissions={permissions}
          isHidden={meta.hidden}
          classificationLevel={meta.classification.level}
          classificationViewerIds={meta.classification.viewerIds}
          onChangePermissions={onChangePermissions}
          onToggleHidden={onToggleHidden}
          onToggleClassified={onToggleClassified}
          onChangeClassificationViewers={onChangeClassificationViewers}
          onDelete={onDelete}
        />
      </HeadingRow>

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

      {meta.footnotes.length > 0 && (
        <FootnoteList>
          {meta.footnotes.map((footnote) => (
            <li key={footnote.id}>{footnote.text}</li>
          ))}
        </FootnoteList>
      )}

      {meta.attachments.length > 0 && (
        <AttachmentChips>
          {meta.attachments.map((attachment) => (
            <AttachmentChip key={attachment.id}>
              <Paperclip size={11} />
              {attachment.name}
            </AttachmentChip>
          ))}
        </AttachmentChips>
      )}
    </SectionBlock>
  );
};
