import type { ImportDocSectionDto } from '@/api/docs';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { SelectionMarker } from '../../../SelectionMarker';
import { IMPORT_DOC_MODAL_IDS } from '../../ImportDocModal.testids';
import {
  BodyLine,
  DocTitle,
  HeadingIndex,
  HeadingMarker,
  HeadingRow,
  HeadingRule,
  HeadingTitle,
  PreviewEntry,
  PreviewLoading,
  PreviewRoot,
} from './ImportSectionPreview.styles';

interface ImportSectionPreviewProps {
  docName: string;
  sections: ImportDocSectionDto[];
  checkedIds: string[];
  loading: boolean;
  onToggle: (sectionId: string) => void;
}

export const ImportSectionPreview = ({
  docName,
  sections,
  checkedIds,
  loading,
  onToggle,
}: ImportSectionPreviewProps) => {
  const handleToggle = (sectionId: string) => () => onToggle(sectionId);

  return (
    <PreviewRoot>
      <DocTitle>{docName}</DocTitle>

      {loading ? (
        <PreviewLoading>
          <InlineSpinner />
        </PreviewLoading>
      ) : (
        sections.map((section) => {
          const isChecked = checkedIds.includes(section.id);
          return (
            <PreviewEntry
              key={section.id}
              type="button"
              aria-pressed={isChecked}
              $checked={isChecked}
              data-testid={IMPORT_DOC_MODAL_IDS.previewRow(section.id)}
              onClick={handleToggle(section.id)}
            >
              <HeadingRow>
                <HeadingIndex>{section.label}.</HeadingIndex>
                <HeadingTitle>{section.title}</HeadingTitle>
                <HeadingRule aria-hidden="true" />
                <HeadingMarker $checked={isChecked}>
                  <SelectionMarker checked={isChecked} shape="square" />
                </HeadingMarker>
              </HeadingRow>

              {section.body.map((line) => (
                <BodyLine key={line}>{line}</BodyLine>
              ))}
            </PreviewEntry>
          );
        })
      )}
    </PreviewRoot>
  );
};
