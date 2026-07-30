import { EyeOff, Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { ContentEditor } from '@/components/ui/ContentEditor';
import { useDebounce } from '@/hooks/useDebounce';
import { DOC_NODE_ATTR } from '../../document.constants';
import type { Footnote, SectionMeta } from '../../types';
import { AttachmentChipList } from '../AttachmentPicker';
import { useSectionChatCoordination } from '../SectionChat';
import { FootnoteList } from './components/FootnoteList';
import { BodyRoot, ClassifiedBox, HiddenNotice } from './EditableSectionBody.styles';
import { EDITABLE_SECTION_BODY_IDS } from './EditableSectionBody.testids';

export interface EditableSectionBodyProps {
  id: string;
  depth: 'section' | 'subSection';
  content: string;
  meta: SectionMeta;
  onContentChange: (content: string) => void;
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

  const { isMarking } = useSectionChatCoordination();

  const [draft, setDraft] = useState(content);
  const debouncedDraft = useDebounce(draft, 300);

  // biome-ignore lint/correctness/useExhaustiveDependencies: see comment above
  useEffect(() => {
    if (debouncedDraft !== content) onContentChange(debouncedDraft);
  }, [debouncedDraft]);

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
        <div data-testid={EDITABLE_SECTION_BODY_IDS.content(id)} {...{ [DOC_NODE_ATTR]: id }}>
          <ContentEditor
            id={id}
            value={draft}
            onChange={setDraft}
            placeholder={PLACEHOLDER[depth]}
            minHeight={MIN_HEIGHT[depth]}
            selectionOnly={isMarking}
            inset
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
