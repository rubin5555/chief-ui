# Skill: Modal Placement

## Core Rule

Modals are **page-level concerns**, never component-level. A modal that can be triggered from more than one place (or that renders over the full page) must live in the page's `modals/` directory — not inside the triggering component.

## Directory Structure

```
src/
├── modals/               # ALL app-wide modals live here
│   └── <ModalName>/
│       ├── <ModalName>.tsx
│       ├── <ModalName>.styles.ts
│       ├── <ModalName>.testids.ts
│       ├── <ModalName>.constants.ts  # (optional)
│       └── index.ts
└── pages/
    └── <PageName>/
        └── components/  # Panels, sidebars, tabs — no modals here
```

## Placement Decision Rule

| Where the modal renders              | Where it lives                  |
| ------------------------------------ | ------------------------------- |
| Can be triggered from anywhere       | `src/modals/<ModalName>/`       |
| Inside a single isolated widget only | Co-locate inside that component |

## Open/Close State

Modal open state belongs to the **page** (or a page-level context/store), not the triggering component. The triggering component receives an `onNew` / `onOpen` callback — it never owns the modal or its visibility state.

```tsx
// ✅ Correct — page owns the modal
const [showMailingList, setShowMailingList] = useState(false);
// panel gets a callback, not the modal
<ListsPanel onNew={() => setShowMailingList(true)} />;
{
	showMailingList && (
		<MailingListModal
			onClose={() => setShowMailingList(false)}
			onSave={handleSave}
		/>
	);
}

// ❌ Wrong — panel renders its own modal
const ListsPanel = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button onClick={() => setOpen(true)} />
			{open && <MailingListModal />}
		</>
	);
};
```

## Import Path

Always import the modal from its own barrel, never from the triggering component's barrel:

```ts
// ✅
import { MailingListModal } from "@/modals/MailingListModal";

// ❌ — modal must not leak through the triggering panel's barrel
import { MailingListModal } from "../components/tabs/ListsPanel";
```
