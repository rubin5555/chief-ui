import { useState } from 'react';
import { DocToolbar } from '../../../DocToolbar';
import { ActionLog } from '../../ParityGallery.shared.styles';
import { PARITY_GALLERY_IDS } from '../../ParityGallery.testids';
import { ParitySpecimen } from '../ParitySpecimen';

const NOTE =
  'הסרגל המלא של main, על 45 מצבי העיצוב שלו — שאף אחד מהם אינו נכתב למסמך. בעמוד החי ' +
  'סרגל העריכה הוא של TinyMCE, שהוא זה שבאמת משנה תוכן. שלושת הכפתורים שיש להם משמעות ' +
  'ב-main מדווחים כאן במקום לשדר CustomEvent גלובלי.';

export const ToolbarSpecimen = () => {
  const [lastAction, setLastAction] = useState('טרם בוצעה פעולה');

  const handleInsertTable = (rows: number, cols: number) =>
    setLastAction(`הוספת טבלה ${rows} × ${cols}`);
  const handleInsertFootnote = () => setLastAction('הוספת הערת שוליים');
  const handleInsertDate = (value: string) => setLastAction(`הוספת תאריך ${value}`);

  return (
    <ParitySpecimen
      id="doc-toolbar"
      title="DocToolbar — סרגל העריכה"
      source="Edit.tsx:1122-1688"
      note={NOTE}
    >
      <DocToolbar
        onInsertTable={handleInsertTable}
        onInsertFootnote={handleInsertFootnote}
        onInsertDate={handleInsertDate}
      />
      <ActionLog data-testid={PARITY_GALLERY_IDS.lastAction('doc-toolbar')}>{lastAction}</ActionLog>
    </ParitySpecimen>
  );
};
