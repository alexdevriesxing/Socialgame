import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const NPCS=[{id:'aiko'},{id:'ren'}];
const context={
  NPCS,
  game:{
    year:1,month:1,day:1,
    player:{
      relationships:{aiko:0,ren:0},
      stats:{kindness:3,reliability:3},
      stress:0
    }
  },
  clamp:(n,a,b)=>Math.max(a,Math.min(b,n)),
  console
};
vm.createContext(context);
const source=await readFile(new URL('../src/runtime/19-social-memory.js',import.meta.url),'utf8');
vm.runInContext(source,context,{filename:'19-social-memory.js'});

context.ensureSocialMemoryState();
assert.deepEqual(Object.keys(context.game.player.relationshipMemories),['aiko','ren']);
assert.equal(context.socialProfile('aiko').standing,0);

context.rememberRelationship('aiko','support','Helped with a difficult project.',2);
assert.equal(context.game.player.socialProfiles.aiko.trust,2);
assert.equal(context.recentMemory('aiko').summary,'Helped with a difficult project.');

context.recordPromise('aiko','Bring the festival materials',2);
assert.equal(context.game.player.promises.length,1);
assert.equal(context.game.player.promises[0].status,'open');

context.resolvePromise('aiko','Bring the festival materials',true);
assert.equal(context.game.player.promises[0].status,'kept');
assert.equal(context.game.player.relationships.aiko,2);
assert.equal(context.game.player.socialProfiles.aiko.trust,4);

context.rememberRelationship('ren','hurt','Dismissed Ren in front of the team.',-3);
assert.equal(context.game.player.socialProfiles.ren.strain,3);
assert.ok(context.recoveryChoiceFor('ren'));
context.rememberRelationship('ren','reconciliation','Apologized without excuses.',3);
assert.equal(context.game.player.socialProfiles.ren.strain,0);

context.recordPromise('ren','Meet after class',1);
context.game.day=2;
context.expirePromises();
const expired=context.game.player.promises.find(p=>p.npcId==='ren');
assert.equal(expired.status,'broken');
assert.equal(context.game.player.relationships.ren,-2);

for(let i=0;i<12;i++)context.rememberRelationship('aiko','respect',`Memory ${i}`,1);
assert.equal(context.game.player.relationshipMemories.aiko.length,8);
assert.equal(context.game.player.relationshipMemories.aiko[0].summary,'Memory 11');

console.log('Social memory, promise, recovery, migration and memory-limit checks passed.');
