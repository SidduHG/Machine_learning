# ML Atlas development workflow

Read docs/roadmap.md before a new feature, then docs/<feature>/feature.md and plan.md before implementation. Keep business requirements in feature.md and implementation decisions in plan.md.

## Feature delivery
1. Start with a clean main branch synchronized with origin/main. Preserve unrelated user edits.
2. Create a new lowercase feature/<name> branch from main. Each of the six roadmap features gets its own branch and PR.
3. Write or update the feature's feature.md, then plan.md, before code changes.
4. Implement the feature and meaningful behavior tests. Check package.json for validation scripts and run all applicable checks.
5. Inspect the diff and recent commits, commit the feature, push, and open a PR targeting main. Record actual validation results and limitations in the PR.
6. The project owner has authorized sequential PR merges for this initial six-feature build. Merge only after required checks pass; then synchronize main before the next branch. Future work needs its own merge authorization.

## Product rules
- Keep all educational routes public. Progress, notes and bookmarks are explicitly device-local.
- Author original topic-specific explanations. Cite primary sources and distinguish simplified simulations from production implementations.
- Keep algorithms independent of rendering and test numerical invariants. Provide textual equivalents for graphics.
- Label the study assistant's capabilities honestly. Keep API credentials exclusively in server-side secrets.
- Maintain keyboard access, readable contrast, responsive layouts and reduced-motion support.
- Deploy only the exact tested source. Record verified deployment URL and release checks in docs/release-quality.

