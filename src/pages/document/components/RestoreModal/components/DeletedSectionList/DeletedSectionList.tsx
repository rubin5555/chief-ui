import { SelectionMarker } from '../../../SelectionMarker';
import { RESTORE_MODAL_IDS } from '../../RestoreModal.testids';
import type { DeletedSectionEntry } from '../../RestoreModal.types';
import {
  ListFooter,
  ListHeader,
  ListRoot,
  ListScroll,
  ListSubtitle,
  ListTitle,
  RestoreButton,
  RowIndex,
  RowLabel,
  RowTitle,
  SectionRow,
  SubSectionRow,
} from './DeletedSectionList.styles';

interface DeletedSectionListProps {
  entries: DeletedSectionEntry[];
  checkedIds: string[];
  onToggle: (sectionId: string) => void;
  onRestore: () => void;
}

const restoreLabel = (count: number) => {
  if (count === 0) return 'בחר סעיפים';
  return count === 1 ? 'שחזר סעיף' : `שחזר ${count} סעיפים`;
};

export const DeletedSectionList = ({
  entries,
  checkedIds,
  onToggle,
  onRestore,
}: DeletedSectionListProps) => {
  const handleToggle = (sectionId: string) => () => onToggle(sectionId);

  return (
    <ListRoot>
      <ListHeader>
        <ListTitle>סעיפים שנמחקו</ListTitle>
        <ListSubtitle>לחץ לבחירה</ListSubtitle>
      </ListHeader>

      <ListScroll data-testid={RESTORE_MODAL_IDS.list}>
        {entries.map(({ section, label }) => {
          const isChecked = checkedIds.includes(section.id);
          return (
            <div key={section.id}>
              <SectionRow
                type="button"
                aria-pressed={isChecked}
                $checked={isChecked}
                data-testid={RESTORE_MODAL_IDS.row(section.id)}
                onClick={handleToggle(section.id)}
              >
                <SelectionMarker checked={isChecked} />
                <RowLabel>
                  <RowIndex $strong>{label}</RowIndex>
                  <RowTitle $checked={isChecked}>{section.title || 'סעיף ללא שם'}</RowTitle>
                </RowLabel>
              </SectionRow>

              {section.subSections.map((subSection, index) => (
                <SubSectionRow key={subSection.id} $checked={isChecked}>
                  <SelectionMarker checked={isChecked} />
                  <RowLabel>
                    <RowIndex>
                      {label}.{index + 1}
                    </RowIndex>
                    <RowTitle $checked={isChecked} $muted>
                      {subSection.title || 'תת־סעיף ללא שם'}
                    </RowTitle>
                  </RowLabel>
                </SubSectionRow>
              ))}
            </div>
          );
        })}
      </ListScroll>

      <ListFooter>
        <RestoreButton
          type="button"
          disabled={checkedIds.length === 0}
          data-testid={RESTORE_MODAL_IDS.restoreBtn}
          onClick={onRestore}
        >
          {restoreLabel(checkedIds.length)}
        </RestoreButton>
      </ListFooter>
    </ListRoot>
  );
};
