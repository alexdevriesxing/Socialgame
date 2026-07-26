function promiseIsReady(promise){
  if(!promise)return false;
  const promiseMemory=(game.player.relationshipMemories[promise.npcId]||[]).find(m=>m.type==='promise'&&m.summary.includes(promise.summary));
  if(!promiseMemory)return true;
  return game.year>promiseMemory.year||
    (game.year===promiseMemory.year&&game.month>promiseMemory.month)||
    (game.year===promiseMemory.year&&game.month===promiseMemory.month&&game.day>promiseMemory.day);
}