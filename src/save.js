const CURRENT_SAVE_VERSION = 2;
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

function migrateSave(raw) {
  if (!isRecord(raw)) throw new TypeError('Save data must be an object.');
  let version = Number.isInteger(raw.version) ? raw.version : 1;
  let data = isRecord(raw.data) ? raw.data : raw;
  if (version < 1 || version > CURRENT_SAVE_VERSION) throw new Error(`Unsupported save version: ${version}`);
  if (version === 1) { data = migrateV1(data); version = 2; }
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
    const migrated = migrateSave(JSON.parse(serialized));
    if (key !== SAVE_KEY || migrated.version !== CURRENT_SAVE_VERSION) writeSave(storage, migrated.data);
    return migrated.data;
  }
  return null;
}

function deleteSave(storage) {
  storage.removeItem(SAVE_KEY);
  for (const key of LEGACY_SAVE_KEYS) storage.removeItem(key);
}
