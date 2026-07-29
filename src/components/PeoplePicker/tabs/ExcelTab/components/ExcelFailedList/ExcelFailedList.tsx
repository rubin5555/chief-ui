import { EXCEL_TAB_IDS } from '../../ExcelTab.testids';
import { ListCount, ListHeader, ListSection } from '../components.shared.styles';
import { FAILURE_LABELS } from './ExcelFailedList.constants';
import { FailedNumber, FailedReason, FailedRow, FailedScroll } from './ExcelFailedList.styles';

/**
 * Why a cell in the column produced nobody. `invalid` is decided here, before
 * anything is sent — a value that can't be a personal number needn't be asked
 * about; `not-found` is read off the gap in what the server answered.
 */
export type ExcelImportFailureReason = 'not-found' | 'invalid';

export interface ExcelImportFailure {
  /** The cell's value exactly as it was written, valid or not. */
  idNumber: string;
  reason: ExcelImportFailureReason;
}

interface ExcelFailedListProps {
  failures: ExcelImportFailure[];
}

/**
 * The cells that produced nobody, and why. Shown rather than dropped: a sheet of
 * two hundred numbers where three resolve to no one is exactly the thing you
 * want to know before adding the other hundred and ninety-seven — and the value
 * is printed as written, since a typo is only findable in the file by its own
 * text.
 */
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
