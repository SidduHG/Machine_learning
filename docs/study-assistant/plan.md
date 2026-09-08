# Lesson-aware study assistant: technical plan

## Context
Read the user requirements, docs/roadmap.md, AGENTS.md, and the generated React/Vinext app. This feature follows the preceding merged main branch.

## Scope and implementation
Implement a transparent local retrieval assistant over the original course sections, with topic search, question intent, grounded excerpts and lesson/source links. Distinguish this offline assistant from a generative LLM. Add an optional server provider adapter only if runtime credentials exist; never expose keys or pretend retrieval is an LLM. Test unrelated questions, math/example intent, empty input, input length, and contextual retrieval.

## Integration and data flow
Shared application layout and original typed course content are the common interfaces. Client interactions compute locally and expose their current state; server routes must validate untrusted inputs. Reuse existing accessible primitives and preserve app routing.

## Edge cases
Handle empty results, unknown lesson identifiers, malformed local storage, unavailable browser capabilities, reduced motion and narrow viewports. Keep retry or recovery paths visible when a dependency fails.

## Verification and documentation
Run applicable package scripts and inspect real results before PR creation. Update this plan with material implementation decisions and docs/release-quality with final verification. Tests must exercise user-relevant behavior or mathematical invariants.

## Definition of done
Specified behavior works, no unresolved implementation placeholders remain, relevant checks pass, feature PR is reviewed and merged to main, and any external capability limitation is clearly documented.

