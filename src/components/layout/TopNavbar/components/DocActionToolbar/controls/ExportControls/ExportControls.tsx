import { useEffect, useRef, useState } from 'react';
import { EXPORT_SIMULATED_DELAY_MS } from '../../DocActionToolbar.constants';
import { PdfIcon, WordIcon } from '../../DocActionToolbar.icons';
import { DOC_ACTION_TOOLBAR_IDS } from '../../DocActionToolbar.testids';
import { ExportButton } from '../ExportButton';

export type ExportType = 'word' | 'pdf';

interface ExportControlsProps {
  onExportStart: (type: ExportType) => void;
}

export const ExportControls = ({ onExportStart }: ExportControlsProps) => {
  const [loadingExport, setLoadingExport] = useState<ExportType | null>(null);
  const exportTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    };
  }, []);

  const onExportClick = (type: ExportType) => () => {
    if (loadingExport) return;
    onExportStart(type);
    setLoadingExport(type);
    if (exportTimeoutRef.current) clearTimeout(exportTimeoutRef.current);
    exportTimeoutRef.current = setTimeout(() => {
      setLoadingExport(null);
      exportTimeoutRef.current = null;
    }, EXPORT_SIMULATED_DELAY_MS);
  };

  return (
    <>
      <ExportButton
        title="ייצוא ל-Word"
        testId={DOC_ACTION_TOOLBAR_IDS.exportWord}
        isLoading={loadingExport === 'word'}
        icon={<WordIcon />}
        onClick={onExportClick('word')}
      />
      <ExportButton
        title="ייצוא PDF"
        testId={DOC_ACTION_TOOLBAR_IDS.exportPdf}
        isLoading={loadingExport === 'pdf'}
        icon={<PdfIcon />}
        onClick={onExportClick('pdf')}
      />
    </>
  );
};
