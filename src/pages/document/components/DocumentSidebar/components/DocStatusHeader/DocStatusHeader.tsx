import { DOC_STATUS_COLOR, DOC_STATUS_FALLBACK_COLOR } from '../../../../document.constants';
import { StatusInfoTip } from './components/StatusInfoTip';
import { STATUS_TIPS } from './DocStatusHeader.constants';
import { HeaderRow, StatusDot, StatusTitle } from './DocStatusHeader.styles';
import { DOC_STATUS_HEADER_IDS } from './DocStatusHeader.testids';

export interface DocStatusHeaderProps {
  status: string;
}

// The sidebar's first line: where this document is in its lifecycle (main,
// Edit.tsx:3796). The colour comes from the *document* status palette, which is
// not the section one — a section `בהכנה` and a document `בהכנה` are different
// colours in main, and DOC_STATUS_COLOR is the map that keeps them apart.
export const DocStatusHeader = ({ status }: DocStatusHeaderProps) => {
  const tip = STATUS_TIPS[status];

  return (
    <HeaderRow data-testid={DOC_STATUS_HEADER_IDS.root}>
      <StatusDot
        // Terminal statuses (`מבצעית` and friends) are absent from the map on
        // purpose and fall through to grey, exactly as main's `?? '#6b7280'` does.
        $color={DOC_STATUS_COLOR[status] ?? DOC_STATUS_FALLBACK_COLOR}
        data-testid={DOC_STATUS_HEADER_IDS.dot}
      />
      <StatusTitle data-testid={DOC_STATUS_HEADER_IDS.title}>מסמך {status}</StatusTitle>
      {tip && <StatusInfoTip text={tip} />}
    </HeaderRow>
  );
};
