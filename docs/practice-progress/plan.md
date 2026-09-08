# Practice, projects, and local progress: technical plan

## Context
Read the user requirements, docs/roadmap.md, AGENTS.md, and the generated React/Vinext app. This feature follows the preceding merged main branch.

## Scope and implementation
Add quiz feedback with explanations, a sandboxed worker Python runner with timeout/reset and explicit download state, project briefs with datasets and acceptance rubrics, downloadable notebooks, bookmarks, local completion and notes, export/import progress. Validate corrupt storage, quiz scoring, execution timeout and worker lifecycle. Clearly label device-local storage; no authentication is required.

## Integration and data flow
Shared application layout and original typed course content are the common interfaces. Client interactions compute locally and expose their current state; server routes must validate untrusted inputs. Reuse existing accessible primitives and preserve app routing.

## Edge cases
Handle empty results, unknown lesson identifiers, malformed local storage, unavailable browser capabilities, reduced motion and narrow viewports. Keep retry or recovery paths visible when a dependency fails.

## Verification and documentation
Run applicable package scripts and inspect real results before PR creation. Update this plan with material implementation decisions and docs/release-quality with final verification. Tests must exercise user-relevant behavior or mathematical invariants.

## Definition of done

## Delivered details
40 editable examples use a dedicated Pyodide worker and fresh namespaces. Four generated notebooks contain actual pipelines and rubrics; all were executed locally with scikit-learn 1.8.0. Browser runs have a 90-second loading timeout, 10-second execution timeout and capped output. Local progress is validated before imports are merged. Learners explicitly mark completion and save notes. Storage errors are surfaced. Worker unit tests inject a runtime for deterministic lifecycle checks; native Python tests exercise every example and notebook.
Specified behavior works, no unresolved implementation placeholders remain, relevant checks pass, feature PR is reviewed and merged to main, and any external capability limitation is clearly documented.
