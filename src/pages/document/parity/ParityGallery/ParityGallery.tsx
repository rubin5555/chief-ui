import { HistorySpecimen } from './components/HistorySpecimen';
import { OutlineItemSpecimen } from './components/OutlineItemSpecimen';
import { PageBreaksSpecimen } from './components/PageBreaksSpecimen';
import { TableViewSpecimen } from './components/TableViewSpecimen';
import { ViduyKabalahSpecimen } from './components/ViduyKabalahSpecimen';
import { GalleryHeader, GalleryIntro, GalleryRoot, GalleryTitle } from './ParityGallery.styles';
import { PARITY_GALLERY_IDS } from './ParityGallery.testids';

const INTRO =
  'חמשת הרכיבים שהועברו מ-Edit.tsx אך אינם חלק מהעמוד החי. כולם נבנו מחדש לפי אותן ' +
  'המוסכמות כמו שאר העמוד — styled-components, טוקנים במקום צבעים קשיחים, רכיב אחד לקובץ — ' +
  'ואף אחד מהם אינו מיובא לשום מקום מלבד המסך הזה. ההסבר המלא נמצא ב-parity/README.md.';

// The inspection route's whole page. Nothing else in the feature imports it, and
// it imports nothing from the live page beyond ui primitives and the shared
// measurements — so the parked components can be looked at without being shipped.
export const ParityGallery = () => (
  <GalleryRoot dir="rtl" data-testid={PARITY_GALLERY_IDS.root}>
    <GalleryHeader>
      <GalleryTitle>רכיבים שהועברו — Edit.tsx</GalleryTitle>
      <GalleryIntro>{INTRO}</GalleryIntro>
    </GalleryHeader>

    <TableViewSpecimen />
    <ViduyKabalahSpecimen />
    <HistorySpecimen />
    <OutlineItemSpecimen />
    <PageBreaksSpecimen />
  </GalleryRoot>
);
