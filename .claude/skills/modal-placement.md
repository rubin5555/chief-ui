# Skill: Modal Placement

## Core Rule

A modal lives wherever it renders. There is no forced relocation into a shared page-level directory — the component that owns opening a modal (a page, a panel, a menu, anything) also owns its open/close state and renders it directly, right next to the trigger. A page-level modal and a component-level modal are both correct; what matters is that the state and the render sit together, at whatever level of the tree actually triggers it.

Every modal **must** be built using `src/components/ui/Modal/Modal.tsx` as its structural template — never hand-roll modal chrome (backdrop, portal, focus trap, Escape-to-close, header/body/footer layout). `Modal` already provides:

- Portal rendering via `ModalPortal`
- Focus trap + initial autofocus + focus restore on close (`onTrapFocus`, the two mount `useEffect`s)
- Escape-to-close and overlay-click-to-close, both routed through `onRequestClose`/`requestClose` so a caller can hook a side effect (e.g. analytics) into every dismiss path
- Consistent header (`title`, optional `icon`, close button), scrollable body, optional footer with `footerAlign`
- Exit-animation coordination via `useDialogClose` and the exposed `ModalHandle.requestClose()` ref, for callers that need to close from a footer button or a post-save flow

A new modal component wraps `<Modal>` and supplies `title`/`children`/`footer`; it should not reimplement any of the above.

```tsx
// ✅ Correct — SupportMenu owns and renders its own modal
export const SupportMenu = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  // ...
  return (
    <>
      <SupportTriggerButton onClick={onToggle} />
      {panel.open && <SupportOptionsPanel onPermissionsClick={() => setShowPermissions(true)} />}
      {showPermissions && (
        <ContactPermissionsModal onClose={() => setShowPermissions(false)} />
      )}
    </>
  );
};

// ContactPermissionsModal.tsx — built on the shared template, not hand-rolled chrome
export const ContactPermissionsModal = ({ onClose }: Props) => (
  <Modal title="הרשאות יצירת קשר" onClose={onClose} footer={<Actions onClose={onClose} />}>
    {/* modal-specific content */}
  </Modal>
);
```

## Directory Structure

Modal components still get the same internal file layout regardless of where they're triggered from:

```
<ModalName>/
├── <ModalName>.tsx
├── <ModalName>.styles.ts
├── <ModalName>.testids.ts
├── <ModalName>.constants.ts  # (optional)
└── index.ts
```

Where that directory sits is a colocation call, not a mandate:

| Situation                                              | Where it lives                                          |
| -------------------------------------------------------- | --------------------------------------------------------- |
| Triggered from one component/menu, rendered by that component | Colocated next to that component (its own `<ModalName>/` folder, or nested under the trigger's folder) |
| Triggered from multiple unrelated places, or shared across pages | `src/modals/<ModalName>/`, imported by whichever component ends up owning the open/close state at render time |

Either way, always import the modal from its own barrel (`index.ts`), never through the triggering component's barrel.

## Open/Close State

Modal open state belongs to whichever component renders the modal — that is the same component that owns the trigger's click handler. There is no requirement to lift it further up the tree than that. A nested menu component (like `SupportMenu`) is a perfectly valid owner as long as it renders the modal itself rather than delegating rendering to something else while keeping the state, or vice versa — state and render must not be split across two different components.

```tsx
// ✅ Correct — owner renders what it opens
const SupportMenu = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  return (
    <>
      <SupportTriggerButton onClick={() => panel.toggle()} />
      {showPermissions && <ContactPermissionsModal onClose={() => setShowPermissions(false)} />}
    </>
  );
};

// ❌ Wrong — state and render split across two components
const SupportMenu = () => {
  const [showPermissions, setShowPermissions] = useState(false);
  return <SupportOptionsPanel onPermissionsClick={() => setShowPermissions(true)} />;
  // ...and some unrelated ancestor renders `showPermissions && <ContactPermissionsModal />`
  // using state it doesn't own — now two files must stay in sync to know the modal exists.
};
```
