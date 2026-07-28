import { colors, docColors } from '@/styles/theme';
import type { ApproverSignature } from '../../../../SignatureGateContext';
import { StampArea, StampCaption, StampMark, StampRing, StampRoot } from './ApproverStamp.styles';
import { APPROVER_STAMP_IDS } from './ApproverStamp.testids';

export interface ApproverStampProps {
  signature: ApproverSignature;
}

// One approver's mark: a dashed ring reading אושר with their name inside it, and —
// when they picked a signature to go with the approval — a handwritten squiggle
// over the top (main, Edit.tsx:4332).
//
// Both are hand-drawn SVG rather than a font or an image: the ring's text has to
// sit on two centred baselines inside a circle, and the squiggle is a pair of
// bezier paths whose whole job is to look like ink. Serif on the ring is main's,
// and it is what makes it read as a stamp rather than as a badge.
export const ApproverStamp = ({ signature }: ApproverStampProps) => (
  <StampRoot data-testid={APPROVER_STAMP_IDS.root(signature.name)}>
    <StampArea>
      <StampRing width="100" height="100" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <circle
          cx="50"
          cy="50"
          r="46"
          stroke={colors.primary}
          strokeWidth="2.5"
          strokeDasharray="5 2"
        />
        <circle cx="50" cy="50" r="38" stroke={colors.primary} strokeWidth="1.5" />
        <text
          x="50"
          y="46"
          textAnchor="middle"
          fontSize="11"
          fontWeight="700"
          fill={colors.primary}
          fontFamily="serif"
        >
          אושר
        </text>
        <text
          x="50"
          y="60"
          textAnchor="middle"
          fontSize="9"
          fill={colors.primary}
          fontFamily="serif"
        >
          {signature.name}
        </text>
      </StampRing>

      {signature.hasSignature && (
        <StampMark
          width="80"
          height="36"
          viewBox="0 0 80 36"
          fill="none"
          aria-hidden="true"
          data-testid={APPROVER_STAMP_IDS.mark(signature.name)}
        >
          <path
            d="M6 26 Q16 8 26 18 Q36 28 46 12 Q56 2 66 16 Q74 26 78 10"
            stroke={docColors.stampInk}
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {/* The faint second stroke is the underline a signature trails; at 0.3
              it reads as pen pressure rather than as a second line. */}
          <path
            d="M10 30 Q30 24 50 28 Q66 32 76 24"
            stroke={docColors.stampInk}
            strokeWidth="0.9"
            strokeLinecap="round"
            fill="none"
            opacity="0.3"
          />
        </StampMark>
      )}
    </StampArea>

    <StampCaption>
      {signature.rank} — {signature.name}
    </StampCaption>
  </StampRoot>
);
