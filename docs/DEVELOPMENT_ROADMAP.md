# Sakura Crest: Social Summit — Development Roadmap

Master tracker: https://github.com/alexdevriesxing/Socialgame/issues/12

## Current baseline

Pass 1 is implemented on `agent/pass-1-production-source`. The compressed runtime payload has been replaced by readable production source, structured data modules, explicit save migrations, deterministic asset generation, automated validation and a reproducible Cloudflare Pages release build.

The playable vertical-slice systems remain in place: separate boys' and girls' rankings, class schedules, teacher discipline, clubs and social-status difficulty. The four-year calendar exists as a framework, but the project is not yet a finished 48-month commercial game. The current placeholder/pixel visuals must next be replaced with the approved crisp 2D anime direction.

## Delivery status

| Pass | GitHub issue | Status | Deliverable |
|---|---:|---|---|
| 1 | #3 | Implemented — PR pending | Maintainable production source, validation and release packaging. |
| 2 | #4 | Next | Replace every character placeholder with final anime sprites, portraits, expressions and outfit variants. |
| 3 | #5 | Open | Build final environments, tilesets, seasonal variants, UI, icons and visual effects. |
| 4 | #6 | Open | Complete the school-day simulation, schedules, classes, teachers, discipline and NPC routines. |
| 5 | #7 | Open | Deepen and balance relationships, social rankings, clubs, rivals and competitions. |
| 6 | #8 | Open | Author and implement all distinct content for Years 1–2, months 1–24. |
| 7 | #9 | Open | Author Years 3–4, months 25–48, prom, graduation, endings and epilogues. |
| 8 | #10 | Open | Add final audio, accessibility, mobile UX, controller support and performance polish. |
| 9 | #11 | Open | Complete full-campaign QA, balancing, Cloudflare production deployment and release readiness. |

## Required order

Pass 1 established the canonical source and asset pipeline. Passes 2 and 3 replace the placeholder presentation. Passes 4 and 5 stabilize the systems that the authored campaign depends on. Passes 6 and 7 produce all 48 months. Pass 8 polishes the complete experience. Pass 9 is the release gate.

## Delivery protocol

Every pass must:

1. Start from the latest accepted development head.
2. Use a dedicated `agent/pass-N-description` branch.
3. Stay within the linked issue and its definition of done.
4. Integrate the work into playable gameplay; generated files alone do not count as completion.
5. Run all relevant automated checks and the manual checks available in the environment.
6. Push the branch and open a draft pull request.
7. Update or close the milestone issue with evidence and any deferred work.
8. Report the branch, commit, PR, completed work, validation, limitations, tradeoffs and exact remaining passes.

## Branch names

- `agent/pass-1-production-source`
- `agent/pass-2-character-art`
- `agent/pass-3-environments-ui`
- `agent/pass-4-school-simulation`
- `agent/pass-5-social-systems`
- `agent/pass-6-years-1-2`
- `agent/pass-7-years-3-4-endings`
- `agent/pass-8-polish-accessibility`
- `agent/pass-9-release`

## Definition of finished

The project is finished only when all 48 months have authored content, every placeholder visual has been replaced, the complete campaign can reach all intended endings without intervention, no critical or high-severity defects remain, and the production build is verified on Cloudflare Pages.
