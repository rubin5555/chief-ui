import type { SignatureDto } from '@/api/signatures';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import { useFloatingPanel } from '@/hooks/useFloatingPanel';
import { APPROVAL_ROTATION_IDS } from '../../../../ApprovalRotation.testids';
import {
  SignatureActionBtn,
  SignatureActions,
  SignatureBox,
  SignatureLabel,
  SignatureSection,
} from './ApproverSignaturePicker.styles';

const PANEL_WIDTH = 160;

export interface ApproverSignaturePickerProps {
  signature: string | null;
  options: SignatureDto[];
  onPick: (name: string) => void;
  onClear: () => void;
}

export const ApproverSignaturePicker = ({
  signature,
  options,
  onPick,
  onClear,
}: ApproverSignaturePickerProps) => {
  const panel = useFloatingPanel<HTMLButtonElement>({ focusOnOpen: true });

  const handleToggle = () => panel.toggle(PANEL_WIDTH);
  const handlePick = (name: string) => () => {
    onPick(name);
    panel.close();
  };

  return (
    <SignatureSection>
      <SignatureLabel>חתימת המאשר</SignatureLabel>
      <SignatureBox>{signature ?? 'אין חתימה'}</SignatureBox>
      <SignatureActions>
        <SignatureActionBtn
          ref={panel.btnRef}
          type="button"
          onClick={handleToggle}
          data-testid={APPROVAL_ROTATION_IDS.signatureTrigger}
        >
          בחירת חתימה
        </SignatureActionBtn>
        <SignatureActionBtn
          type="button"
          onClick={onClear}
          data-testid={APPROVAL_ROTATION_IDS.clearSignatureBtn}
        >
          נקה חתימה
        </SignatureActionBtn>
        {panel.open && panel.pos && (
          <FloatingPanel ref={panel.panelRef} pos={panel.pos} width={PANEL_WIDTH}>
            {options.map((option) => (
              <SignatureActionBtn
                key={option.id}
                type="button"
                onClick={handlePick(option.name)}
                data-testid={APPROVAL_ROTATION_IDS.signatureOption(option.name)}
              >
                {option.name}
              </SignatureActionBtn>
            ))}
          </FloatingPanel>
        )}
      </SignatureActions>
    </SignatureSection>
  );
};
