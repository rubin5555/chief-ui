import type { DirectoryUser } from '@/api/users';
import { GridTable, GridTableRow } from '@/components/ui/GridTable';
import { SelectionCheckbox } from '../../../../components/SelectionCheckbox';
import { CheckboxCell, EmptyState } from '../../../tabs.shared.styles';
import { EXCEL_PREVIEW_GRID } from '../../ExcelTab.constants';
import { EXCEL_TAB_IDS } from '../../ExcelTab.testids';
import { ListCount, ListHeader, ListSection } from '../components.shared.styles';
import { RowCell, RowName } from './ExcelFoundList.styles';

interface ExcelFoundListProps {
  people: DirectoryUser[];
  addedIdNumbers: Set<string>;
  excludedIdNumbers: Set<string>;
  onToggle: (idNumber: string) => void;
}

export const ExcelFoundList = ({
  people,
  addedIdNumbers,
  excludedIdNumbers,
  onToggle,
}: ExcelFoundListProps) => {
  const handleToggle = (idNumber: string, isAdded: boolean) => () => {
    if (!isAdded) onToggle(idNumber);
  };

  return (
    <ListSection $fill data-testid={EXCEL_TAB_IDS.foundList}>
      <ListHeader>
        נמצאו במערכת
        <ListCount>({people.length})</ListCount>
      </ListHeader>

      <GridTable
        columns={EXCEL_PREVIEW_GRID}
        headers={[
          { key: 'select' },
          { key: 'name', label: 'שם', align: 'right' },
          { key: 'idNumber', label: 'ת.ז.' },
          { key: 'organization', label: 'ארגון' },
        ]}
        items={people}
        getRowKey={(person) => person.idNumber}
        emptyState={<EmptyState>אף מספר אישי בקובץ לא נמצא במערכת</EmptyState>}
        renderRow={(person: DirectoryUser) => {
          const isAdded = addedIdNumbers.has(person.idNumber);
          const isSelected = !isAdded && !excludedIdNumbers.has(person.idNumber);

          return (
            <GridTableRow
              isSelected={isSelected}
              isAdded={isAdded}
              onClick={handleToggle(person.idNumber, isAdded)}
            >
              <CheckboxCell data-testid={EXCEL_TAB_IDS.foundRow(person.idNumber)}>
                <SelectionCheckbox isSelected={isSelected} isAdded={isAdded} />
              </CheckboxCell>
              <RowName>{person.name}</RowName>
              <RowCell $tabular>{person.idNumber}</RowCell>
              <RowCell>{person.environment}</RowCell>
            </GridTableRow>
          );
        }}
      />
    </ListSection>
  );
};
