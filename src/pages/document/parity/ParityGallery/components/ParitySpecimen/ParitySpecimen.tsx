import type { ReactNode } from 'react';
import { PARITY_GALLERY_IDS } from '../../ParityGallery.testids';
import {
  SpecimenNote,
  SpecimenRoot,
  SpecimenSource,
  SpecimenStage,
  SpecimenTitle,
} from './ParitySpecimen.styles';

export interface ParitySpecimenProps {
  id: string;
  title: string;
  source: string;
  note: string;
  children: ReactNode;
}

export const ParitySpecimen = ({ id, title, source, note, children }: ParitySpecimenProps) => (
  <SpecimenRoot data-testid={PARITY_GALLERY_IDS.specimen(id)}>
    <SpecimenTitle>{title}</SpecimenTitle>
    <SpecimenSource>{source}</SpecimenSource>
    <SpecimenNote>{note}</SpecimenNote>
    <SpecimenStage>{children}</SpecimenStage>
  </SpecimenRoot>
);
