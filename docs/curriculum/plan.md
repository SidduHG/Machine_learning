# Curriculum and lesson reader: technical plan

## Context

Read the user requirements, docs/roadmap.md, AGENTS.md, and the generated React/Vinext app. This feature follows the preceding merged main branch.

## Scope and implementation

Add typed modules and lessons in lib/curriculum, searchable curriculum route, dynamic lesson route, KaTeX math rendering, source links, printable notes, previous/next navigation, and lesson metadata. Include original topic-specific notes across the entire path. Test unique IDs, source URLs, quiz correctness, route lookup, and required content sections.

## Integration and data flow

Shared application layout and original typed course content are the common interfaces. Client interactions compute locally and expose their current state; server routes must validate untrusted inputs. Reuse existing accessible primitives and preserve app routing.

## Edge cases

Handle empty results, unknown lesson identifiers, malformed local storage, unavailable browser capabilities, reduced motion and narrow viewports. Keep retry or recovery paths visible when a dependency fails.

## Verification and documentation

Run applicable package scripts and inspect real results before PR creation. Update this plan with material implementation decisions and docs/release-quality with final verification. Tests must exercise user-relevant behavior or mathematical invariants.

## Definition of done

Specified behavior works, no unresolved implementation placeholders remain, relevant checks pass, feature PR is reviewed and merged to main, and any external capability limitation is clearly documented.
