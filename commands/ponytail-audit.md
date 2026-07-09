# Ponytail Audit — whole-repo over-engineering scan

Scan the entire repository for unnecessary complexity. Ranked by removal impact. Read-only — report only, apply nothing.

Hunt for: deps the stdlib or platform already ships, single-implementation interfaces, factories with one product, wrappers that only delegate, speculative abstractions, dead flexibility.

**Finding tags:** `delete:` · `stdlib:` · `native:` · `yagni:` · `shrink:`

**Output format:**
```
<tag> <what to cut>. <replacement>. [path:line]
```

Ranked highest impact first. End with: `net: -<N> lines, -<M> deps possible.`

Scope: over-engineering only. Correctness, security, and performance are excluded.
