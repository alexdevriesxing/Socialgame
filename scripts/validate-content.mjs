import {
  ROOMS, SCHEDULE, CLUBS, SOCIAL_STATUS_LEVELS, NPCS, TEACHERS,
  CLASS_PROMPTS, CLUB_PROMPTS, DAILY_MISSIONS, RANDOM_EVENTS,
  BULLY_ENCOUNTERS, HOTSPOTS, MONTHLY_SPECIALS, RANKING_RULES
} from '../src/content.js';

const errors = [];
const assert = (condition, message) => { if (!condition) errors.push(message); };
const unique = (values, label) => assert(new Set(values).size === values.length, `${label} must be unique.`);

assert(Object.keys(ROOMS).length >= 8, 'At least eight rooms are required.');
for (const [id, room] of Object.entries(ROOMS)) {
  assert(room.name && Number.isFinite(room.x) && Number.isFinite(room.y), `Room ${id} is invalid.`);
  assert(room.w > 0 && room.h > 0, `Room ${id} requires positive dimensions.`);
}

let previousEnd = -Infinity;
for (const slot of SCHEDULE) {
  assert(slot.id && slot.title, 'Every schedule slot requires id and title.');
  assert(slot.start < slot.end, `Schedule slot ${slot.id} has invalid times.`);
  assert(slot.start >= previousEnd, `Schedule slot ${slot.id} overlaps the previous slot.`);
  const room = slot.room === 'club' ? 'club' : slot.room;
  assert(room === 'club' || ROOMS[room], `Schedule slot ${slot.id} references unknown room ${slot.room}.`);
  previousEnd = slot.end;
}
unique(SCHEDULE.map(slot => slot.id), 'Schedule IDs');

for (const [id, club] of Object.entries(CLUBS)) {
  assert(ROOMS[club.room], `Club ${id} references unknown room ${club.room}.`);
  assert(Array.isArray(club.ranks) && club.ranks.length === 4, `Club ${id} must have four ranks.`);
  assert(Array.isArray(club.competitions) && club.competitions.length >= 4, `Club ${id} needs competitions.`);
  assert(CLUB_PROMPTS[id]?.length, `Club ${id} has no activity prompts.`);
}

for (const required of ['established', 'ordinary', 'outsider']) {
  assert(SOCIAL_STATUS_LEVELS[required], `Missing social status ${required}.`);
}

unique(NPCS.map(npc => npc.id), 'NPC IDs');
unique(TEACHERS.map(teacher => teacher.id), 'Teacher IDs');
for (const npc of NPCS) {
  assert(['boy', 'girl'].includes(npc.gender), `NPC ${npc.id} has invalid gender.`);
  assert(npc.name && npc.bio && npc.greetings?.length, `NPC ${npc.id} is missing authored content.`);
}
for (const teacher of TEACHERS) assert(teacher.name && teacher.room, `Teacher ${teacher.id} is invalid.`);

for (const slot of SCHEDULE.filter(slot => !slot.optional && slot.id !== 'club')) {
  assert(CLASS_PROMPTS[slot.id]?.length, `Required class ${slot.id} has no prompts.`);
}
assert(DAILY_MISSIONS.length >= 5, 'Daily mission variety is below the current playable baseline.');
assert(RANDOM_EVENTS.length >= 5, 'Random event variety is too low.');
assert(BULLY_ENCOUNTERS.length >= 2, 'Bully encounter variety is too low.');
assert(HOTSPOTS.length >= 4, 'Hotspot variety is too low.');
assert(MONTHLY_SPECIALS.length === 12, 'Exactly twelve monthly specials are required.');
assert(RANKING_RULES.length >= 4, 'Ranking rules are incomplete.');

if (errors.length) {
  console.error(`Content validation failed with ${errors.length} error(s):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`Content validation passed: ${NPCS.length} NPCs, ${TEACHERS.length} teachers, ${SCHEDULE.length} schedule slots, ${Object.keys(CLUBS).length} clubs.`);
