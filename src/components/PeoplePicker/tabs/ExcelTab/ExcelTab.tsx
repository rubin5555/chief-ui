import { Plus } from 'lucide-react';
import { type ChangeEvent, useRef, useState } from 'react';
import { TabRoot } from '../tabs.shared.styles';
import { ExcelSheetPreview } from './components/ExcelSheetPreview';
import { ACCEPTED_FILE_TYPES } from './ExcelTab.constants';
import { HiddenFileInput, UploadBar, UploadBtn, UploadHint } from './ExcelTab.styles';
import { EXCEL_TAB_IDS } from './ExcelTab.testids';

const HINT = 'העלה קובץ .xlsx עם עמודה A בלבד ורשימת מספרים אישיים';

/**
 * The one source that isn't a directory: a spreadsheet of personal numbers the
 * user brings themselves.
 *
 * ponytail: the chosen file is acknowledged by name and then goes no further.
 * Turning it into members needs either an .xlsx parser (no dependency in this
 * repo) or an endpoint to hand it to (no resolver either) — and both of those
 * decide, on someone else's behalf, what a personal number that matches nobody
 * should do. So the pick is real and the import is not, rather than a reader
 * being quietly told it worked. main leaves its own `onChange` empty (
 * TopNavbar.tsx:765); this at least says out loud that the file arrived.
 */
export const ExcelTab = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const onPickFile = () => inputRef.current?.click();

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFileName(e.target.files?.[0]?.name ?? null);
    // Cleared so choosing the same file twice fires again — without this, a
    // second pick of an unchanged filename is silent.
    e.target.value = '';
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
        <UploadHint data-testid={EXCEL_TAB_IDS.hint}>{fileName ?? HINT}</UploadHint>
      </UploadBar>

      <ExcelSheetPreview />
    </TabRoot>
  );
};
