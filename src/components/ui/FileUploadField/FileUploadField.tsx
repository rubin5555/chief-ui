import { Plus, X } from 'lucide-react';
import { type ChangeEvent, type DragEvent, type MouseEvent, useState } from 'react';
import {
  FileNameHint,
  HiddenFileInput,
  PreviewRemoveBtn,
  PreviewThumb,
  PreviewWrapper,
  UploadArea,
  UploadHint,
  UploadIconCircle,
  UploadRemoveBtn,
  UploadRow,
  UploadText,
  Wrapper,
} from './FileUploadField.styles';
import { FILE_UPLOAD_FIELD_IDS } from './FileUploadField.testids';

interface FileUploadFieldProps {
  previewUrl?: string | null;
  valueLabel?: string;
  label?: string;
  dragLabel?: string;
  replaceLabel?: string;
  hint?: string;
  accept?: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
  id?: string;
  'data-testid'?: string;
  removeTestId?: string;
}

const fileMatchesAccept = (file: File, accept: string) =>
  accept.split(',').some((pattern) => {
    const trimmed = pattern.trim();
    if (trimmed === '' || trimmed === '*/*') return true;
    if (trimmed.endsWith('/*')) return file.type.startsWith(trimmed.slice(0, -1));
    return file.type === trimmed;
  });

export const FileUploadField = ({
  previewUrl,
  valueLabel,
  label = 'העלאת תמונה',
  dragLabel = 'שחרר כאן להעלאה',
  replaceLabel = 'לחץ להחלפה',
  hint = 'PNG, JPG עד 2MB',
  accept = 'image/*',
  onFileSelect,
  onClear,
  id,
  'data-testid': testId,
  removeTestId,
}: FileUploadFieldProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputTestId = testId ?? FILE_UPLOAD_FIELD_IDS.root;
  const hasValue = Boolean(previewUrl) || Boolean(valueLabel);

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const onDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const onDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };
  const onDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && fileMatchesAccept(file, accept)) onFileSelect(file);
  };

  const onPreviewRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onClear();
  };

  return (
    <Wrapper>
      <UploadRow>
        <UploadArea
          $isDragging={isDragging}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          {previewUrl ? (
            <PreviewWrapper>
              <PreviewThumb src={previewUrl} alt="" />
              <PreviewRemoveBtn
                type="button"
                data-testid={removeTestId ?? FILE_UPLOAD_FIELD_IDS.removeBtn}
                onClick={onPreviewRemoveClick}
              >
                <X size={14} />
              </PreviewRemoveBtn>
            </PreviewWrapper>
          ) : (
            <UploadIconCircle>
              <Plus size={16} />
            </UploadIconCircle>
          )}
          <UploadText>{isDragging ? dragLabel : previewUrl ? replaceLabel : label}</UploadText>
          {!previewUrl && <UploadHint>{hint}</UploadHint>}
          <HiddenFileInput
            id={id}
            data-testid={inputTestId}
            type="file"
            accept={accept}
            onChange={onFileChange}
          />
        </UploadArea>
        {!previewUrl && hasValue && (
          <UploadRemoveBtn
            type="button"
            data-testid={removeTestId ?? FILE_UPLOAD_FIELD_IDS.removeBtn}
            onClick={onClear}
          >
            <X size={16} />
          </UploadRemoveBtn>
        )}
      </UploadRow>
      {hasValue && valueLabel && <FileNameHint>{valueLabel}</FileNameHint>}
    </Wrapper>
  );
};
