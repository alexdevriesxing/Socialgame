import { CURRENT_SAVE_VERSION, SAVE_KEY, migrateSave, readSave, writeSave } from '../src/save.js';

const legacy = {
  player: { name: 'Akira', club: 'council', relationships: {} },
  year: 1, month: 1, day: 1, time: 470
};
const migrated = migrateSave(legacy);
if (migrated.version !== CURRENT_SAVE_VERSION) throw new Error('Legacy save did not migrate to current version.');
if (migrated.data.player.socialStatus !== 'ordinary') throw new Error('Legacy status default missing.');
if (migrated.data.player.clubXP !== 0) throw new Error('Legacy club progression default missing.');

const storage = {
  data: new Map([['sakura-crest-social-summit-v1', JSON.stringify(legacy)]]),
  getItem(key) { return this.data.get(key) ?? null; },
  setItem(key, value) { this.data.set(key, value); },
  removeItem(key) { this.data.delete(key); }
};
const loaded = readSave(storage);
if (loaded.player.socialStatus !== 'ordinary') throw new Error('readSave did not migrate legacy data.');
if (!storage.getItem(SAVE_KEY)) throw new Error('Migrated save was not rewritten under the canonical key.');

writeSave(storage, loaded);
const envelope = JSON.parse(storage.getItem(SAVE_KEY));
if (envelope.version !== CURRENT_SAVE_VERSION || !envelope.savedAt) throw new Error('Save envelope is invalid.');
console.log('Save migration tests passed.');
