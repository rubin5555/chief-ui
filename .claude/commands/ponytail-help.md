# Ponytail Help — quick reference

Display a compact reference card for all ponytail commands.

---

**ponytail** — lazy senior dev mode (YAGNI ladder enforced by default)
- `/ponytail` — activate full mode
- `/ponytail lite` — build the request, name the lazier alternative
- `/ponytail ultra` — challenge the requirement before building anything
- `/ponytail off` — disable for this session

**ponytail-review** — scan current diff for over-engineering (one line per finding)

**ponytail-audit** — whole-repo scan ranked by removal impact

**ponytail-debt** — list all `ponytail:` shortcut comments with ceilings and triggers

**ponytail-help** — this card

---

The seven-rung ladder (stop at the first that holds):
1. YAGNI — does it need to exist?
2. Reuse existing code
3. Stdlib
4. Native platform
5. Installed dep
6. One line
7. Minimum that works
