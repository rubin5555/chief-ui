import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { SectionTable } from '../../../SectionTableView';
import { createTable, SectionTableView } from '../../../SectionTableView';
import { SpecimenSurface } from '../../ParityGallery.shared.styles';
import { ParitySpecimen } from '../ParitySpecimen';

const NOTE =
  'טבלה בתוך סעיף, עם סרגל השורות והעמודות הצף וחלונות מאפייני התא והטבלה. ' +
  'בעמוד החי טבלאות נכתבות דרך העורך עצמו, ולכן זהו מסך נפרד. לחיצה על תא פותחת את הסרגל.';

const INITIAL_TABLE = createTable(3, 3);

export const TableViewSpecimen = () => {
  const [table, setTable] = useState<SectionTable | null>(INITIAL_TABLE);

  const handleDelete = () => setTable(null);
  const handleRestore = () => setTable(createTable(3, 3));

  return (
    <ParitySpecimen
      id="section-table"
      title="SectionTableView — טבלה בסעיף"
      source="Edit.tsx:901-1120 (ומאפיינים ב-785-898)"
      note={NOTE}
    >
      <SpecimenSurface>
        {table ? (
          <SectionTableView table={table} onChange={setTable} onDelete={handleDelete} />
        ) : (
          <Button type="button" variant="outline" size="sm" onClick={handleRestore}>
            הוספת טבלה מחדש
          </Button>
        )}
      </SpecimenSurface>
    </ParitySpecimen>
  );
};
