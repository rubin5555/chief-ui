import { SelectionMarker } from '../../../SelectionMarker';
import { RESTORE_MODAL_IDS } from '../../RestoreModal.testids';
import type { DeletedSectionEntry } from '../../RestoreModal.types';
import {
  EmptyState,
  HeadingIndex,
  HeadingMarker,
  HeadingRow,
  HeadingRule,
  HeadingTitle,
  NoContent,
  PreviewContent,
  PreviewEntry,
  PreviewRoot,
  PreviewSubSection,
  SubSectionIndex,
  SubSectionTitle,
} from './DeletedSectionPreview.styles';

interface DeletedSectionPreviewProps {
  entries: DeletedSectionEntry[];
  checkedIds: string[];
  onToggle: (sectionId: string) => void;
}

export const DeletedSectionPreview = ({
  entries,
  checkedIds,
  onToggle,
}: DeletedSectionPreviewProps) => {
  const handleToggle = (sectionId: string) => () => onToggle(sectionId);

  if (entries.length === 0) {
    return (
      <PreviewRoot>
        <EmptyState data-testid={RESTORE_MODAL_IDS.emptyState}>אין סעיפים מחוקים</EmptyState>
      </PreviewRoot>
    );
  }

  return (
    <PreviewRoot data-testid={RESTORE_MODAL_IDS.preview}>
      {entries.map(({ section, label }) => {
        const isChecked = checkedIds.includes(section.id);
        const hasBody = Boolean(section.content.trim()) || section.subSections.length > 0;

        return (
          <PreviewEntry
            key={section.id}
            type="button"
            aria-pressed={isChecked}
            $checked={isChecked}
            data-testid={RESTORE_MODAL_IDS.previewRow(section.id)}
            onClick={handleToggle(section.id)}
          >
            <HeadingRow>
              <HeadingIndex>{label}.</HeadingIndex>
              <HeadingTitle>{section.title || 'סעיף ללא שם'}</HeadingTitle>
              <HeadingRule aria-hidden="true" />
              <HeadingMarker $checked={isChecked}>
                <SelectionMarker checked={isChecked} />
              </HeadingMarker>
            </HeadingRow>

            {section.content.trim() && <PreviewContent>{section.content}</PreviewContent>}

            {section.subSections.map((subSection, index) => (
              <PreviewSubSection key={subSection.id}>
                <SubSectionIndex>
                  {label}.{index + 1}.
                </SubSectionIndex>
                <SubSectionTitle>{subSection.title || 'תת־סעיף ללא שם'}</SubSectionTitle>
              </PreviewSubSection>
            ))}

            {!hasBody && <NoContent>אין תוכן שמור לסעיף זה</NoContent>}
          </PreviewEntry>
        );
      })}
    </PreviewRoot>
  );
};
