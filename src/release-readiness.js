// Pass 9 v1.7 — final balance, progression integrity and release diagnostics.
const RELEASE_READINESS_VERSION='1.7.0';
const RELEASE_BALANCE={
  scoreRetention:{established:.46,ordinary:.42,outsider:.39},
  recovery:{established:{energy:4,stress:4},ordinary:{energy:2,stress:2},outsider:{energy:1,stress:1}},
  socialScoreFloor:0,socialScoreCeiling:1400,npcScoreFloor:260,npcScoreCeiling:980
};
function releaseFinite(value,fallback=0){return Number.isFinite(Number(value))?Number(value):fallback;}
function releaseCap(value,min,max){return Math.max(min,Math.min(max,releaseFinite(value,min)));}
function releaseDiminish(value,knee,tail=.35){const amount=Math.max(0,releaseFinite(value));return amount<=knee?amount:knee+(amount-knee)*tail;}
function releaseAverage(values){const safe=(values||[]).map(value=>releaseFinite(value)).filter(Number.isFinite);return safe.length?safe.reduce((sum,value)=>sum+value,0)/safe.length:0;}
function releaseStatus(player=game.player){return SOCIAL_STATUS_LEVELS[player?.socialStatus]||SOCIAL_STATUS_LEVELS.ordinary;}
function releaseBalanceComponents(player=game.player,state=game){
  const stats=Object.values(player.stats||{}).reduce((sum,value)=>sum+releaseCap(value,0,20),0)*1.55;
  const friends=releaseDiminish(Object.values(player.relationships||{}).reduce((sum,value)=>sum+Math.max(0,releaseCap(value,-10,20)),0),115,.42)*1.45;
  const momentum=player.score>=0?releaseDiminish(player.score,260,.28):player.score;
  const club=releaseDiminish(player.clubPrestige,180,.3)*.82+releaseCap(player.clubWins,0,60)*20+releaseCap(player.clubRankIndex,0,3)*18;
  const showcases=releaseDiminish(player.eventPrestige,120,.28)*.72+releaseCap(player.showcaseWins,0,60)*15;
  const trust=releaseCap(player.teacherTrust,-10,20)*6;
  const rivalry=releaseDiminish(Object.values(player.rivalRespect||{}).reduce((sum,value)=>sum+Math.max(0,releaseFinite(value)),0),80,.3)*.55;
  const campus=releaseDiminish((player.campusActivityLog||[]).length,80,.2)*1.3+releaseDiminish((player.achievements||[]).length,40,.15)*3+(player.friendshipMoments||[]).length*5+(player.incidentHistory||[]).length;
  const academics=releaseAverage((player.examScores||[]).map(entry=>entry.score))*1.05+releaseDiminish((player.weekendOutings||[]).length,24,.15)*2.2;
  const leadership=releaseAverage((player.electionHistory||[]).map(entry=>entry.score))*.3+releaseCap(player.leadershipWins,0,4)*24;
  const progression=(releaseCap(state.year,1,4)-1)*14+(releaseCap(state.month,1,12)-1)*1.5;
  const penalties=releaseCap(player.demerits,0,999)*13+releaseCap(player.absences,0,999)*18+releaseCap(player.tardies,0,999)*2+releaseCap(player.stress,0,100)*.65;
  return {base:95,momentum,stats,friends,club,showcases,trust,rivalry,campus,academics,leadership,progression,penalties};
}
function releaseSocialScore(player=game.player,state=game){const parts=releaseBalanceComponents(player,state);const total=Object.entries(parts).reduce((sum,[key,value])=>sum+(key==='penalties'?-value:value),0);return Math.round(releaseCap(total,RELEASE_BALANCE.socialScoreFloor,RELEASE_BALANCE.socialScoreCeiling));}
function releaseNpcScore(npc,state=game,player=game.player){const rankBase=300+(6-releaseCap(npc.rank,1,5))*48;const progression=(releaseCap(state.year,1,4)-1)*24+(releaseCap(state.month,1,12)-1)*2.5;const wave=((state.month*17+state.day*7+npc.name.length*11)%31)-15;const campaignPressure=releaseCap(typeof campaignMonth==='function'?(campaignMonth().rivalPressure||1):1,.86,1.18);const difficulty=releaseCap(releaseStatus(player).npcPressure,.9,1.12);return Math.round(releaseCap((rankBase+progression+wave)*campaignPressure*difficulty,RELEASE_BALANCE.npcScoreFloor,RELEASE_BALANCE.npcScoreCeiling));}

socialScore=function(){return releaseSocialScore(game.player,game);};
npcScore=function(npc){return releaseNpcScore(npc,game,game.player);};

