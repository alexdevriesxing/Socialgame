const CURRENT_SAVE_VERSION = 5;
const SAVE_KEY = 'sakura-crest-social-summit';
const LEGACY_SAVE_KEYS = ['sakura-crest-social-summit-v1'];

const isRecord = value => value !== null && typeof value === 'object' && !Array.isArray(value);

function migrateV1(data) {
  const migrated = structuredClone(data);
  migrated.player ||= {};
  migrated.player.socialStatus ||= 'ordinary';
  migrated.player.teacherTrust ??= 0;
  migrated.player.invitations ||= [];
  migrated.player.clubXP ??= 0;
  migrated.player.clubRankIndex ??= 0;
  migrated.player.clubPrestige ??= 0;
  migrated.player.clubWins ??= 0;
  migrated.player.clubAttendance ??= 0;
  migrated.player.monthlyScores ||= [];
  migrated.scheduleStatus ||= {};
  migrated.dayFlags ||= { talked: [], hotspots: [], help: 0, club: 0, ontime: 0, event: false };
  migrated.missions ||= [];
  migrated.finished ??= false;
  return migrated;
}

function migrateV2(data) {
  const migrated = structuredClone(data);
  migrated.player ||= {};
  migrated.player.routeScenes ||= [];
  migrated.player.challengeBest ||= { athletics:0, arts:0, tech:0, council:0 };
  migrated.player.challengeAttempts ??= 0;
  migrated.player.monthlyChallengeScores ||= [];
  migrated.dayFlags ||= { talked: [], hotspots: [], help: 0, club: 0, ontime: 0, event: false };
  migrated.dayFlags.brief ??= false;
  migrated.dayFlags.challenge ??= false;
  migrated.dailyBrief ??= null;
  migrated.promResult ??= null;
  return migrated;
}


function migrateV3(data) {
  const migrated = structuredClone(data);
  migrated.player ||= {};
  migrated.player.phoneInbox ||= [];
  migrated.player.messageReplies ||= [];
  migrated.player.showcaseScores ||= [];
  migrated.player.showcaseWins ??= 0;
  migrated.player.eventPrestige ??= 0;
  migrated.dayFlags ||= { talked: [], hotspots: [], help: 0, club: 0, ontime: 0, event: false };
  migrated.dayFlags.message ??= false;
  migrated.dayFlags.showcase ??= false;
  migrated.promCompanion ??= null;
  return migrated;
}

function migrateV4(data) {
  const migrated = structuredClone(data);
  migrated.player ||= {};
  migrated.player.rivalScenes ||= [];
  migrated.player.rivalRespect ||= {};
  migrated.player.rivalHeat ||= {};
  migrated.player.campusActivityLog ||= [];
  migrated.player.campusMastery ||= {};
  migrated.player.achievements ||= [];
  migrated.player.achievementDates ||= {};
  migrated.player.onTimeClasses ??= 0;
  migrated.dayFlags ||= { talked: [], hotspots: [], help: 0, club: 0, ontime: 0, event: false };
  migrated.dayFlags.activity ??= false;
  return migrated;
}

function migrateSave(raw) {
  if (!isRecord(raw)) throw new TypeError('Save data must be an object.');
  let version = Number.isInteger(raw.version) ? raw.version : 1;
  let data = isRecord(raw.data) ? raw.data : raw;
  if (version < 1 || version > CURRENT_SAVE_VERSION) throw new Error(`Unsupported save version: ${version}`);
  if (version === 1) { data = migrateV1(data); version = 2; }
  if (version === 2) { data = migrateV2(data); version = 3; }
  if (version === 3) { data = migrateV3(data); version = 4; }
  if (version === 4) { data = migrateV4(data); version = 5; }
  return { version, data };
}

function writeSave(storage, snapshot) {
  const envelope = { version: CURRENT_SAVE_VERSION, savedAt: new Date().toISOString(), data: snapshot };
  storage.setItem(SAVE_KEY, JSON.stringify(envelope));
  return envelope;
}

function readSave(storage) {
  const candidates = [SAVE_KEY, ...LEGACY_SAVE_KEYS];
  for (const key of candidates) {
    const serialized = storage.getItem(key);
    if (!serialized) continue;
    const parsed = JSON.parse(serialized);
    const migrated = migrateSave(parsed);
    const originalVersion = Number.isInteger(parsed.version) ? parsed.version : 1;
    if (key !== SAVE_KEY || originalVersion !== CURRENT_SAVE_VERSION) writeSave(storage, migrated.data);
    return migrated.data;
  }
  return null;
}

function deleteSave(storage) {
  storage.removeItem(SAVE_KEY);
  for (const key of LEGACY_SAVE_KEYS) storage.removeItem(key);
}
