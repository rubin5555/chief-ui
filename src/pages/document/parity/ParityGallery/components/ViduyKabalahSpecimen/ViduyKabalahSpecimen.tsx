import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import type { ViduyKabalahDetails } from '../../../ViduyKabalahModal';
import { ViduyKabalahModal } from '../../../ViduyKabalahModal';
import { ActionLog } from '../../ParityGallery.shared.styles';
import { PARITY_GALLERY_IDS } from '../../ParityGallery.testids';
import { ParitySpecimen } from '../ParitySpecimen';

const NOTE =
  'ב-main אין שום מקום שפותח את החלון הזה — הקריאה שמדליקה אותו לא קיימת בקובץ. ' +
  'בעמוד החי אותו תפקיד ממולא על ידי "אישור קבלה (חמ״ל)", שאליו אפשר להגיע.';

export const ViduyKabalahSpecimen = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [lastAction, setLastAction] = useState('טרם נשלח');

  const handleOpen = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  const handleSend = ({ approvedBy, date, notes }: ViduyKabalahDetails) => {
    const filled = [approvedBy && 'מאשר', date && 'תאריך', notes && 'הערות'].filter(Boolean);
    setLastAction(filled.length ? `נשלח עם: ${filled.join(', ')}` : 'נשלח ריק');
  };

  return (
    <ParitySpecimen
      id="viduy-kabalah"
      title="ViduyKabalahModal — וידוא קבלה (חמ״ל)"
      source="Edit.tsx:2546-2622"
      note={NOTE}
    >
      <Button type="button" variant="outline" size="sm" onClick={handleOpen}>
        פתיחת החלון
      </Button>
      <ActionLog data-testid={PARITY_GALLERY_IDS.lastAction('viduy-kabalah')}>
        {lastAction}
      </ActionLog>

      {isOpen && <ViduyKabalahModal onSend={handleSend} onClose={handleClose} />}
    </ParitySpecimen>
  );
};