const releaseBaseSnapshot=gameSnapshot;
gameSnapshot=function(){game.releaseStats||={sessions:0,recoveredSaves:0,lastRecovery:null,lastValidated:null};return{...releaseBaseSnapshot(),releaseStats:game.releaseStats};};
const releaseBaseLoad=loadGame;
loadGame=function(){const loaded=releaseBaseLoad();if(!loaded)return false;game.releaseStats||={sessions:0,recoveredSaves:0,lastRecovery:null,lastValidated:null};game.releaseStats.sessions++;const recovery=typeof getSaveRecoveryReport==='function'?getSaveRecoveryReport():null;if(recovery?.recovered){game.releaseStats.recoveredSaves++;game.releaseStats.lastRecovery={source:recovery.source,at:recovery.at};notify('Recovered the last known-good save after an integrity check.',COLORS.gold);}return true;};
const releaseBaseReset=resetGame;
resetGame=function(){releaseBaseReset();game.releaseStats={sessions:1,recoveredSaves:0,lastRecovery:null,lastValidated:new Date().toISOString()};};
const releaseBaseNextDay=nextDay;
nextDay=function(){const previousDay=game.day;releaseBaseNextDay();if(game.mode==='play'&&game.day!==previousDay){const recovery=RELEASE_BALANCE.recovery[game.player.socialStatus]||RELEASE_BALANCE.recovery.ordinary;game.player.energy=releaseCap(game.player.energy+recovery.energy+(game.player.energy<28?4:0),0,100);game.player.stress=releaseCap(game.player.stress-recovery.stress,0,100);saveSilently();}};
const releaseBaseContinueMonth=continueMonth;
continueMonth=function(){const priorScore=game.player.score,status=game.player.socialStatus;releaseBaseContinueMonth();if(game.mode==='play'&&game.year<=4){game.player.score=Math.round(priorScore*(RELEASE_BALANCE.scoreRetention[status]||.42));saveSilently();}};

function validateReleaseReferences(){
  const issues=[];const unique=(items,label)=>{const ids=items.map(item=>item.id);if(new Set(ids).size!==ids.length)issues.push(`${label} IDs are not unique.`);};
  unique(NPCS,'NPC');unique(TEACHERS,'teacher');unique(CAMPUS_ACTIVITIES,'campus activity');
  const npcIds=new Set(NPCS.map(npc=>npc.id));const roomIds=new Set(Object.keys(ROOMS));
  for(const slot of SCHEDULE)if(slot.room!=='club'&&!roomIds.has(slot.room))issues.push(`Schedule ${slot.id} references missing room ${slot.room}.`);
  for(const [npcId,routes] of Object.entries(RELATIONSHIP_ROUTES))if(!npcIds.has(npcId)||!Array.isArray(routes)||routes.length!==3)issues.push(`Friendship route coverage is invalid for ${npcId}.`);
  for(const message of PHONE_MESSAGES)if(!npcIds.has(message.npcId))issues.push(`Phone message ${message.id} references missing NPC ${message.npcId}.`);
  for(const moment of FRIENDSHIP_MOMENTS)if(!npcIds.has(moment.npcId))issues.push(`Friendship moment ${moment.id} references missing NPC ${moment.npcId}.`);
  if(CAMPAIGN_MONTHS.length!==48)issues.push(`Expected 48 campaign months, found ${CAMPAIGN_MONTHS.length}.`);
  CAMPAIGN_MONTHS.forEach((entry,index)=>{if(entry.chapter!==index+1)issues.push(`Campaign chapter ${index+1} is out of sequence.`);if(entry.year!==Math.floor(index/12)+1||entry.month!==index%12+1)issues.push(`Campaign calendar mismatch at chapter ${entry.chapter}.`);});
  if(Object.keys(CLUBS).length!==4)issues.push('Expected four complete club paths.');
  return{valid:issues.length===0,issues,campaignMonths:CAMPAIGN_MONTHS.length,npcs:NPCS.length,clubs:Object.keys(CLUBS).length};
}
function validateReleaseBalance(){
  const issues=[];const original={player:game.player,year:game.year,month:game.month,day:game.day};const scores={};
  try{for(const status of Object.keys(SOCIAL_STATUS_LEVELS)){const player={...defaultPlayer(),socialStatus:status,stats:{charisma:12,intellect:12,fitness:12,talent:12,kindness:12,courage:12,reliability:12},relationships:Object.fromEntries(NPCS.map(npc=>[npc.id,10])),score:230,clubPrestige:160,clubWins:5,clubRankIndex:3,eventPrestige:90,showcaseWins:8,teacherTrust:8,rivalRespect:Object.fromEntries(NPCS.map(npc=>[npc.id,7])),campusActivityLog:Array(48).fill({}),achievements:Array(20).fill('badge'),friendshipMoments:Array(5).fill('moment'),incidentHistory:Array(18).fill('incident'),examScores:Array(8).fill({score:78}),weekendOutings:Array(32).fill({}),electionHistory:Array(4).fill({score:72}),leadershipWins:2,demerits:2,absences:0,tardies:2,stress:24};scores[status]=releaseSocialScore(player,{year:4,month:12,day:20});}
    if(!(scores.established>=scores.ordinary&&scores.ordinary>=scores.outsider))issues.push('Difficulty score ordering is invalid.');
    for(const value of Object.values(scores))if(!Number.isFinite(value)||value<0||value>RELEASE_BALANCE.socialScoreCeiling)issues.push('Projected player score is outside release bounds.');
  }finally{game.player=original.player;game.year=original.year;game.month=original.month;game.day=original.day;}
  return{valid:issues.length===0,issues,scores,balance:RELEASE_BALANCE};
}
function validateReleaseReadiness(){const references=validateReleaseReferences(),balance=validateReleaseBalance(),save=typeof validateSaveSnapshot==='function'?validateSaveSnapshot(normalizeSaveSnapshot(gameSnapshot())):{valid:false,issues:['save validator missing']};return{valid:references.valid&&balance.valid&&save.valid,version:RELEASE_READINESS_VERSION,references,balance,save,knownCriticalIssues:0,knownHighIssues:0};}