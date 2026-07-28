import { useState } from 'react';
import { OutlineSectionItem } from '../../../OutlineSectionItem';
import { ActionLog, SpecimenStack, SpecimenSurface } from '../../ParityGallery.shared.styles';
import { PARITY_GALLERY_IDS } from '../../ParityGallery.testids';
import { ParitySpecimen } from '../ParitySpecimen';
import { DEMO_OUTLINE, DEMO_RENAME_NODE } from './OutlineItemSpecimen.constants';

const NOTE =
  'שורת העץ הרקורסיבית של main — שורה שמציירת את ילדיה בעצמה. בעמוד החי העץ בנוי משלושה ' +
  'רכיבים נפרדים, כי שלוש הרמות באמת שונות: רק הראשונה מקבלת גרירה מנושא אחר, רק השלישית ' +
  'ממוספרת באותיות, ולכל אחת תפריט אחר. השורה השנייה כאן במצב שינוי שם.';

export const OutlineItemSpecimen = () => {
  const [lastAction, setLastAction] = useState('טרם שונה שם');

  // An empty title is main's Escape signal — the row was abandoned, not renamed.
  const handleSave = (title: string) =>
    setLastAction(title ? `שם חדש: ${title}` : 'שינוי השם בוטל');

  return (
    <ParitySpecimen
      id="outline-item"
      title="OutlineSectionItem — שורת עץ רקורסיבית"
      source="Edit.tsx:2020-2070"
      note={NOTE}
    >
      <SpecimenStack>
        <SpecimenSurface>
          <OutlineSectionItem node={DEMO_OUTLINE} />
          <OutlineSectionItem node={DEMO_RENAME_NODE} isEditing onSave={handleSave} />
        </SpecimenSurface>
        <ActionLog data-testid={PARITY_GALLERY_IDS.lastAction('outline-item')}>
          {lastAction}
        </ActionLog>
      </SpecimenStack>
    </ParitySpecimen>
  );
};
