# System Skill / Rule: Creating Component-Level Analytics Files (`.analytics.ts`)

Use this skill whenever you are tasked with adding event tracking to a UI component or feature. We already have a centralized generic analytics adapter layer (`@/analytics`) in place. Your job is to create a local translator hook inside the component's folder to bridge the UI events with that generic adapter.

---

## 📁 Encapsulated Folder Structure

When a component requires tracking, you must create a dedicated `[ComponentName].analytics.ts` file directly inside its folder.

**CRITICAL:** Do NOT export this file from the folder's barrel file (`index.ts`). It must remain an isolated, internal dependency of this folder only.

```text
📁 MyComponent/
├── MyComponent.tsx        # Pure UI, state, and visual presentation
├── MyComponent.styles.ts  # Layout and styles
├── MyComponent.analytics.ts # 🧠 ALL tracking logic goes here (Target file)
└── index.ts               # Barrel file exporting ONLY the MyComponent component
```

---

## 🛠️ Requirements for `[ComponentName].analytics.ts`

1. **Custom Hook Export:** The file must export a custom hook (e.g., `useMyComponentAnalytics`) which returns semantic tracking functions for the UI component to invoke.
2. **Importing the Adapter:** Import the generic tracking interface straight from your core path: `import { analytics } from '@/analytics';`.
3. **Strict Action Mapping:** Use a `const ACTIONS = { ... } as const;` structure to define all action names to prevent string typos.

### 📘 CRITICAL: Hebrew Language Rule for Action Descriptions

While the entire codebase (variable names, functions, hooks, imports) must be written in standard English, **the actual string values passed into `category`, `action`, and `label` payloads MUST be written in clear, concise Hebrew**. This ensures our analytics platform dashboards (e.g., Matomo) display human-readable reports for product stakeholders.

- **Category (`ANALYTICS_CATEGORY`):** Feature/Area descriptor in Hebrew (e.g., `'אזור תשלום'`, `'תפריט ניווט ראשי'`).
- **Intent Actions:** For user interactions before a server response completes (e.g., `'ניסיון שליחת טופס'`).
- **Success Actions:** Executed on successful network or operation completion (e.g., `'שליחה הצליחה'`).
- **Failure Actions:** Executed when errors happen, using the `label` parameter for the failure context (e.g., `'שליחה נכשלה'`).
- **Interactive Toggles:** For sorting, filtering, or option adjustments (e.g., `'שינוי אמצעי תשלום'`).

---

## 💻 Code Reference Implementation

### 1. The Analytics Hook File (`MyComponent.analytics.ts`)

```typescript
import { analytics } from "@/analytics";

// Category string defined in Hebrew
const ANALYTICS_CATEGORY = "רכיב דוגמה";

// Actions strictly mapped to Hebrew string values
const ACTIONS = {
	SUBMIT_ATTEMPT: "ניסיון שליחת טופס",
	SUBMIT_SUCCESS: "שליחה הצליחה",
	SUBMIT_FAILURE: "שליחה נכשלה",
	TOGGLE_VIEW: "שינוי תצוגה",
} as const;

export const useMyComponentAnalytics = () => {
	const trackSubmitAttempt = (type: string) => {
		analytics.trackEvent({
			category: ANALYTICS_CATEGORY,
			action: ACTIONS.SUBMIT_ATTEMPT,
			label: `סוג: ${type}`,
		});
	};

	const trackSubmitResult = (status: "success" | "error", message?: string) => {
		analytics.trackEvent({
			category: ANALYTICS_CATEGORY,
			action:
				status === "success" ? ACTIONS.SUBMIT_SUCCESS : ACTIONS.SUBMIT_FAILURE,
			label: message || "ללא פירוט",
		});
	};

	const trackViewToggle = (currentView: string) => {
		analytics.trackEvent({
			category: ANALYTICS_CATEGORY,
			action: ACTIONS.TOGGLE_VIEW,
			label: `מעבר לתצוגת: ${currentView}`,
		});
	};

	return {
		trackSubmitAttempt,
		trackSubmitResult,
		trackViewToggle,
	};
};
```

### 2. How the UI Component Consumes It (`MyComponent.tsx`)

The UI component imports the hook directly from the local file path. The UI remains clean, readable, and perfectly oblivious to any tracking parameters or analytics frameworks:

```tsx
import React from "react";
import { useMyComponentAnalytics } from "./MyComponent.analytics"; // Direct internal import

export const MyComponent = () => {
	const { trackSubmitAttempt, trackSubmitResult } = useMyComponentAnalytics();

	const handleProcess = async () => {
		trackSubmitAttempt("ראשי");
		try {
			// business execution...
			trackSubmitResult("success");
		} catch (err: any) {
			trackSubmitResult("error", err.message);
		}
	};

	return <button onClick={handleProcess}>שלח</button>;
};
```

---

## 🚫 Structural Guardrails

- **Never Leak the Hook:** Keep the analytics hook unexposed in the folder's `index.ts` barrel.
- **Maintain Child Reusability:** If a nested sub-component folder requires tracking, do not let it look up into this file. Instead, pass standard event callbacks down through the components via props (e.g., `onActionClick`), keeping the child dumb and reusable.
- **Mock for Tests:** In testing environments, decouple UI evaluation from analytics side-effects completely by applying `jest.mock('./MyComponent.analytics')`.

---

## ❌ Scope Exclusions — Never Create Analytics Files For These

The following file types and directories must **never** receive an `.analytics.ts` file. Do not scan, modify, or reference them when implementing analytics:

| Pattern                              | Reason                                                                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `src/components/ui/**`               | Generic primitive UI components (Button, Chip, Modal, etc.) are dumb and reusable — analytics belong only on the feature/page layer that consumes them |
| `*.constants.ts` / `*.constants.tsx` | Static configuration files with no runtime behavior                                                                                                    |
| `*.styles.ts` / `*.styles.tsx`       | Styling-only files with no user interaction                                                                                                            |
| `*.testids.ts` / `*.testids.tsx`     | Test selector registries — not runtime code                                                                                                            |
| `index.ts` barrel files              | Re-export only; no logic to track                                                                                                                      |

**Rule:** Analytics hooks belong exclusively on **feature-level and page-level components** that own meaningful user intent (e.g., a form submission flow, a search trigger, a navigation action). If a component lives in `src/components/ui/`, it is a primitive — wire analytics callbacks through props from the consuming feature instead.
