import { useRef } from 'react';
import { usePageBreaks } from '../../../usePageBreaks';
import { ParitySpecimen } from '../ParitySpecimen';
import { PageBox, Paper, PaperFrame } from './PageBreaksSpecimen.styles';

const NOTE =
  'הזזת בלוקים שנחתכים בין עמוד לעמוד אל ראש העמוד הבא — דבר שאין דרך לבטא ב-CSS מחוץ ' +
  'להדפסה. ב-main זה רץ פעם אחת בטעינה בלבד, כך שכל הקלדה מוציאה אותו מסנכרון; כאן ' +
  'ResizeObserver מריץ אותו מחדש כשהתוכן גדל. הקווים המקווקווים עצמם הם CSS טהור.';

// Deliberately awkward heights: each block is a fraction of a page, so somewhere
// down the sheet one of them has to land on a break.
const BOX_HEIGHTS = [220, 340, 260, 300, 380, 240, 320];

export const PageBreaksSpecimen = () => {
  const paperRef = useRef<HTMLDivElement>(null);
  usePageBreaks(paperRef);

  return (
    <ParitySpecimen
      id="page-breaks"
      title="usePageBreaks — פריסה מחדש סביב שבירת עמוד"
      source="Edit.tsx:3599-3647"
      note={NOTE}
    >
      <PaperFrame>
        <Paper ref={paperRef} dir="rtl">
          {BOX_HEIGHTS.map((height, index) => (
            <PageBox key={height} $height={height} data-page-box>
              בלוק {index + 1}
            </PageBox>
          ))}
        </Paper>
      </PaperFrame>
    </ParitySpecimen>
  );
};
