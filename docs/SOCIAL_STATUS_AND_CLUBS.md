# Social Status Difficulty and Club Progression

## Difficulty philosophy

Difficulty is represented through the student's starting social position, not enemy health or artificial stat inflation. The same school events occur, but their social consequences differ.

### Established — Easy

The student is already recognized through feeder-school friendships or community activities. They begin with stronger relationships and teacher trust, earn positive reputation slightly faster, suffer reduced penalties and face lower rival ranking pressure. Club promotion thresholds are lower.

### Ordinary — Normal

The student begins without a meaningful advantage. Reputation gains, mistakes, rumors, invitations and club progression use the baseline values.

### Outsider — Hard

The student is new to the district. They begin with weaker relationships and mild stress. Positive reputation grows more slowly, penalties are larger, rumors occur more often, rivals score higher and club promotion requires more XP. The mode is demanding but never locks the player out of the ending.

## Club career

Every club has four ranks. Club activities award XP and prestige. Monthly reviews consider attendance, the current monthly festival and the student's key club stat. Strong months can produce competition victories.

Club prestige, rank and competition wins feed into the main social score. This creates four different strategic routes to the top rather than one universally optimal build.

## Balancing hooks

The configuration lives in `src/content.js` under `SOCIAL_STATUS_LEVELS` and `CLUBS`. Thresholds and multipliers can be adjusted without changing the simulation engine.
