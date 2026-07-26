'use strict';

// v1.9 Deep Social Memory: persistent trust, respect, strain, jealousy,
// promises and reconciliation layered over the complete v1.8 campaign.
(() => {
  const MEMORY_LIMIT = 18;
  const SOCIAL_FIELDS = ['trust','respect','warmth','strain','jealousy'];

  function schoolDayOrdinal(year=game.year,month=game.month,day=game.day){
    return ((Math.max(1,year)-1)*12+(Math.max(1,month)-1))*20+Math.max(1,day);
  }
  function socialDayKey(){return `${game.year}-${game.month}-${game.day}`;}
  function emptySocialMemory(){return {trust:0,respect:0,warmth:0,strain:0,jealousy:0,memories:[],lastInteraction:null,lastConflictDay:null};}
  function ensureSocialMemoryState(){
    const player=game.player;
    player.socialMemory ||= {};
    player.socialPromises ||= [];
    player.socialMilestones ||= [];
    for(const npc of NPCS){
      const memory=player.socialMemory[npc.id] ||= emptySocialMemory();
      for(const field of SOCIAL_FIELDS)memory[field]=clamp(Number(memory[field])||0,0,20);
      memory.memories=Array.isArray(memory.memories)?memory.memories.slice(-MEMORY_LIMIT):[];
      memory.lastInteraction ||= null;
      memory.lastConflictDay ||= null;
    }
    player.socialPromises=player.socialPromises.filter(item=>item&&NPCS.some(npc=>npc.id===item.npcId));
    return player.socialMemory;
  }
  function socialMemoryFor(npcId){ensureSocialMemoryState();return game.player.socialMemory[npcId];}
  function npcForMemory(npcId){return NPCS.find(npc=>npc.id===npcId)||null;}
  function remember(npcId,text,type='moment'){
    if(!text)return;
    const memory=socialMemoryFor(npcId);
    memory.memories.push({text,type,year:game.year,month:game.month,day:game.day});
    memory.memories=memory.memories.slice(-MEMORY_LIMIT);
    memory.lastInteraction={year:game.year,month:game.month,day:game.day,type};
  }
  function milestone(npcId,key,label,score=5){
    ensureSocialMemoryState();
    const id=`${npcId}:${key}`;
    if(game.player.socialMilestones.includes(id))return;
    game.player.socialMilestones.push(id);
    game.player.score+=statusScore(score);
    notify(label,COLORS.gold);
    audio.good();
  }
  function adjustSocialMemory(npcId,delta={},text='',type='moment'){
    const memory=socialMemoryFor(npcId);
    for(const field of SOCIAL_FIELDS)if(delta[field])memory[field]=clamp(memory[field]+delta[field],0,20);
    if(text)remember(npcId,text,type);
    const npc=npcForMemory(npcId);
    if(memory.trust>=8)milestone(npcId,'trusted',`${npc?.name||'A classmate'} now trusts you deeply.`);
    if(memory.respect>=8)milestone(npcId,'respected',`${npc?.name||'A classmate'} openly respects your choices.`);
    if(memory.warmth>=10)milestone(npcId,'warmth',`${npc?.name||'A classmate'} considers you part of their inner circle.`);
    return memory;
  }
  function socialMood(memory){
    if(memory.strain>=8)return 'hurt and guarded';
    if(memory.strain>=4)return 'uneasy';
    if(memory.jealousy>=6)return 'quietly jealous';
    if(memory.trust>=10&&memory.warmth>=10)return 'deeply connected';
    if(memory.respect>=8)return 'respectful';
    if(memory.warmth>=6)return 'comfortable';
    return 'still getting to know you';
  }
  function socialSummary(npcId){
    const memory=socialMemoryFor(npcId);
    return `Trust ${memory.trust} • Respect ${memory.respect} • Warmth ${memory.warmth} • Strain ${memory.strain} • Jealousy ${memory.jealousy}`;
  }
  function openSocialProfile(npc){
    const memory=socialMemoryFor(npc.id);
    const recent=memory.memories.slice(-3).reverse();
    const promise=pendingPromise(npc.id);
    const history=recent.length?recent.map(item=>`• ${item.text}`).join('\n'):'• No defining shared memory yet.';
    openDialogue({speaker:`${npc.name} • Connection`,portrait:npc.portrait,text:`Current mood: ${socialMood(memory)}\n${socialSummary(npc.id)}\nBond: ${relationshipTier(game.player.relationships[npc.id]||0)}\n\nRecent memories:\n${history}${promise?`\n\nOpen promise: ${promise.label} (${promise.status}).`:''}`,choices:[{text:'Return to the conversation.'}]});
  }
  function pendingPromise(npcId){
    ensureSocialMemoryState();
    return game.player.socialPromises.find(item=>item.npcId===npcId&&item.status==='pending')||null;
  }
  function createPromise(npcId,type='help'){
    const existing=pendingPromise(npcId);if(existing)return existing;
    const promise={id:`${npcId}-${schoolDayOrdinal()}-${type}`,npcId,type,label:type==='help'?'Help after class':'Keep your word',created:schoolDayOrdinal(),due:schoolDayOrdinal()+1,status:'pending'};
    game.player.socialPromises.push(promise);return promise;
  }
  function resolvePromise(npcId,status){
    const promise=pendingPromise(npcId);if(!promise)return;
    promise.status=status;promise.resolved=schoolDayOrdinal();
  }
  function spreadJealousy(focusNpcId,bondDelta){
    if(bondDelta<2)return;
    const focus=npcForMemory(focusNpcId);if(!focus)return;
    const day=socialDayKey();
    for(const npc of NPCS){
      if(npc.id===focusNpcId||npc.clique!==focus.clique)continue;
      const relationship=game.player.relationships[npc.id]||0;
      const memory=socialMemoryFor(npc.id);
      const marker=`jealousy:${focusNpcId}:${day}`;
      if(relationship>=7&&!memory.memories.some(item=>item.type===marker)){
        memory.jealousy=clamp(memory.jealousy+1,0,20);
        remember(npc.id,`They noticed how much attention you gave ${focus.name}.`,marker);
      }
    }
  }
  function inferMemoryFromChoice(choice){
    if(!choice)return;
    const explicit=choice.memory;
    if(explicit?.npcId){
      adjustSocialMemory(explicit.npcId,explicit.delta||{},explicit.text||choice.text,explicit.type||'choice');
      if(explicit.promise==='create')createPromise(explicit.npcId,explicit.promiseType||'help');
      if(explicit.promiseResolution)resolvePromise(explicit.npcId,explicit.promiseResolution);
      if(explicit.spreadJealousy)spreadJealousy(explicit.npcId,explicit.spreadJealousy);
      return;
    }
    if(!choice.relationship)return;
    const [npcId,bondDelta]=choice.relationship;
    const text=String(choice.text||'A conversation changed the relationship.');
    const lower=text.toLowerCase();
    const delta={warmth:Math.max(0,bondDelta),strain:Math.max(0,-bondDelta)};
    if(bondDelta>=2)delta.trust=1;
    if(choice.effects?.reliability>0||lower.includes('promise')||lower.includes('honest'))delta.trust=(delta.trust||0)+1;
    if(choice.effects?.kindness>0||lower.includes('help')||lower.includes('support'))delta.warmth=(delta.warmth||0)+1;
    if(choice.effects?.courage>0||choice.effects?.intellect>0)delta.respect=1;
    if(lower.includes('joke'))delta.warmth=(delta.warmth||0)+1;
    if(lower.includes('argue')||lower.includes('mock')||lower.includes('dismiss'))delta.strain=(delta.strain||0)+2;
    adjustSocialMemory(npcId,delta,text,bondDelta<0?'conflict':'choice');
    spreadJealousy(npcId,bondDelta);
  }

  const baseResetGame=resetGame;
  resetGame=function(){baseResetGame();ensureSocialMemoryState();};
  const baseLoadGame=loadGame;
  loadGame=function(){const loaded=baseLoadGame();if(loaded)ensureSocialMemoryState();return loaded;};
  const baseCloseDialogue=closeDialogue;
  closeDialogue=function(choiceIndex=0){
    const choice=game.dialogue?.choices?.[choiceIndex]||null;
    inferMemoryFromChoice(choice);
    return baseCloseDialogue(choiceIndex);
  };

  function contextLine(npc,memory){
    const slot=currentSlot();
    if(slot?.id==='lunch')return `${npc.name} has settled with their usual lunch group, but makes space for you.`;
    if(slot?.id==='club'&&npc.clique===clubConfig().name)return `${npc.name} is watching how you contribute when nobody is keeping score.`;
    if(memory.strain>=4)return `${npc.name} is polite, but the unresolved tension is obvious.`;
    if(memory.jealousy>=5)return `${npc.name} glances toward the friends you have been spending time with.`;
    if(memory.trust>=8)return `${npc.name} lowers their voice; this is not a conversation they would have with everyone.`;
    return `${npc.name} reacts to the rhythm of the school day around you.`;
  }
  function triggerPromiseRepair(npc,promise){
    const memory=socialMemoryFor(npc.id);memory.lastConflictDay=socialDayKey();
    openDialogue({speaker:`${npc.name} • Broken Promise`,portrait:npc.portrait,text:`You promised to ${promise.label.toLowerCase()}, but the moment passed without you. ${npc.name} remembers.\n\n“Were you going to say anything?”`,choices:[
      {text:'Own it and repair the damage now.',relationship:[npc.id,1],effects:{kindness:1,reliability:1,score:-2},memory:{npcId:npc.id,delta:{trust:1,respect:1,strain:-2},text:'You admitted missing a promise and made a sincere repair.',type:'reconciliation',promiseResolution:'repaired'},result:'The disappointment does not vanish, but honesty gives the friendship somewhere to go.'},
      {text:'Ask to reschedule and set a clear time.',effects:{reliability:1,stress:1},memory:{npcId:npc.id,delta:{respect:1,strain:-1},text:'You rescheduled a missed promise with a clear plan.',type:'reconciliation',promiseResolution:'rescheduled'},result:'“All right. One more chance—but write it down this time.”'},
      {text:'Make an excuse and move on.',relationship:[npc.id,-2],effects:{score:-5},memory:{npcId:npc.id,delta:{trust:-2,respect:-2,strain:3},text:'You dismissed the impact of a broken promise.',type:'conflict',promiseResolution:'broken'},result:`${npc.name} stops arguing. That silence feels worse.`}
    ]});
  }
  function triggerReconciliation(npc){
    const memory=socialMemoryFor(npc.id);memory.lastConflictDay=socialDayKey();
    openDialogue({speaker:`${npc.name} • Unresolved Tension`,portrait:npc.portrait,text:`${contextLine(npc,memory)}\n\n“There is something between us that we keep pretending is not there.”`,choices:[
      {text:'Listen without interrupting.',relationship:[npc.id,2],effects:{kindness:1,stress:1},memory:{npcId:npc.id,delta:{trust:2,warmth:1,strain:-3},text:'You listened through an uncomfortable reconciliation.',type:'reconciliation'},result:'The conversation is awkward, specific, and finally honest.'},
      {text:'Explain your side and accept your part.',relationship:[npc.id,1],effects:{courage:1,reliability:1},memory:{npcId:npc.id,delta:{trust:1,respect:2,strain:-2},text:'You explained yourself without avoiding responsibility.',type:'reconciliation'},result:'You do not agree on everything, but the conflict stops controlling the friendship.'},
      {text:'Deflect the issue with a joke.',relationship:[npc.id,-1],effects:{charisma:1,score:-3},memory:{npcId:npc.id,delta:{trust:-1,respect:-1,strain:2},text:'You avoided a needed conversation.',type:'conflict'},result:`${npc.name} does not laugh this time.`}
    ]});
  }

  const baseTriggerNpcTalk=triggerNpcTalk;
  triggerNpcTalk=function(npc){
    ensureSocialMemoryState();
    const memory=socialMemoryFor(npc.id),promise=pendingPromise(npc.id);
    if(promise&&schoolDayOrdinal()>promise.due){triggerPromiseRepair(npc,promise);return;}
    if(memory.strain>=4&&memory.lastConflictDay!==socialDayKey()){triggerReconciliation(npc);return;}
    const moment=typeof nextFriendshipMoment==='function'?nextFriendshipMoment(npc):null;
    const rival=typeof nextRivalryScene==='function'?nextRivalryScene(npc):null;
    const route=typeof nextRouteScene==='function'?nextRouteScene(npc):null;
    if(moment||rival||route){baseTriggerNpcTalk(npc);return;}

    const already=game.dayFlags.talked.includes(npc.id);
    const rel=game.player.relationships[npc.id]||0;
    let greeting=npc.greetings[(game.day+Math.floor(rel/2))%npc.greetings.length];
    greeting+=`\n\n${contextLine(npc,memory)}\nMood: ${socialMood(memory)} • ${socialSummary(npc.id)}.`;
    const choices=[];
    if(promise){
      choices.push({text:'Follow through on your promise.',relationship:[npc.id,3],effects:{kindness:1,reliability:1,score:8,help:already?0:1},memory:{npcId:npc.id,delta:{trust:3,respect:2,warmth:2,strain:-1},text:'You followed through on a specific promise.',type:'promise',promiseResolution:'fulfilled',spreadJealousy:3},result:`You help ${npc.name} exactly as promised. Reliability turns a friendly gesture into a lasting memory.`});
    }else{
      choices.push({text:`Ask what ${npc.clique} needs today.`,relationship:[npc.id,1],effects:{intellect:1,score:already?1:4},memory:{npcId:npc.id,delta:{respect:1,warmth:1},text:`You showed genuine interest in ${npc.clique}.`,type:'interest',spreadJealousy:1},result:`${npc.name}: “${cliqueAdvice(npc.clique)}”`});
    }
    choices.push({text:promise?'Check how they have really been feeling.':'Promise to help after class.',relationship:[npc.id,promise?2:1],effects:promise?{kindness:1,score:already?2:5}:{reliability:1,score:already?1:3},memory:promise?{npcId:npc.id,delta:{trust:2,warmth:2,strain:-1},text:'You made space for an honest personal check-in.',type:'confidence',spreadJealousy:2}:{npcId:npc.id,delta:{trust:1,respect:1},text:'You made a concrete promise to help after class.',type:'promise',promise:'create'},result:promise?`${npc.name} answers more honestly than usual.`:`${npc.name} accepts. The promise now matters more than the initial offer.`});
    choices.push({text:'Share something personal too.',relationship:[npc.id,2],effects:{courage:1,stress:-1,score:already?1:5},memory:{npcId:npc.id,delta:{trust:2,warmth:2},text:'You trusted them with something personal.',type:'confidence',spreadJealousy:2},result:`The conversation becomes mutual instead of transactional. ${npc.name} remembers that.`});
    choices.push({text:'Review your connection.',action:()=>openSocialProfile(npc),result:'You pause to consider what this friendship has actually become.'});
    if(!already){game.dayFlags.talked.push(npc.id);progressMission('talk',1);if(typeof sameLadder==='function'&&sameLadder(npc))adjustRivalry(npc.id,1,0);}
    openDialogue({speaker:npc.name,portrait:npc.portrait,text:`${greeting}\n\n${npc.bio}`,choices});
  };

  const baseShowMorningBrief=showMorningBrief;
  showMorningBrief=function(){
    ensureSocialMemoryState();
    const overdue=game.player.socialPromises.filter(item=>item.status==='pending'&&schoolDayOrdinal()>item.due);
    if(overdue.length)notify(`${overdue.length} promise${overdue.length===1?' needs':'s need'} your attention.`,COLORS.rose);
    return baseShowMorningBrief();
  };

  window.SakuraSocialMemoryV19={
    version:'1.9.0',ensure:ensureSocialMemoryState,summary:socialSummary,
    mood:npcId=>socialMood(socialMemoryFor(npcId)),profile:npcId=>({...socialMemoryFor(npcId)}),
    promises:()=>{ensureSocialMemoryState();return game.player.socialPromises.map(item=>({...item}));},
    validate(){
      ensureSocialMemoryState();const issues=[];
      for(const npc of NPCS){const memory=socialMemoryFor(npc.id);for(const field of SOCIAL_FIELDS)if(!Number.isFinite(memory[field])||memory[field]<0||memory[field]>20)issues.push(`${npc.id}.${field} is invalid`);}
      return {valid:issues.length===0,issues,npcs:NPCS.length,promises:game.player.socialPromises.length};
    }
  };
  ensureSocialMemoryState();
})();
