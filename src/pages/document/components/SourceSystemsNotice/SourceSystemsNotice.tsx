import { lazy, Suspense, useState } from 'react';
import { chunkGuard } from '../../../../utils/chunkRecovery';
import type { SourceOrigin } from '../../types';
import { NoticeLead, NoticeLink, NoticeRow } from './SourceSystemsNotice.styles';
import { SOURCE_SYSTEMS_NOTICE_IDS } from './SourceSystemsNotice.testids';

const SourceSystemsModal = lazy(
  chunkGuard(() =>
    import('../SourceSystemsModal').then((m) => ({ default: m.SourceSystemsModal })),
  ),
);

export interface SourceSystemsNoticeProps {
  systems: SourceOrigin[];
}

export const SourceSystemsNotice = ({ systems }: SourceSystemsNoticeProps) => {
  const [showModal, setShowModal] = useState(false);

  const handleOpen = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

  return (
    <NoticeRow dir="rtl" data-testid={SOURCE_SYSTEMS_NOTICE_IDS.root}>
      <span aria-hidden="true">⚠</span>
      <span>
        <NoticeLead>שים לב,</NoticeLead> מסמך זה נוצר ממערכת מקור
      </span>
      <NoticeLink
        type="button"
        data-testid={SOURCE_SYSTEMS_NOTICE_IDS.viewBtn}
        onClick={handleOpen}
      >
        לצפייה במערכות
      </NoticeLink>

      <Suspense fallback={null}>
        {showModal && <SourceSystemsModal systems={systems} scope="doc" onClose={handleClose} />}
      </Suspense>
    </NoticeRow>
  );
};
