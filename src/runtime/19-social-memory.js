// Relationship memory, promises, and recovery scenes.
// Loaded after dialogue helpers and before the main interaction loop.

const MEMORY_LIMIT = 8;

function ensureSocialMemoryState(){
  game.player.relationshipMemories ||= {};
  game.player.socialProfiles ||= {};
  game.player.promises ||= [];
  for(const npc of NPCS){
    game.player.relationshipMemories[npc.id] ||= [];
    game.player.socialProfiles[npc.id] ||= {trust:0,respect:0,strain:0};
  }
}

function rememberRelationship(npcId,type,summary,impact=0){
  if(!npcId)return;
  ensureSocialMemoryState();
  const memories=game.player.relationshipMemories[npcId] ||= [];
  memories.unshift({type,summary,impact,year:game.year,month:game.month,day:game.day});
  memories.splice(MEMORY_LIMIT);
  const profile=game.player.socialProfiles[npcId];
  if(type==='support'||type==='promise-kept')profile.trust=clamp(profile.trust+Math.max(1,impact),-10,20);
  if(type==='respect'||type==='rival-respect')profile.respect=clamp(profile.respect+Math.max(1,impact),-10,20);
  if(type==='hurt'||type==='promise-broken')profile.strain=clamp(profile.strain+Math.max(1,Math.abs(impact)),0,20);
  if(type==='apology'||type==='reconciliation')profile.strain=clamp(profile.strain-Math.max(2,Math.abs(impact)),0,20);
}

function recordPromise(npcId,summary,dueDay=game.day+2){
  ensureSocialMemoryState();
  game.player.promises.push({npcId,summary,dueYear:game.year,dueMonth:game.month,dueDay,status:'open'});
  rememberRelationship(npcId,'promise',`Promised: ${summary}`,1);
}

function resolvePromise(npcId,summary,kept=true){
  ensureSocialMemoryState();
  const promise=[...game.player.promises].reverse().find(p=>p.npcId===npcId&&p.status==='open'&&(!summary||p.summary===summary));
  if(promise)promise.status=kept?'kept':'broken';
  rememberRelationship(npcId,kept?'promise-kept':'promise-broken',kept?`Kept promise: ${summary||promise?.summary||'follow through'}`:`Broke promise: ${summary||promise?.summary||'follow through'}`,kept?2:-3);
  game.player.relationships[npcId]=clamp((game.player.relationships[npcId]||0)+(kept?2:-2),-10,20);
}

function socialProfile(npcId){
  ensureSocialMemoryState();
  const base=game.player.relationships[npcId]||0;
  const profile=game.player.socialProfiles[npcId];
  return {...profile,friendship:base,standing:base+profile.trust+profile.respect-profile.strain};
}

function recentMemory(npcId){
  ensureSocialMemoryState();
  return game.player.relationshipMemories[npcId]?.[0]||null;
}

function applyChoiceMemory(dialogue,choice){
  ensureSocialMemoryState();
  const rel=choice?.relationship;
  const npcId=choice?.memoryNpc||rel?.[0]||dialogue?.portrait;
  if(!npcId||!NPCS.some(n=>n.id===npcId))return;
  const delta=rel?.[1]||0;
  const type=choice.memoryType||(delta>=2?'support':delta<0?'hurt':'respect');
  const summary=choice.memory||choice.achievement||choice.result||choice.text||'A meaningful conversation';
  rememberRelationship(npcId,type,summary,delta);
  if(choice.promise)recordPromise(npcId,choice.promise,choice.promiseDueDay);
  if(choice.resolvePromise)resolvePromise(npcId,choice.resolvePromise,choice.promiseKept!==false);
}

function recoveryChoiceFor(npcId){
  const profile=socialProfile(npcId);
  if(profile.strain<3&&profile.friendship>-3)return null;
  return {
    text:'Acknowledge what happened and make amends',
    relationship:[npcId,2],
    memoryNpc:npcId,
    memoryType:'reconciliation',
    memory:'Chose honesty and repaired some of the damage.',
    effects:{kindness:1,reliability:1,stress:-2},
    result:'The conversation is awkward, but sincere. Trust will take time—and this is a real beginning.'
  };
}

function expirePromises(){
  ensureSocialMemoryState();
  for(const promise of game.player.promises){
    if(promise.status!=='open')continue;
    const overdue=game.year>promise.dueYear||
      (game.year===promise.dueYear&&game.month>promise.dueMonth)||
      (game.year===promise.dueYear&&game.month===promise.dueMonth&&game.day>promise.dueDay);
    if(overdue)resolvePromise(promise.npcId,promise.summary,false);
  }
}
