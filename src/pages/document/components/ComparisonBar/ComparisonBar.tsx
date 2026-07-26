import { getRouteApi } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Bar, Label, NavBtn, ToggleBtn } from './ComparisonBar.styles';
import { COMPARISON_BAR_IDS } from './ComparisonBar.testids';

const routeApi = getRouteApi('/document/$id');

// UI-shell only, matching main's Edit.tsx exactly (no real diff algorithm is
// computed there either — its `comparisonTotal` was a hardcoded constant).
// The prev/next navigation is visibly disabled rather than wired to fake
// data, so this stays an honest placeholder rather than something that
// silently looks functional. Real version-diffing is a stated follow-up,
// not implemented in this phase.
export const ComparisonBar = () => {
  const { compare } = routeApi.useSearch();
  const navigate = routeApi.useNavigate();

  const handleToggle = () =>
    navigate({ search: (prev) => ({ ...prev, compare: !compare }), replace: true });

  if (!compare) {
    return (
      <ToggleBtn type="button" onClick={handleToggle} data-testid={COMPARISON_BAR_IDS.toggleBtn}>
        השוואת גרסאות
      </ToggleBtn>
    );
  }

  return (
    <Bar data-testid={COMPARISON_BAR_IDS.root}>
      <NavBtn type="button" disabled data-testid={COMPARISON_BAR_IDS.prevBtn}>
        <ChevronRight size={14} />
      </NavBtn>
      <Label>מצב השוואת גרסאות — טרם חושב הבדל בפועל</Label>
      <NavBtn type="button" disabled data-testid={COMPARISON_BAR_IDS.nextBtn}>
        <ChevronLeft size={14} />
      </NavBtn>
      <ToggleBtn type="button" onClick={handleToggle} data-testid={COMPARISON_BAR_IDS.toggleBtn}>
        סגירה
      </ToggleBtn>
    </Bar>
  );
};
