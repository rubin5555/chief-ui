import { Lock, Paperclip } from 'lucide-react';
import type { SectionMeta } from '../../types';
import {
  AttachmentChip,
  AttachmentChips,
  ClassifiedBox,
  ContentPreview,
  FootnoteList,
  HeadingIndex,
  HeadingRow,
  HeadingTitle,
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
  meta?: SectionMeta;
}

// Read-only render for Phase 1 — one component covering what main's Edit.tsx
// duplicated 3x (topic/section/sub-section content blocks; subjects are
// headings only in dev's tree model, so this covers section/subSection).
// Phase 2 swaps ContentPreview's dangerouslySetInnerHTML for a mounted
// <ContentEditor>.
export const EditableSectionBody = ({
  id,
  depth,
  index,
  title,
  content,
  meta,
}: EditableSectionBodyProps) => {
  const isMuted = depth === 'subSection';
  const isClassified = Boolean(meta?.classification.level);

  return (
    <SectionBlock $depth={depth} data-testid={EDITABLE_SECTION_BODY_IDS.root(id)}>
      <HeadingRow>
        <HeadingIndex $muted={isMuted}>{index}</HeadingIndex>
        <HeadingTitle $muted={isMuted}>{title}</HeadingTitle>
        {meta && (
          <StatusBadge
            $status={meta.status}
            data-testid={EDITABLE_SECTION_BODY_IDS.statusBadge(id)}
          />
        )}
      </HeadingRow>

      {isClassified ? (
        <ClassifiedBox>
          <Lock size={14} />
          תוכן ממודר — {meta?.classification.level}
        </ClassifiedBox>
      ) : (
        <ContentPreview
          $isEmpty={!content}
          data-testid={EDITABLE_SECTION_BODY_IDS.content(id)}
          dangerouslySetInnerHTML={{ __html: content || 'ללא תוכן' }}
        />
      )}

      {meta && meta.footnotes.length > 0 && (
        <FootnoteList>
          {meta.footnotes.map((footnote, footnoteIndex) => (
            <li key={footnoteIndex}>{footnote}</li>
          ))}
        </FootnoteList>
      )}

      {meta && meta.attachments.length > 0 && (
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
