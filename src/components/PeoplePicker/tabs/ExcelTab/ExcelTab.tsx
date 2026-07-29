import { Plus } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { useUserSearch } from '@/api/users';
import { InlineSpinner } from '@/components/ui/InlineSpinner';
import { parseXlsxColumn } from '@/utils/parseXlsx';
import type { Member } from '../../PeoplePicker.constants';
import { TabImportBar } from '../components/TabImportBar';
import { EmptyState, TabRoot } from '../tabs.shared.styles';
import type { ExcelImportFailure } from './components/ExcelFailedList';
import { ExcelFailedList } from './components/ExcelFailedList';
import { ExcelFoundList } from './components/ExcelFoundList';
import { ExcelSheetPreview } from './components/ExcelSheetPreview';
import { ACCEPTED_FILE_TYPES, ID_COLUMN, isPersonalNumber } from './ExcelTab.constants';
import {
  FileNameLabel,
  HiddenFileInput,
  UploadBar,
  UploadBtn,
  UploadHint,
} from './ExcelTab.styles';
import { EXCEL_TAB_IDS } from './ExcelTab.testids';

const HINT = 'העלה קובץ .xlsx עם עמודה A בלבד ורשימת מספרים אישיים';
const PARSE_FAILED = 'לא ניתן לקרוא את הקובץ. יש להעלות קובץ .xlsx תקין.';

interface ExcelTabProps {
  /** Personal numbers already imported from a sheet, so their rows grey out. */
  addedIdNumbers: Set<string>;
  onImport: (members: Member[], idNumbers: string[]) => void;
}

/**
 * The one source that isn't a directory: a spreadsheet of personal numbers the
 * user brings themselves. Until a file is chosen it shows what the file should
 * look like; after, it shows who was found in it and which cells produced
 * nobody, and adds the first list on a word from the user rather than on the
 * upload itself.
 *
 * The sheet is read here, in the browser, and only the numbers leave — the file
 * itself never goes anywhere. Those numbers are then a `useUserSearch` away from
 * being people, which is a question only the directory can answer.
 */
export const ExcelTab = ({ addedIdNumbers, onImport }: ExcelTabProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [cellValues, setCellValues] = useState<string[]>([]);
  const [parseFailed, setParseFailed] = useState(false);
  // Tracked as exclusions, not selections: everyone found in the file is on
  // their way in unless the user says otherwise, which is the useful default for
  // a sheet of two hundred numbers. Written this way it also needs no effect to
  // seed itself once the search answers.
  const [excludedIdNumbers, setExcludedIdNumbers] = useState<Set<string>>(new Set());

  const askedFor = cellValues.filter(isPersonalNumber);
  const { data, loading } = useUserSearch({ idNumbers: askedFor });
  const found = data ?? [];

  const foundIdNumbers = new Set(found.map((person) => person.idNumber));
  const failed: ExcelImportFailure[] = cellValues.map((value) => ({
    idNumber: value,
    reason: isPersonalNumber(value) ? 'not-found' : 'invalid',
  }));
  const unresolved = failed.filter((failure) => !foundIdNumbers.has(failure.idNumber));

  const picked = found.filter(
    (person) => !addedIdNumbers.has(person.idNumber) && !excludedIdNumbers.has(person.idNumber),
  );

  const onPickFile = () => inputRef.current?.click();

  const onFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // Cleared straight away so choosing the same file twice fires again —
    // without this, a second pick of an unchanged filename is silent.
    e.target.value = '';
    if (!file) return;

    setFileName(file.name);
    setExcludedIdNumbers(new Set());
    setCellValues([]);
    setParseFailed(false);

    try {
      setCellValues(await parseXlsxColumn(file, ID_COLUMN));
    } catch {
      // The reason is always the same thing to do about it — hand over a real
      // .xlsx — so it is one message rather than the parser's own vocabulary.
      setParseFailed(true);
    }
  };

  const onToggle = (idNumber: string) =>
    setExcludedIdNumbers((prev) => {
      const next = new Set(prev);
      next.has(idNumber) ? next.delete(idNumber) : next.add(idNumber);
      return next;
    });

  const onImportPicked = () => {
    const members: Member[] = picked.map((person) => ({
      id: `xls-${person.idNumber}`,
      name: person.name,
      idNumber: person.idNumber,
      environment: person.environment,
    }));
    onImport(
      members,
      picked.map((person) => person.idNumber),
    );
  };

  return (
    <TabRoot>
      <UploadBar>
        <HiddenFileInput
          ref={inputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          data-testid={EXCEL_TAB_IDS.fileInput}
          onChange={onFileChange}
        />
        <UploadBtn type="button" data-testid={EXCEL_TAB_IDS.uploadBtn} onClick={onPickFile}>
          <Plus size={14} />
          ייבוא מאקסל
        </UploadBtn>
        {fileName === null ? (
          <UploadHint data-testid={EXCEL_TAB_IDS.hint}>{HINT}</UploadHint>
        ) : (
          <FileNameLabel data-testid={EXCEL_TAB_IDS.hint}>{fileName}</FileNameLabel>
        )}
      </UploadBar>

      {fileName === null && <ExcelSheetPreview />}
      {parseFailed && (
        <EmptyState data-testid={EXCEL_TAB_IDS.parseError}>{PARSE_FAILED}</EmptyState>
      )}
      {fileName !== null && !parseFailed && loading && <InlineSpinner />}
      {fileName !== null && !parseFailed && !loading && (
        <>
          <ExcelFoundList
            people={found}
            addedIdNumbers={addedIdNumbers}
            excludedIdNumbers={excludedIdNumbers}
            onToggle={onToggle}
          />
          {unresolved.length > 0 && <ExcelFailedList failures={unresolved} />}
        </>
      )}

      <TabImportBar
        count={picked.length}
        noun="משתמשים"
        data-testid={EXCEL_TAB_IDS.importBtn}
        onImport={onImportPicked}
      />
    </TabRoot>
  );
};
