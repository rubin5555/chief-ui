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
  /** Where this came from, e.g. `Edit.tsx:1122-1688`. */
  source: string;
  /** Why it isn't in the live page. */
  note: string;
  children: ReactNode;
}

// One labelled entry in the gallery. The label matters as much as the component:
// a parked component with no explanation beside it is just dead code.
export const ParitySpecimen = ({ id, title, source, note, children }: ParitySpecimenProps) => (
  <SpecimenRoot data-testid={PARITY_GALLERY_IDS.specimen(id)}>
    <SpecimenTitle>{title}</SpecimenTitle>
    <SpecimenSource>{source}</SpecimenSource>
    <SpecimenNote>{note}</SpecimenNote>
    <SpecimenStage>{children}</SpecimenStage>
  </SpecimenRoot>
);
