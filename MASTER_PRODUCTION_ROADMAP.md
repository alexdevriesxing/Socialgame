# Sakura Crest: Social Summit — Master Production Roadmap

This roadmap converts the complete improvement backlog into playable, testable releases. Every release must preserve old saves, pass static Cloudflare validation, and add at least one meaningful activity the player actively performs.

## Design pillars

1. **A living school** — students move, react, remember and form groups.
2. **Active school life** — classes, clubs, festivals and social moments contain gameplay, not only dialogue.
3. **Many paths to respect** — popularity is multidimensional; kindness, scholarship, creativity, sport, leadership and reliability are all viable.
4. **Failure creates stories** — poor results unlock recovery, tutoring, mediation and comeback routes.
5. **Four distinct years** — discovery, ambition, pressure and legacy each change the stakes.
6. **Commercial presentation** — cohesive anime art, expressive portraits, polished UI, adaptive audio and accessible controls.

## Release plan

### v1.2 — Immersive Foundations — implemented in this pass

- Segmented reputation: recognition, kindness, academics, athletics, creativity, leadership, reliability and controversy.
- Circle-specific standing for Council, Athletics, Arts, Technology and the wider school community.
- Replayable lesson challenges with scores, mastery and personal bests.
- Dynamic school stories driven by time, season, prior choices and current standing.
- Recovery opportunities after failed exams, election defeats and attendance problems.
- Yearbook collectibles and story records.
- New Reputation and Recovery interfaces.

### v1.3 — Living Campus

- NPC route maps between every scheduled room.
- Assigned classroom seats and lunch groups.
- Teacher patrols and room access rules.
- Weather-dependent indoor/outdoor behavior.
- Context-aware notice boards and daily school announcements.
- Nurse, counselor and school-office interactions.

### v1.4 — Club Careers

- Full gameplay loops for all four clubs.
- Training calendars, ranks, specialist skills, team morale and club budgets.
- Club tournaments, exhibitions, robotics meets and council hearings.
- Captain/president succession and mentoring younger students.
- Club-specific endings and collectible trophies.

### v1.5 — Social Simulation

- Trust, respect, tension, admiration, jealousy, gratitude and resentment.
- Remembered promises, favors, secrets and public incidents.
- Evolving circles that split, merge and support competing candidates.
- Rumor sources, credibility, containment and reconciliation.
- Group conversations, invitations, exclusion recovery and mediation.

### v1.6 — Town, Home and Weekends

- Home hub and bedroom customization.
- Shopping street, café, arcade, park, cinema, sports center and station.
- Gifts, birthdays, hobbies, favorite places and personal interests.
- Part-time work, shopping, group outings and optional dates.
- Casual outfits, accessories, phone themes and room decoration.

### v1.7 — Four-Year Story Expansion

- Bespoke story identity for all 48 campaign months.
- Field trips, exchange students, school festivals and seasonal traditions.
- Year-specific pressure: discovery, ambition, responsibility and legacy.
- Expanded character routes, rival rematches and teacher recommendations.
- Failure branches and comeback chapters for major outcomes.

### v1.8 — Prom, Graduation and Epilogues

- Multi-stage prom campaign and formal-event gameplay.
- Prom companion, friend-group and independent attendance paths.
- Broader legacy calculation across academic, social and club performance.
- Individual epilogues for every major character.
- Scholarships, careers, club succession and unresolved-conflict outcomes.

### v1.9 — Commercial Art, Audio and Accessibility

- Replace every remaining procedural or placeholder asset with approved crisp anime art.
- Complete character spritesheets, expressions, outfits and illustrated scenes.
- Distinct school environments, seasonal variants and polished UI/HUD.
- Adaptive soundtrack, ambience, footsteps, bells, weather and activity SFX.
- Save slots, dialogue history, auto/skip, remapping, audio sliders and touch scaling.

### v2.0 — Commercial Launch

- Full boy/girl, all-club, all-difficulty and all-ending playthrough QA.
- Balance ranking growth, energy, stress, discipline and relationship pacing.
- Mobile, controller, browser, slow-device and save-corruption testing.
- Performance budgets, offline/PWA review, analytics hooks and privacy documentation.
- Cloudflare production deployment, release packaging and store-ready media.

## Quality gates for every pass

- Existing saves migrate automatically.
- No external runtime dependency is required.
- `npm run check` passes.
- Static Cloudflare build opens through a local HTTP server.
- New systems have deterministic smoke tests.
- New content is data-driven and documented.
- Failure paths are tested alongside success paths.
