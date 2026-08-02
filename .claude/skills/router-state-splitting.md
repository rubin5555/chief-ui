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

export const Route = createFileRoute('/profile')({ validateSearch, component: ProfilePage });
```

- **Read/write search params with `getRouteApi`, not a direct `Route` import.** The route file imports the page component, so the page importing `Route` back would be circular. `getRouteApi('/profile')` resolves the route by id at render time instead:

```tsx
import { getRouteApi } from '@tanstack/react-router';
const routeApi = getRouteApi('/profile');

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
- **The data query moves with the component, not just the JS.** Lazy-loading a panel's *code* while its parent still calls `useTemplates()`/`useSignatures()`/`useLists()` up front only splits half the cost — the network request fires on page load regardless of which tab is active, even though the chunk that needs the response doesn't load until later. Put the query call *inside* the lazy component itself (`TemplatesPanel` calls `useTemplates()`, not `ProfilePage`), so both the code and the fetch are gated by the same "user is actually looking at this" trigger. The parent should only hold data genuinely shared by multiple siblings (e.g. `ProfilePage` still calls `useProfile()` because both `ProfileSidebar` and `TemplatesPanel` need it) — not data that belongs to exactly one lazy child.

```tsx
// ❌ Wrong — page fetches every tab's data up front, only the JS is deferred
const ProfilePage = () => {
  const { data: templatesData } = useTemplates();
  const { data: signaturesData } = useSignatures();
  const { data: listsData } = useLists();
  // ...renders whichever lazy panel matches the active tab, passing its slice down
};

// ✅ Correct — each lazy panel owns its own query; fetch and chunk load together
const TemplatesPanel = () => {
  const { data, loading } = useTemplates();
  if (loading) return <PanelLoading />;
  // ...
};
```

## Shared Chrome Lives at the Root Layout, Not Inside Pages

- **Anything rendered on every route belongs next to `<Outlet/>` in `src/routes/__root.tsx`**, not inside an individual page component — even while the app only has one route today. A navbar, app shell, or global menu isn't "the profile page's UI" just because the profile page happens to be the only thing currently rendering under it; it's app-wide chrome that would otherwise have to be copy-pasted into every future page.
- **Pattern:** a dedicated `AppLayout` component (`src/components/layout/AppLayout/`) composes the shell + navbar and renders `<Outlet/>` where the routed page goes. `__root.tsx`'s route component renders `<AppLayout/>` instead of `<Outlet/>` directly:

```tsx
// src/components/layout/AppLayout/AppLayout.tsx
export const AppLayout = () => (
  <AppShell>
    <TopNavbar start={...} end={...} />
    <Outlet />
  </AppShell>
);

// src/routes/__root.tsx
const RootRoute = () => (
  <>
    <AppLayout />
    <TanStackRouterDevtools />
  </>
);
```

- **Test:** if a second route were added tomorrow, would it need to re-render the navbar itself to get one? If yes, the navbar is in the wrong place — it should already be showing up for free because it's a sibling of `<Outlet/>`, not a child of the first page that happened to need it.

## Known Shared Utilities

See the canonical registry in `.claude/skills/system-assembly.md` ("Known Shared Utilities") — most relevant here: `useFilterableList.ts` (search-param-backed filter state) and `PanelLoading` (the standard `Suspense` fallback).
