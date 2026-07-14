# Sakura Crest: Social Summit — Cloudflare Release

This branch is the **Expanded World, Customization & Collections v1.4** release of Sakura Crest. It retains the complete four-year / 48-chapter campaign, living-campus simulation, active classroom and club gameplay, thirty school friendship-route chapters, twenty phone conversations, twelve monthly showcases, twenty rivalry chapters, ten illustrated friendship moments, twenty-four contextual campus incidents, forty achievements, eight seasonal examinations, eight weekend outings, four annual elections and twelve graduation legacies.

The v1.4 pass gives evenings, optional periods and weekends a meaningful life outside school. The district now contains thirteen off-campus destinations plus a persistent bedroom hub. Every core student has a birthday, interests, likes, dislikes, a favorite place, conversation topics and three unique off-campus scenes. Style, room décor, gifts, allowance, visits, scenes and collection progress persist through the version-9 save format.

## Expanded world

- Thirteen off-campus destinations: Shopping Street, Maple Café, Starline Arcade, Riverside Park, Public Library, Moonlight Cinema, Sports Center, Echo Live House, Festival Grounds, City Museum, Study Center, Crest Convenience and Sakura Station.
- A bedroom hub with wardrobe preview, room themes, display wall, trophies, memory cards, posters and music.
- Free-period and after-school travel from the HUD with **X**; weekend travel is also available from the month-end screen.
- Deterministic visitors at each destination based on interests, favorite places, date and location.
- Exploration rewards, allowance income, stat effects and first-visit collectibles.

## Friend profiles, scenes and gifts

- Ten complete preference profiles covering birthdays, interests, liked and disliked gift categories, favorite locations and conversation topics.
- Three unique off-campus scenes per core student, for thirty authored scenes and thirty matching memory cards.
- Profile screens show bond, birthday, favorite place, known interests, scene progress and gift history.
- Twelve purchasable gift types with clear interest matching and birthday bonuses.
- Gifts affect relationships positively, neutrally or negatively based on each person’s preferences.
- Nested shop, profile and gift navigation returns to the same destination without charging travel time or creating duplicate visits.

## Persistent customization

- Eight customization categories: hair, skin, face, outfit, accessory, bag, phone theme and room theme.
- Four options in every category, purchased with in-game allowance and retained permanently once unlocked.
- Equipped selections persist in saves and are reflected on the player sprite, bedroom preview and phone presentation.
- The bedroom can display collected posters, trophies, memory cards and music.

## Duplicate-safe collection system

- Yearbook photos, badges, trophies, posters, thirty memory cards, seasonal wallpapers, music tracks and graduation keepsakes.
- Every collectible has a stable unique ID and unlock source.
- `grantCollectible()` refuses duplicate unique items and never inflates collection totals.
- Collections unlock from exploration, scenes, thoughtful gifts, styling and complete district progress.
- The Crest Collection book tracks category totals and reveals the source requirement for locked items.

## Active School and Living Campus

The v1.3 systems remain intact: nine playable subjects, sixteen club activities, sixteen seasonal club competitions, practice and assist modes, 110 student-period routines, 44 teacher-duty routines, weather rerouting, school services and Campus Pulse.

## Cloudflare Pages

- Framework preset: **None**
- Build command: leave blank
- Build output directory: **/** or **.**
- Environment variables: none

The repository root is the deployable site. No Worker, package installation, database, external image host or secrets are required. `sw.js` caches the complete v1.4 runtime for offline play.

## Controls

WASD / arrows to move, E or Space to interact, **X district map**, **B bedroom**, **U collection book**, G active learning, C campus pulse, R rankings, Q schedule, J friendships, P phone, K memories, A campus activities, V rivals, Y yearbook, O accessibility/options, L leadership, M sound and Escape pause. Number keys operate sequence and decision activities. Standard controllers and touch buttons are supported.

## Production validation

The `Production browser QA` workflow launches the exact static release in Chromium and checks:

- the complete 48-month campaign, 154 living-campus routines and all v1.3 active-school systems;
- thirteen off-campus locations, ten preference profiles and thirty unique off-campus scenes;
- eight customization categories and persisted equipment after save/load;
- liked, neutral, disliked and birthday gift behavior;
- duplicate-safe collectible unlocks and category totals;
- nested world navigation without extra time or visit counts;
- district map, destination, bedroom, customization, gifts and collection overlays;
- revised v1.4 title, live HUD, offline reload, portrait guidance and landscape mobile containment;
- browser errors, failed requests and screenshot evidence for manual visual QA.

## Release scope

This is a deployable complete-campaign browser release with active school days, a living campus, meaningful evenings and weekends, persistent self-expression, NPC preference-driven friendships, duplicate-safe collections, four annual leadership campaigns and a post-prom New Game+ loop.
