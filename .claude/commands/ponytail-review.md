# Ponytail Review — over-engineering detection

Review the current diff (or $ARGUMENTS if a path is given) for unnecessary complexity only. Correctness bugs, security, and performance are out of scope — use /code-review for those.

**Finding tags:**
- `delete:` — unused code or speculative features; no replacement needed
- `stdlib:` — hand-coded logic the standard library already provides
- `native:` — deps or code duplicating a platform capability
- `yagni:` — single-implementation abstractions or unused config layers
- `shrink:` — logic that can be fewer lines with identical behaviour

**Output format** (one line per finding):
```
L<line>: <tag> <what>. <replacement>.
```

End with: `net: -<N> lines possible.`
If nothing to cut: `Lean already. Ship.`
