import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const listeners = {};
class Element {
  constructor(id) {
    this.id = id;
    this.classList = {
      values: new Set(),
      add(value) { this.values.add(value); },
      remove(value) { this.values.delete(value); },
      contains(value) { return this.values.has(value); }
    };
    this.value = 'Akira';
    this.textContent = '';
  }
  addEventListener(type, callback) {
    (listeners[`${this.id}:${type}`] ??= []).push(callback);
  }
}

const context = new Proxy({
  imageSmoothingEnabled: true,
  textAlign: 'left',
  textBaseline: 'alphabetic',
  measureText(text) { return { width: String(text).length * 8 }; },
  createLinearGradient() { return { addColorStop() {} }; }
}, {
  get(target, property) { return property in target ? target[property] : () => {}; },
  set(target, property, value) { target[property] = value; return true; }
});

const canvas = new Element('game');
canvas.width = 960;
canvas.height = 540;
canvas.getContext = () => context;
canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 960, height: 540 });
const elements = {
  game: canvas,
  creator: new Element('creator'),
  nameInput: new Element('nameInput'),
  confirmName: new Element('confirmName'),
  loading: new Element('loading')
};
elements.creator.classList.add('hidden');

globalThis.document = { getElementById: id => elements[id] };
globalThis.window = globalThis;
window.addEventListener = (type, callback) => {
  (listeners[`window:${type}`] ??= []).push(callback);
};
window.AudioContext = class {
  constructor() { this.currentTime = 0; this.state = 'running'; this.destination = {}; }
  createOscillator() { return { type: '', frequency: { value: 0 }, connect() {}, start() {}, stop() {} }; }
  createGain() { return { gain: { value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} }, connect() {} }; }
  resume() {}
};
globalThis.localStorage = {
  data: {},
  getItem(key) { return this.data[key] ?? null; },
  setItem(key, value) { this.data[key] = value; },
  removeItem(key) { delete this.data[key]; }
};
globalThis.requestAnimationFrame = () => 0;
globalThis.performance = { now: () => 1000 };
globalThis.setInterval = () => 1;
globalThis.clearInterval = () => {};
globalThis.Image = class {
  set src(value) { this.source = value; queueMicrotask(() => this.onload?.()); }
};

const index = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"/g)].map(match => match[1]);
if (scripts.length < 30) throw new Error(`Expected at least 30 scripts; found ${scripts.length}.`);
for (const script of scripts) {
  const code = await readFile(new URL(`../${script}`, import.meta.url), 'utf8');
  vm.runInThisContext(code, { filename: script });
}
await new Promise(resolve => setTimeout(resolve, 25));

if (!elements.loading.classList.contains('hidden')) throw new Error('Game did not initialize.');
if (CAMPAIGN_MONTHS.length !== 48) throw new Error('Campaign chapters are incomplete.');
if (Object.values(RELATIONSHIP_ROUTES).flat().length !== 30) throw new Error('Friendship routes are incomplete.');
if (PHONE_MESSAGES.length !== 20) throw new Error('Phone conversations are incomplete.');
if (RIVALRY_SCENES.length !== 20) throw new Error('Rivalry chapters are incomplete.');
if (CAMPUS_ACTIVITIES.length !== 8) throw new Error('Campus activities are incomplete.');
if (ACHIEVEMENTS.length !== 24) throw new Error('Yearbook achievements are incomplete.');
if (MONTHLY_SHOWCASES.length !== 12) throw new Error('Monthly showcases are incomplete.');
if (Object.keys(CLUB_CHALLENGES).length !== 4) throw new Error('Club challenges are incomplete.');
if (CURRENT_SAVE_VERSION !== 5) throw new Error(`Expected save version 5; found ${CURRENT_SAVE_VERSION}.`);
if (!createArtSources().rival_atlas.startsWith('data:image/svg+xml')) throw new Error('Rivalry art atlas is missing.');

ensureV7State();
game.player.gender = 'boy';
game.month = 2;
if (!nextRivalryScene(game.npcs.find(npc => npc.id === 'ren'))) throw new Error('Rivalry progression did not produce an eligible scene.');
game.time = 855;
game.dayFlags.activity = false;
if (!campusActivityAvailable() || campusOptions().length !== 3) throw new Error('Free Period planner did not initialize.');
if (typeof openYearbook !== 'function' || typeof checkAchievements !== 'function') throw new Error('Yearbook runtime is missing.');

console.log(`Remote release smoke passed with ${scripts.length} scripts, 48 campaign chapters, 20 rivalry chapters, 8 campus activities and 24 achievements.`);
