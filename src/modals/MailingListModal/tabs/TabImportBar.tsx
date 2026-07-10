import { Button } from '@/components/ui/Button';
import { ImportBar, ImportBarLabel } from './tabs.shared.styles';

interface TabImportBarProps {
  count: number;
  /** Plural noun for the selection label, e.g. 'קבוצות' → "3 קבוצות נבחרו". */
  noun: string;
  'data-testid': string;
  onImport: () => void;
}

export const TabImportBar = ({
  count,
  noun,
  'data-testid': testId,
  onImport,
}: TabImportBarProps) => {
  if (count === 0) return null;
  return (
    <ImportBar>
      <ImportBarLabel>
        {count} {noun} נבחרו
      </ImportBarLabel>
      <Button type="button" size="xs" data-testid={testId} onClick={onImport}>
        הוסף לרשימה
      </Button>
    </ImportBar>
  );
};
