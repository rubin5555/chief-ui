import { EXCEL_TAB_IDS } from '../../ExcelTab.testids';
import { ListCount, ListHeader, ListSection } from '../components.shared.styles';
import { FAILURE_LABELS } from './ExcelFailedList.constants';
import { FailedNumber, FailedReason, FailedRow, FailedScroll } from './ExcelFailedList.styles';

export type ExcelImportFailureReason = 'not-found' | 'invalid';

export interface ExcelImportFailure {
  idNumber: string;
  reason: ExcelImportFailureReason;
}

interface ExcelFailedListProps {
  failures: ExcelImportFailure[];
}

export const ExcelFailedList = ({ failures }: ExcelFailedListProps) => (
  <ListSection data-testid={EXCEL_TAB_IDS.failedList}>
    <ListHeader>
      לא יובאו
      <ListCount>({failures.length})</ListCount>
    </ListHeader>

    <FailedScroll>
      {failures.map((failure) => (
        <FailedRow key={failure.idNumber} data-testid={EXCEL_TAB_IDS.failedRow(failure.idNumber)}>
          <FailedNumber>{failure.idNumber}</FailedNumber>
          <FailedReason>{FAILURE_LABELS[failure.reason]}</FailedReason>
        </FailedRow>
      ))}
    </FailedScroll>
  </ListSection>
);
