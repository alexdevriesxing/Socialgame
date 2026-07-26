import { access, readdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { NPCS, TEACHERS } from '../src/content.js';

const required = [
  'keyart.png','school_map.png','portraits.png','ui_icons.png','favicon.png',
  'player_boy.png','player_girl.png',
  ...NPCS.map(({id})=>`${id}.png`),
  ...TEACHERS.map(({id})=>`${id}.png`)
];
for (const file of required) await access(new URL(`../assets/${file}`, import.meta.url), constants.R_OK);
const files=(await readdir(new URL('../assets/', import.meta.url))).filter(file=>file.endsWith('.png'));
if(files.length<required.length) throw new Error(`Expected at least ${required.length} PNG assets, found ${files.length}`);
console.log(`Asset validation passed for ${required.length} required PNG files.`);
