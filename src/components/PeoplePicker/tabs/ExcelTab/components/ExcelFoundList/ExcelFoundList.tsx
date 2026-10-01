import type { DirectoryUser } from '@/api/users';
import type { ColumnDef, RowConfig } from '@/components/ui/GridTable';
import { GridTable } from '@/components/ui/GridTable';
import { SelectionCheckbox } from '../../../../components/SelectionCheckbox';
import { CheckboxCell, EmptyState } from '../../../tabs.shared.styles';
import { EXCEL_TAB_IDS } from '../../ExcelTab.testids';
import { ListCount, ListHeader, ListSection } from '../components.shared.styles';
import { RowCell, RowName } from './ExcelFoundList.styles';

const personKey = (person: DirectoryUser) => person.idNumber;

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

  const isRowSelected = (person: DirectoryUser) =>
    !addedIdNumbers.has(person.idNumber) && !excludedIdNumbers.has(person.idNumber);

  const columns: ColumnDef<DirectoryUser>[] = [
    {
      key: 'select',
      width: '28px',
      cell: (person) => (
        <CheckboxCell data-testid={EXCEL_TAB_IDS.foundRow(person.idNumber)}>
          <SelectionCheckbox
            isSelected={isRowSelected(person)}
            isAdded={addedIdNumbers.has(person.idNumber)}
          />
        </CheckboxCell>
      ),
    },
    {
      key: 'name',
      width: '1fr',
      header: 'שם',
      align: 'right',
      cell: (person) => <RowName>{person.name}</RowName>,
    },
    {
      key: 'idNumber',
      width: '80px',
      header: 'ת.ז.',
      cell: (person) => <RowCell $tabular>{person.idNumber}</RowCell>,
    },
    {
      key: 'organization',
      width: '80px',
      header: 'ארגון',
      cell: (person) => <RowCell>{person.environment}</RowCell>,
    },
  ];

  const rowConfig = (person: DirectoryUser): RowConfig => ({
    isSelected: isRowSelected(person),
    isAdded: addedIdNumbers.has(person.idNumber),
    onClick: handleToggle(person.idNumber, addedIdNumbers.has(person.idNumber)),
  });

  return (
    <ListSection $fill data-testid={EXCEL_TAB_IDS.foundList}>
      <ListHeader>
        נמצאו במערכת
        <ListCount>({people.length})</ListCount>
      </ListHeader>

      <GridTable
        columns={columns}
        items={people}
        getRowKey={personKey}
        row={rowConfig}
        emptyState={<EmptyState>אף מספר אישי בקובץ לא נמצא במערכת</EmptyState>}
      />
    </ListSection>
  );
};
