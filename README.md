# Chief — Hebrew RTL Document Management System

A pixel-perfect **Hebrew RTL** document management UI prototype built with React 18, TypeScript, and Tailwind CSS v4. This is a UX prototype / design system — all data is mocked, there is no backend.

---

## Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Language | TypeScript 5 |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Icons | Lucide React |
| Direction | RTL (`dir="rtl"`) — Hebrew UI |

---

## Project Structure

```
src/
├── index.css                  # Entry CSS — imports fonts, Tailwind, theme, globals
├── styles/
│   ├── fonts.css              # Font-face declarations
│   ├── tailwind.css           # Tailwind base import
│   ├── theme.css              # CSS variables (colors, radius, sidebar tokens)
│   └── globals.css            # Global overrides — custom scrollbar styles
├── app/
│   └── components/
│       ├── TopNavbar.tsx      # Top navigation bar (environment switcher, notifications)
│       ├── RightSidebar.tsx   # Right sidebar — user info, permissions, departments
│       ├── MainContent.tsx    # Center panel — main document editor / command view
│       ├── PersonalArea.tsx   # Personal area modal — Templates, Signatures, Distribution Lists
│       ├── ImportDropdown.tsx # Reusable import dropdown component
│       └── CustomSelect.tsx   # Reusable styled select / dropdown
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server (default: http://localhost:5173)
npm run dev

# Build for production
npm run build
```

---

## Key Features (Prototype)

### Personal Area (`PersonalArea.tsx`)
The largest component. Contains three tabs:

**Templates (תבניות)**
- List of user templates with pin, copy, delete
- New template modal with type selector: פקודה (active) | הוראה (Coming Soon) | מסמך (Coming Soon)
- Section / topic / appendix builder
- Automatic command template tab — Coming Soon tooltip, but still navigable
- Search bar with department filter

**Signatures (חתימות)**
- Three signature types: חתימה להפצה | חתימה אישית במסמך | חתימת מאשר (Coming Soon, disabled)
- Signatures table with copy / delete actions
- New signature modal

**Distribution Lists (רשימות תפוצה)**
- New list modal with:
  - Live searchable people picker (name | environment | ID number columns)
  - Multi-option add menu with 5 source types
  - **Import from existing document sub-panel:**
    - 7-column table: שם המסמך | מס׳ פק׳ | עדכון | סביבה | סוג מסמך | תאריך עדכון אחרון | מס סימוכין
    - Per-row expand arrow → shows the document's distribution list as a scrollable mini-table (up to 5 rows visible)
    - Multi-select checkboxes + "Import selected" action bar
  - Members table: שם מלא | תעודת זהות | סביבה | delete

### New Environment Modal
- Body type: ארגון / אגף / מחלקה
- Name, creators, permissions list (scrollable, includes מתחקר role)

### "Coming Soon" Pattern
Dark tooltip (`bg-gray-800 text-white`) on hover with a downward arrow pointer:
- **חתימת מאשר** — disabled, not clickable
- **הוראה / מסמך** template cards — disabled with amber badge
- **תבנית פקודה אוטומטית** tab — tooltip only, still navigable for development

---

## Design Tokens

All tokens live in `src/styles/theme.css` as CSS custom properties, mapped into Tailwind via `@theme inline`.

Key values:
```css
--primary:    #030213
--background: #ffffff
--muted:      #ececf0
--radius:     0.625rem
```

Brand blue used throughout: `#1B3A6B`

---

## RTL Notes

The entire app runs `dir="rtl"`. Things to keep in mind:

- **Flex rows:** first child = visually **rightmost**, last child = visually **leftmost**
- **HTML tables:** first column in HTML = visually **rightmost**
- Use `text-right` for standard text alignment
- Anchor dropdowns with `right-0` not `left-0`
- `autoComplete="new-password"` is used on search inputs to suppress browser autocomplete popups

---

## Mocked Data

All data is static, defined at the top of `PersonalArea.tsx`:

| Constant | Description |
|---|---|
| `LIST_PEOPLE_POOL` | 15 mock people (name, ID number, environment) |
| `LIST_DOCS_DATA` | 4 mock documents with full distribution lists per doc |

To connect a real backend, replace these constants and the relevant `useState` initializers with API calls.
