import { X } from 'lucide-react';
import type { MouseEvent } from 'react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ContentEditor } from '@/components/ui/ContentEditor';
import { FileUploadField } from '@/components/ui/FileUploadField';
import type { SignatureType } from '@/pages/profile/components/tabs/SignaturesPanel';
import { SignatureTypeControl } from './components/SignatureTypeControl';
import { useSignatureModalAnalytics } from './SignatureModal.analytics';
import type { SignatureModalMode } from './SignatureModal.constants';
import { SIGNATURE_TYPE_OPTIONS } from './SignatureModal.constants';
import {
  CloseBtn,
  EditorSection,
  ModalBody,
  ModalCard,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  Overlay,
  TypeSection,
  UploadSection,
} from './SignatureModal.styles';
import { SIGNATURE_MODAL_IDS } from './SignatureModal.testids';

interface SignatureModalProps {
  mode?: SignatureModalMode;
  initialType?: SignatureType | null;
  onClose: () => void;
  onSave: (type: SignatureType, body: string) => void;
}

const MODAL_TITLES: Record<SignatureModalMode, string> = {
  new: 'חתימה חדשה',
  edit: 'עריכת חתימה',
  duplicate: 'שכפול חתימה',
};

const SAVE_LABELS: Record<SignatureModalMode, string> = {
  new: 'שמור חתימה',
  edit: 'שמור שינויים',
  duplicate: 'שכפל',
};

const DEFAULT_TYPE: SignatureType = 'distribution';

export const SignatureModal = ({
  mode = 'new',
  initialType = null,
  onClose,
  onSave,
}: SignatureModalProps) => {
  const [type, setType] = useState<SignatureType>(initialType ?? DEFAULT_TYPE);
  const [body, setBody] = useState('');
  const [imageName, setImageName] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);

  const { trackModalOpened, trackTypeChanged, trackSaveClicked, trackCancelled } =
    useSignatureModalAnalytics();

  useEffect(() => {
    trackModalOpened(mode);
  }, []);

  const handleClose = () => {
    trackCancelled(mode);
    onClose();
  };

  const onOverlayClick = () => handleClose();
  const onCardClick = (e: MouseEvent) => e.stopPropagation();

  const handleTypeChange = (nextType: SignatureType) => {
    setType(nextType);
    setDirty(true);
    trackTypeChanged(nextType);
  };

  const onBodyChange = (value: string) => {
    setBody(value);
    setDirty(true);
  };

  const onImageSelect = (file: File) => {
    setImageName(file.name);
    setDirty(true);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  const onImageClear = () => {
    setImageName(null);
    setImagePreview(null);
    setDirty(true);
  };

  const isDisabled = mode === 'edit' && !dirty;

  const onSaveClick = () => {
    if (isDisabled) return;
    trackSaveClicked(mode, type);
    onSave(type, body);
    onClose();
  };

  return (
    <Overlay data-testid={SIGNATURE_MODAL_IDS.overlay} onClick={onOverlayClick}>
      <ModalCard data-testid={SIGNATURE_MODAL_IDS.root} onClick={onCardClick} dir="rtl">
        <ModalHeader data-testid={SIGNATURE_MODAL_IDS.header}>
          <ModalTitle>{MODAL_TITLES[mode]}</ModalTitle>
          <CloseBtn type="button" data-testid={SIGNATURE_MODAL_IDS.closeBtn} onClick={handleClose}>
            <X size={20} />
          </CloseBtn>
        </ModalHeader>

        <ModalBody data-testid={SIGNATURE_MODAL_IDS.body}>
          <TypeSection data-testid={SIGNATURE_MODAL_IDS.typeControl}>
            <SignatureTypeControl
              options={SIGNATURE_TYPE_OPTIONS}
              activeId={type}
              onChange={handleTypeChange}
            />
          </TypeSection>

          <EditorSection data-testid={SIGNATURE_MODAL_IDS.editor}>
            <ContentEditor
              id="signature-body"
              value={body}
              onChange={onBodyChange}
              placeholder="הזן את תוכן החתימה..."
              minHeight={160}
            />
          </EditorSection>

          <UploadSection>
            <FileUploadField
              id="signature-upload"
              data-testid={SIGNATURE_MODAL_IDS.uploadInput}
              removeTestId={SIGNATURE_MODAL_IDS.uploadRemove}
              previewUrl={imagePreview}
              valueLabel={imageName ?? undefined}
              label="העלאת תמונת חתימה"
              onFileSelect={onImageSelect}
              onClear={onImageClear}
            />
          </UploadSection>
        </ModalBody>

        <ModalFooter data-testid={SIGNATURE_MODAL_IDS.footer}>
          <Button
            type="button"
            variant="secondary"
            size="lg"
            data-testid={SIGNATURE_MODAL_IDS.cancelBtn}
            onClick={handleClose}
          >
            ביטול
          </Button>
          <Button
            type="button"
            size="lg"
            data-testid={SIGNATURE_MODAL_IDS.saveBtn}
            disabled={isDisabled}
            onClick={onSaveClick}
          >
            {SAVE_LABELS[mode]}
          </Button>
        </ModalFooter>
      </ModalCard>
    </Overlay>
  );
};
