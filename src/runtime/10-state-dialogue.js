function resetGame(){
  game.player=defaultPlayer();game.year=1;game.month=1;game.day=1;game.time=470;
  game.scheduleStatus={};game.dayFlags={talked:[],hotspots:[],help:0,club:0,ontime:0,event:false};
  game.npcs=JSON.parse(JSON.stringify(NPCS));game.teachers=JSON.parse(JSON.stringify(TEACHERS));
  game.finished=false;assignMissions();relocateNPCs('arrival');
  ensureSocialMemoryState();
}

function saveGame(){
  const data={player:game.player,year:game.year,month:game.month,day:game.day,time:game.time,
    scheduleStatus:game.scheduleStatus,dayFlags:game.dayFlags,missions:game.missions,npcs:game.npcs,finished:game.finished};
  writeSave(localStorage,data);
  notify('Game saved',COLORS.mint);
}
function loadGame(){
  try{
    const d=readSave(localStorage); if(!d)return false;
    Object.assign(game,d);game.mode='play';game.dialogue=null;game.overlay=null;
    game.player.socialStatus ||= 'ordinary'; game.player.teacherTrust ??= 0; game.player.invitations ||= [];
    game.player.clubXP ??= 0; game.player.clubRankIndex ??= 0; game.player.clubPrestige ??= 0;
    game.player.clubWins ??= 0; game.player.clubAttendance ??= 0;
    ensureSocialMemoryState();expirePromises();
    relocateNPCs(currentSlot()?.id||'arrival');return true;
  }catch(e){console.warn(e);return false;}
}

function assignMissions(){
  const base=(game.day-1)%DAILY_MISSIONS.length;
  game.missions=[0,1,2].map(i=>({...DAILY_MISSIONS[(base+i)%DAILY_MISSIONS.length],progress:0,done:false}));
}
function progressMission(type, amount=1){
  game.dayFlags[type]=(game.dayFlags[type]||0)+amount;
  for(const m of game.missions){
    if(m.type===type&&!m.done){m.progress=Math.min(m.goal,m.progress+amount);if(m.progress>=m.goal){m.done=true;game.player.score+=m.reward;notify(`Mission complete: ${m.title} +${m.reward}`,COLORS.gold);audio.good();}}
  }
}

function notify(text,color=COLORS.paper){
  game.notifications.push({text,color,life:4});
  if(game.notifications.length>5)game.notifications.shift();
}

function formatTime(min){const h=Math.floor(min/60),m=Math.floor(min%60);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
function currentSlot(){return SCHEDULE.find(s=>game.time>=s.start&&game.time<s.end)||null;}
function nextSlot(){return SCHEDULE.find(s=>s.start>game.time)||null;}
function roomForSlot(slot){return slot?.room==='club'?CLUBS[game.player.club].room:slot?.room;}
function pointInRoom(x,y,roomId){const r=ROOMS[roomId];return !!r&&x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;}
function getRoomAt(x,y){for(const [id,r] of Object.entries(ROOMS))if(pointInRoom(x,y,id))return id;return 'outside';}

function statusConfig(){return SOCIAL_STATUS_LEVELS[game.player.socialStatus]||SOCIAL_STATUS_LEVELS.ordinary;}
function clubConfig(){return CLUBS[game.player.club]||CLUBS.council;}
function clubThresholds(){
  const modifier=statusConfig().clubThresholdModifier||0;
  return [0,Math.max(20,45+modifier),Math.max(85,125+modifier),Math.max(185,245+modifier)];
}
function currentClubRank(){return clubConfig().ranks[game.player.clubRankIndex]||clubConfig().ranks[0];}
function awardClubXP(amount,reason='Club contribution'){
  const before=game.player.clubRankIndex;
  game.player.clubXP=Math.max(0,game.player.clubXP+amount);
  const thresholds=clubThresholds();
  let rank=0;for(let i=1;i<thresholds.length;i++)if(game.player.clubXP>=thresholds[i])rank=i;
  game.player.clubRankIndex=Math.max(game.player.clubRankIndex,rank);
  game.player.clubPrestige+=Math.max(1,Math.round(amount/4));
  if(reason)game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:reason});
  if(game.player.clubRankIndex>before){
    game.player.score+=18+game.player.clubRankIndex*6;
    notify(`${clubConfig().name}: promoted to ${currentClubRank()}!`,COLORS.gold);audio.good();
  }
}
function initializeSocialStatus(){
  const status=statusConfig();
  game.player.score=status.startScore;
  game.player.teacherTrust=status.teacherTrust;
  for(const id of Object.keys(game.player.relationships))game.player.relationships[id]=status.relationshipBase;
  if(game.player.socialStatus==='established'){
    game.player.invitations.push('Welcome Committee Breakfast');
    game.player.stats.charisma+=1;game.player.stats.reliability+=1;
  }else if(game.player.socialStatus==='outsider'){
    game.player.stats.courage+=1;game.player.stress=8;
  }
}
function statusScore(value){
  const cfg=statusConfig();
  return Math.round(value*(value>=0?cfg.positiveScoreMultiplier:cfg.negativeScoreMultiplier));
}

function applyEffects(effects={}, source=''){
  for(const [k,v] of Object.entries(effects)){
    if(k==='score') game.player.score+=statusScore(v);
    else if(k==='stress') game.player.stress=clamp(game.player.stress+v,0,100);
    else if(k==='energy') game.player.energy=clamp(game.player.energy+v,0,100);
    else if(k==='demerits') game.player.demerits=Math.max(0,game.player.demerits+v);
    else if(k==='help') progressMission('help',v);
    else if(game.player.stats[k]!==undefined) game.player.stats[k]=clamp(game.player.stats[k]+v,0,20);
  }
  if(source) game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:source});
}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function choiceLabel(i){return ['1','2','3','4'][i]||'?';}

function openDialogue({speaker='Narrator',portrait=null,text,choices=[],onClose=null}){
  game.dialogue={speaker,portrait,text,choices,onClose,reveal:0,selected:0,opened:performance.now()};
  audio.click();
}
function closeDialogue(choiceIndex=0){
  const d=game.dialogue;if(!d)return;
  const choice=d.choices?.[choiceIndex];
  if(choice){
    if(choice.effects)applyEffects(choice.effects,choice.achievement||'');
    if(choice.relationship){
      const [id,delta]=choice.relationship;game.player.relationships[id]=clamp((game.player.relationships[id]||0)+delta,-10,20);
    }
    applyChoiceMemory(d,choice);
    expirePromises();
    const action=choice.action;
    const result=choice.result;
    const after=d.onClose; game.dialogue=null;
    if(result) setTimeout(()=>openDialogue({speaker:choice.resultSpeaker||d.speaker,portrait:d.portrait,text:result,choices:[{text:'Continue',action:()=>{if(action)action();if(after)after();}}]}),30);
    else {if(action)action();if(after)after();}
  }else{const after=d.onClose;game.dialogue=null;if(after)after();}
}
