# Skill: Router-Backed State & Code Splitting

## Filters, Tabs & Search State Live in the URL

- **Never back visible filter/tab state with local `useState`.** Anything that changes what's rendered — active tab, sub-tab, search text, dropdown filters — must live in the route's search params via TanStack Router, not component state. This makes the view bookmarkable, shareable, and survives refresh/back-forward.
- **Define the shape once, in the route file.** Add a `validateSearch` function to the route's `src/routes/*.tsx` file that parses `Record<string, unknown>` into a typed, defaulted object. Never import feature-level constants/JSX files into a route file for this — the route config stays in the eager bundle, so pulling in icons or mock data there defeats code splitting. Duplicate the literal default value instead, with a comment noting what it must match.

```tsx
// src/routes/index.tsx
export interface ProfileSearch {
  tab: string;
  q: string;
  dept: string;
  sub: string;
}

const validateSearch = (search: Record<string, unknown>): ProfileSearch => ({
  tab: typeof search.tab === 'string' ? search.tab : 'templates',
  q: typeof search.q === 'string' ? search.q : '',
  dept: typeof search.dept === 'string' ? search.dept : '',
  sub: typeof search.sub === 'string' ? search.sub : '',
});

export const Route = createFileRoute('/')({ validateSearch, component: ProfilePage });
```

- **Read/write search params with `getRouteApi`, not a direct `Route` import.** The route file imports the page component, so the page importing `Route` back would be circular. `getRouteApi('/')` resolves the route by id at render time instead:

```tsx
import { getRouteApi } from '@tanstack/react-router';
const routeApi = getRouteApi('/');

const { tab: activeTab } = routeApi.useSearch();
const navigate = routeApi.useNavigate();
```

- **`replace: true` for keystroke/filter-level changes, default (push) for tab/page-level navigation.** Typing in a search box or toggling a filter chip should not spam browser history — always pass `{ replace: true }` for those. Switching a primary tab is closer to a page move, so let it push a history entry (back button should undo it).
- **Merge, don't clobber.** Use the functional form when only touching one key: `navigate({ search: (prev) => ({ ...prev, q: value }), replace: true })`. Only pass a full object literal when intentionally resetting multiple keys at once (e.g. clearing a panel's `q`/`dept`/`sub` when the parent tab changes, so one panel's filter state doesn't leak into the next).
- **Debounce the *derived filtering*, not the URL write.** Keep writing to the URL on every keystroke (cheap, and it's a `replace` so it doesn't thrash history) — but run `useDebounce` on the value read back from search params before using it to filter a list, exactly as you would with local state. See `src/pages/profile/components/tabs/useFilterableList.ts`.

## Lazy Import + Suspense on Every Tab/Modal Boundary

- **Route components already code-split automatically** — `rspack.config.ts` has `tanstackRouter({ autoCodeSplitting: true })`, so each route's `component` ships in its own chunk with no manual work.
- **Manually `lazy()` anything gated behind a tab switch or a conditional modal render**, even within a single route. A tab click or `mode && <Modal/>` check is this app's equivalent of a page move, and should trigger its own chunk fetch instead of shipping in the main bundle:

```tsx
const SignaturesPanel = lazy(() =>
  import('../components/tabs/SignaturesPanel').then((m) => ({ default: m.SignaturesPanel })),
);
```

- **Wrap the switch/conditional in `<Suspense>`, not each branch individually** — one boundary around `renderTabPanel()` covers every tab. Use `src/components/ui/PanelLoading` as the fallback for a content area with visible real estate (tab panels). Use `fallback={null}` for modals — they have no backdrop of their own to show a spinner against, and their chunks are small enough that a flash of nothing beats a loading skeleton with no frame around it.
- **This pays off most for panels/modals pulling a heavy dependency.** `SignatureModal` drags in `ContentEditor` (TinyMCE, ~1MB+) — lazy-loading it means that weight only downloads when a user actually opens the signature editor, not on first page load. Before reaching for a new heavy dependency, check whether the consuming component is already behind a lazy boundary; if not, add one rather than letting it inflate the main chunk.

## Known Shared Utilities

See the canonical registry in `.claude/skills/system-assembly.md` ("Known Shared Utilities") — most relevant here: `useFilterableList.ts` (search-param-backed filter state) and `PanelLoading` (the standard `Suspense` fallback).
