import { DOC_STATUS_COLOR, DOC_STATUS_FALLBACK_COLOR } from '../../../../document.constants';
import { StatusInfoTip } from './components/StatusInfoTip';
import { STATUS_TIPS } from './DocStatusHeader.constants';
import { HeaderRow, StatusDot, StatusTitle } from './DocStatusHeader.styles';
import { DOC_STATUS_HEADER_IDS } from './DocStatusHeader.testids';

export interface DocStatusHeaderProps {
  status: string;
}

export const DocStatusHeader = ({ status }: DocStatusHeaderProps) => {
  const tip = STATUS_TIPS[status];

  return (
    <HeaderRow data-testid={DOC_STATUS_HEADER_IDS.root}>
      <StatusDot
        $color={DOC_STATUS_COLOR[status] ?? DOC_STATUS_FALLBACK_COLOR}
        data-testid={DOC_STATUS_HEADER_IDS.dot}
      />
      <StatusTitle data-testid={DOC_STATUS_HEADER_IDS.title}>מסמך {status}</StatusTitle>
      {tip && <StatusInfoTip text={tip} />}
    </HeaderRow>
  );
};
