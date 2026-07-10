import { Loader2 } from 'lucide-react';
import { Overlay, SpinIcon } from './ModalLoading.styles';

export const ModalLoading = () => (
  <Overlay>
    <SpinIcon>
      <Loader2 size={32} />
    </SpinIcon>
  </Overlay>
);
