import type { ChangeEvent } from 'react';
import { SIG_PLACEHOLDER } from '../../SignaturesSection.constants';
import { SignatureField } from './SignatureTextarea.styles';
import { SIGNATURE_TEXTAREA_IDS } from './SignatureTextarea.testids';

export interface SignatureTextareaProps {
  index: number;
  value: string;
  /** Marks the field as the one the approval flow is waiting on. */
  required: boolean;
  readOnly: boolean;
  onChange: (value: string) => void;
}

/** Height is cleared before measuring, or a shrinking block keeps the height it grew to. */
const fitToContent = (element: HTMLTextAreaElement | null) => {
  if (!element) return;
  element.style.height = 'auto';
  element.style.height = `${element.scrollHeight}px`;
};

// One signature block (main, Edit.tsx:4311).
//
// Grows with its content instead of scrolling: this is printed matter, and a
// scrollbar inside a sheet of paper would hide half of what was signed.
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
      // Sizes to a template that was just dropped in, then keeps up from
      // onChange — both direct writes from an event rather than an effect.
      ref={fitToContent}
      $required={required}
      // Read back by the focus rule in the styles, which must not override the
      // warning border while this is the field being asked for.
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
