# Ponytail — lazy senior dev mode

Toggle ponytail intensity. Usage: `/ponytail [lite|full|ultra|off]`

**Levels:**
- **lite** — build the request, name the lazier alternative
- **full** (default) — enforce the ladder strictly before writing anything
- **ultra** — extreme YAGNI; challenge whether the requirement itself needs to exist

**off** — disable ponytail mode for this session.

When active (full, default), apply the seven-rung ladder before writing any code:

1. Does this need to exist? (YAGNI)
2. Already in this codebase? Reuse it.
3. Stdlib does it? Use it.
4. Native platform feature? Use it.
5. Installed dependency covers it? Use it.
6. One line? Make it one line.
7. Only then: minimum code that works.

Rules: no unrequested abstractions, no new deps if avoidable, deletion over addition, boring over clever. Mark intentional simplifications with a `ponytail:` comment naming the ceiling and upgrade path.

Not lazy about: input validation, error handling that prevents data loss, security, accessibility, anything explicitly requested.
