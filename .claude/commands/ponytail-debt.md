# Ponytail Debt — deliberate shortcuts ledger

Grep the codebase for `ponytail:` comments and produce a structured report. Read-only by default; if the user asks, persist to `PONYTAIL-DEBT.md`.

**Per finding, report:**
- File path and line number
- The simplified approach taken
- Named ceiling (the limit of the shortcut)
- Upgrade trigger (what should prompt revisiting)

Flag any comment missing an explicit upgrade trigger as `no-trigger` — these are most likely to become permanent temporaries.

End with: `<N> markers, <M> with no trigger.`
