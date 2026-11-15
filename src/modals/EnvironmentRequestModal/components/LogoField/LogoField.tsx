import { memo } from 'react';
import { FileUploadField } from '@/components/ui/FileUploadField';
import { ENV_REQUEST_MODAL_IDS } from '../../EnvironmentRequestModal.testids';
import { FieldGroup, FieldLabel } from '../components.shared.styles';

interface LogoFieldProps {
  previewUrl: string;
  onFileSelect: (file: File) => void;
  onClear: () => void;
}

const LogoFieldComponent = ({ previewUrl, onFileSelect, onClear }: LogoFieldProps) => (
  <FieldGroup>
    <FieldLabel>תמונת סביבה</FieldLabel>
    <FileUploadField
      data-testid={ENV_REQUEST_MODAL_IDS.logoUpload}
      removeTestId={ENV_REQUEST_MODAL_IDS.logoRemove}
      previewUrl={previewUrl || null}
      onFileSelect={onFileSelect}
      onClear={onClear}
    />
  </FieldGroup>
);

export const LogoField = memo(LogoFieldComponent);
