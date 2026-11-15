import { BookOpen, ExternalLink, GraduationCap } from 'lucide-react';
import type { RefObject } from 'react';
import {
  PanelBody,
  PanelOption,
  PanelOptionLabel,
} from '@/components/layout/TopNavbar/TopNavPanel.styles';
import { FloatingPanel } from '@/components/ui/FloatingPanel';
import type { Pos } from '@/hooks/useFloatingPanel';
import { gray } from '@/styles/theme';
import { TRAINING_MENU_IDS } from '../../TrainingMenu.testids';

interface TrainingOptionsPanelProps {
  panelRef: RefObject<HTMLDivElement | null>;
  pos: Pos;
  width: number;
  onGuideClick: () => void;
  onCourseClick: () => void;
}

export const TrainingOptionsPanel = ({
  panelRef,
  pos,
  width,
  onGuideClick,
  onCourseClick,
}: TrainingOptionsPanelProps) => (
  <FloatingPanel ref={panelRef} data-testid={TRAINING_MENU_IDS.panel} pos={pos} width={width}>
    <PanelBody>
      <PanelOption type="button" data-testid={TRAINING_MENU_IDS.guideOption} onClick={onGuideClick}>
        <BookOpen size={16} color={gray[500]} />
        <PanelOptionLabel>הדרכה</PanelOptionLabel>
      </PanelOption>
      <PanelOption
        type="button"
        data-testid={TRAINING_MENU_IDS.courseOption}
        onClick={onCourseClick}
      >
        <GraduationCap size={16} color={gray[500]} />
        <PanelOptionLabel>לומדה</PanelOptionLabel>
        <ExternalLink size={14} color={gray[400]} />
      </PanelOption>
    </PanelBody>
  </FloatingPanel>
);
