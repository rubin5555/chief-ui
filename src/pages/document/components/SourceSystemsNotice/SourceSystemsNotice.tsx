import { lazy, Suspense, useState } from 'react';
import type { SourceOrigin } from '../../types';
import { NoticeLead, NoticeLink, NoticeRow } from './SourceSystemsNotice.styles';
import { SOURCE_SYSTEMS_NOTICE_IDS } from './SourceSystemsNotice.testids';

const SourceSystemsModal = lazy(() =>
  import('../SourceSystemsModal').then((m) => ({ default: m.SourceSystemsModal })),
);

export interface SourceSystemsNoticeProps {
  systems: SourceOrigin[];
}

// The amber line above the paper telling you the document was built from imported
// data (main, Edit.tsx:3710), and the modal listing what those systems were.
//
// Owns that modal because it is the only thing that opens it from here, per
// .claude/skills/modal-placement.md. A section's own source button opens the same
// modal with its own list — from the section, not through this component.
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
