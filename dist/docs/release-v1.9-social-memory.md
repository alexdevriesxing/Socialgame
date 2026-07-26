# Sakura Crest v1.9 — Deep Social Memory

Release v1.9 expands the complete v1.8 school-life RPG with a persistent social-memory layer. The goal is to make ordinary conversations, promises and disagreements matter across the four-year campaign without replacing the existing friendship routes, rivalry scenes, phone messages, elections, Prom or graduation systems.

## Relationship dimensions

Each of the ten core classmates now maintains five bounded emotional values from 0 to 20:

- **Trust** — confidence that the player is honest and dependable.
- **Respect** — admiration for the player’s judgment, competence and accountability.
- **Warmth** — emotional comfort and closeness.
- **Strain** — unresolved disappointment, hurt or conflict.
- **Jealousy** — restrained social unease when a close classmate sees the player investing heavily in another member of the same circle.

These values complement the existing bond and rivalry meters. They do not erase completed routes or change the gender-separated ranking ladders.

## Remembered choices

Dialogue choices with relationship effects create dated memories. Each memory stores the school year, month, day, category and player-facing description. The most recent eighteen memories per classmate are retained, which keeps saves bounded while allowing conversations to refer to meaningful history.

The connection review presents the current mood, all five emotional values, friendship tier, recent memories and any open promise.

## Promise loop

The player can make a concrete promise to help after class. The promise becomes a persistent save object with a creation day, due day and status.

- Following through produces a larger trust, respect and warmth gain than the original offer.
- Ignoring the promise causes a dedicated broken-promise conversation.
- The player can own the failure, reschedule responsibly or dismiss the impact.
- Resolution status remains in the save history instead of silently deleting the promise.

The day counter spans all forty-eight campaign months, including month and school-year transitions.

## Conflict and reconciliation

When strain reaches the conflict threshold, the next normal conversation becomes a reconciliation scene. The player can listen, explain their position while accepting responsibility or avoid the issue. These choices change trust, respect, warmth and strain independently, allowing a friendship to recover without pretending the conflict never happened.

## Context awareness

Normal conversations react to lunch, club time, trusted relationships, jealousy and unresolved strain. Existing authored friendship moments, rivalry chapters and relationship routes keep priority so v1.9 adds depth without blocking established content.

## Persistence and compatibility

Deep Social Memory is stored inside the existing player snapshot used by resilient save format v10. Older v10 saves initialize all ten social-memory profiles automatically when loaded. Values are normalized into supported ranges and memory lists are capped.

## Offline and Cloudflare delivery

`src/social-memory-v19.js` is loaded by `index.html`, registered in `build-manifest.json` and included in the v1.9 service-worker core cache. The release remains a dependency-free static Cloudflare Pages deployment with no Worker, database, secret or external asset host.

## Validation scope

The release gate checks:

- syntax of the new production module and deterministic smoke test;
- initialization for all ten classmates;
- bounded trust, respect, warmth, strain and jealousy values;
- promise creation, fulfillment and broken-promise consequences;
- reconciliation triggering and state repair;
- v1.9 index metadata, build inventory and service-worker cache registration;
- retention of the complete v1.8 campaign, artwork, accessibility, mobile and offline gates.
