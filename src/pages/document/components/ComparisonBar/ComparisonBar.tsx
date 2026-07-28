import { getRouteApi } from '@tanstack/react-router';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import {
  Bar,
  CompareTriggerBtn,
  Controls,
  Divider,
  IconBtn,
  NavCounter,
  NavGroup,
  TogglePill,
  VersionLabel,
} from './ComparisonBar.styles';
import { COMPARISON_BAR_IDS } from './ComparisonBar.testids';

const VersionPickerModal = lazy(() =>
  import('./components/VersionPickerModal').then((m) => ({ default: m.VersionPickerModal })),
);

const routeApi = getRouteApi('/document/$id');

/**
 * How many differences there are to walk between.
 *
 * Zero, because nothing computes a diff — not here and not in main, whose
 * `comparisonTotal` is the literal `3` (Edit.tsx:3512). The counter shows the truth
 * rather than main's constant, and the chevrons are disabled to match it. When a
 * diff engine exists, this is the line that changes.
 */
const DIFFERENCE_COUNT = 0;

// main's version-comparison bar (Edit.tsx:3731), and the picker that turns it on.
//
// Which version is being compared against lives in the URL, so a comparison is
// bookmarkable and survives a reload. The two view toggles don't: they are how you
// are looking at the comparison rather than what you are comparing
// (.claude/skills/router-state-splitting.md).
export const ComparisonBar = () => {
  const { id } = routeApi.useParams();
  const { compareVersion } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const [showPicker, setShowPicker] = useState(false);
  const [hideDeleted, setHideDeleted] = useState(false);
  const [showHighlight, setShowHighlight] = useState(false);
  const [navIndex, setNavIndex] = useState(1);

  const handleOpenPicker = () => setShowPicker(true);
  const handleClosePicker = () => setShowPicker(false);

  const handlePickVersion = (label: string) =>
    navigate({ search: (prev) => ({ ...prev, compareVersion: label }), replace: true });

  const handleClose = () =>
    navigate({ search: (prev) => ({ ...prev, compareVersion: '' }), replace: true });

  const handleToggleHideDeleted = () => setHideDeleted((prev) => !prev);
  const handleToggleHighlight = () => setShowHighlight((prev) => !prev);
  const handlePrev = () => setNavIndex((prev) => Math.max(1, prev - 1));
  const handleNext = () => setNavIndex((prev) => Math.min(DIFFERENCE_COUNT, prev + 1));

  // No version picked means no comparison. The bar's own absence says so, and the
  // button standing in its place is how you start one — which is a step main takes
  // in the navbar instead, from a control this page doesn't have.
  if (!compareVersion) {
    return (
      <>
        <CompareTriggerBtn
          type="button"
          data-testid={COMPARISON_BAR_IDS.triggerBtn}
          onClick={handleOpenPicker}
        >
          השוואת גרסאות
        </CompareTriggerBtn>

        <Suspense fallback={null}>
          {showPicker && (
            <VersionPickerModal docId={id} onPick={handlePickVersion} onClose={handleClosePicker} />
          )}
        </Suspense>
      </>
    );
  }

  return (
    <Bar dir="rtl" data-testid={COMPARISON_BAR_IDS.root}>
      <VersionLabel data-testid={COMPARISON_BAR_IDS.versionLabel}>
        השוואה ל{compareVersion} בסטטוס מבצעית
      </VersionLabel>

      <Controls>
        <TogglePill
          type="button"
          $active={hideDeleted}
          aria-pressed={hideDeleted}
          data-testid={COMPARISON_BAR_IDS.hideDeletedToggle}
          onClick={handleToggleHideDeleted}
        >
          הסתרת תוכן מחוק
        </TogglePill>
        <TogglePill
          type="button"
          $active={showHighlight}
          aria-pressed={showHighlight}
          data-testid={COMPARISON_BAR_IDS.showHighlightToggle}
          onClick={handleToggleHighlight}
        >
          הצגת מרקור טקסט
        </TogglePill>

        <Divider />

        <NavGroup dir="ltr">
          <IconBtn
            type="button"
            disabled={DIFFERENCE_COUNT === 0 || navIndex === 1}
            aria-label="ההבדל הקודם"
            data-testid={COMPARISON_BAR_IDS.prevBtn}
            onClick={handlePrev}
          >
            <ChevronUp size={14} aria-hidden="true" />
          </IconBtn>
          <NavCounter data-testid={COMPARISON_BAR_IDS.navCounter}>
            {DIFFERENCE_COUNT === 0 ? 0 : navIndex}/{DIFFERENCE_COUNT}
          </NavCounter>
          <IconBtn
            type="button"
            disabled={navIndex >= DIFFERENCE_COUNT}
            aria-label="ההבדל הבא"
            data-testid={COMPARISON_BAR_IDS.nextBtn}
            onClick={handleNext}
          >
            <ChevronDown size={14} aria-hidden="true" />
          </IconBtn>
        </NavGroup>

        <Divider />

        <IconBtn
          type="button"
          aria-label="סגירת השוואת גרסאות"
          data-testid={COMPARISON_BAR_IDS.closeBtn}
          onClick={handleClose}
        >
          <X size={14} aria-hidden="true" />
        </IconBtn>
      </Controls>
    </Bar>
  );
};
