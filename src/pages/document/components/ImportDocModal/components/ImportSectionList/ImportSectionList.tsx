import type { ImportDocSectionDto } from '@/api/docs';
import { SelectionMarker } from '../../../SelectionMarker';
import { IMPORT_DOC_MODAL_IDS } from '../../ImportDocModal.testids';
import {
  ImportButton,
  ListFooter,
  ListHeader,
  ListRoot,
  ListScroll,
  ListSubtitle,
  ListTitle,
  RowIndex,
  RowLabel,
  RowTitle,
  SectionRow,
} from './ImportSectionList.styles';

interface ImportSectionListProps {
  sections: ImportDocSectionDto[];
  checkedIds: string[];
  onToggle: (sectionId: string) => void;
  onImport: () => void;
}

const importLabel = (count: number) => {
  if (count === 0) return 'בחר סעיפים';
  return count === 1 ? 'ייבא סעיף' : `ייבא ${count} סעיפים`;
};

export const ImportSectionList = ({
  sections,
  checkedIds,
  onToggle,
  onImport,
}: ImportSectionListProps) => {
  const handleToggle = (sectionId: string) => () => onToggle(sectionId);

  return (
    <ListRoot>
      <ListHeader>
        <ListTitle>בחר סעיפים לייבוא</ListTitle>
        <ListSubtitle>לחץ לבחירה</ListSubtitle>
      </ListHeader>

      <ListScroll>
        {sections.map((section) => {
          const isChecked = checkedIds.includes(section.id);
          return (
            <SectionRow
              key={section.id}
              type="button"
              aria-pressed={isChecked}
              $checked={isChecked}
              data-testid={IMPORT_DOC_MODAL_IDS.sectionRow(section.id)}
              onClick={handleToggle(section.id)}
            >
              <SelectionMarker checked={isChecked} shape="square" />
              <RowLabel>
                <RowIndex>{section.label}</RowIndex>
                <RowTitle $checked={isChecked}>{section.title}</RowTitle>
              </RowLabel>
            </SectionRow>
          );
        })}
      </ListScroll>

      <ListFooter>
        <ImportButton
          type="button"
          disabled={checkedIds.length === 0}
          data-testid={IMPORT_DOC_MODAL_IDS.importBtn}
          onClick={onImport}
        >
          {importLabel(checkedIds.length)}
        </ImportButton>
      </ListFooter>
    </ListRoot>
  );
};
