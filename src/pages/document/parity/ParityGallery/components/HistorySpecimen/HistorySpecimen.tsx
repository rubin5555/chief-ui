import type { ChangeEvent } from 'react';
import { useState } from 'react';
import { DocumentHistory, useContentHistory } from '../../../DocumentHistory';
import { SpecimenStack } from '../../ParityGallery.shared.styles';
import { ParitySpecimen } from '../ParitySpecimen';
import { DraftField } from './HistorySpecimen.styles';

const NODE_ID = 'parity-history-demo';

const NOTE =
  'מחסניות ביטול/ביצוע-מחדש לכל סעיף. ב-main הן קיימות במלואן אך אף רכיב אינו קורא להן — ' +
  'אין כפתור ביטול, אין כפתור ביצוע מחדש ואין חלון שמירת גרסה. הכפתורים כאן הם ההשלמה החסרה. ' +
  'עזיבת השדה (blur) היא מה שמוסיף גרסה, כמו כל שדה תוכן בעמוד החי.';

export const HistorySpecimen = () => {
  const history = useContentHistory();
  const [content, setContent] = useState('');

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => setContent(event.target.value);

  // Committing on blur rather than per keystroke, or every letter becomes a
  // version and "undo" means "delete one character".
  const handleBlur = () => history.push(NODE_ID, content);

  return (
    <ParitySpecimen
      id="document-history"
      title="DocumentHistory — היסטוריית תוכן"
      source="Edit.tsx:3208, 3337-3391"
      note={NOTE}
    >
      <SpecimenStack>
        <DraftField
          rows={4}
          value={content}
          placeholder="כתוב משהו, צא מהשדה, ואז בטל..."
          aria-label="תוכן לדוגמה"
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <DocumentHistory nodeId={NODE_ID} history={history} onRestore={setContent} />
      </SpecimenStack>
    </ParitySpecimen>
  );
};
