import type { ChangeEvent } from 'react';
import { SIG_PLACEHOLDER } from '../../SignaturesSection.constants';
import { SignatureField } from './SignatureTextarea.styles';
import { SIGNATURE_TEXTAREA_IDS } from './SignatureTextarea.testids';

export interface SignatureTextareaProps {
  index: number;
  value: string;
  required: boolean;
  readOnly: boolean;
  onChange: (value: string) => void;
}

const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

export const SignatureTextarea = ({
  index,
  value,
  required,
  readOnly,
  onChange,
}: SignatureTextareaProps) => {
  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(event.target.value);
    fitToContent(event.currentTarget);
  };

  return (
    <SignatureField
      ref={fitToContent}
      $required={required}
      data-required={required}
      value={value}
      dir="rtl"
      readOnly={readOnly}
      placeholder={SIG_PLACEHOLDER}
      aria-label={`חתימה ${index + 1}`}
      aria-invalid={required}
      data-testid={SIGNATURE_TEXTAREA_IDS.field(index)}
      onChange={handleChange}
    />
  );
};
