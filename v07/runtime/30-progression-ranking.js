function advanceTime(mins){game.time=Math.min(900,game.time+mins);checkSchedule();if(game.time>=900&&!game.dialogue)setTimeout(endDay,80);}
function maybeTriggerEvent(){
  if(game.dayFlags.event||game.dialogue||game.overlay)return;
  if(game.time<625||game.time>870)return;
  const scripted={1:'rumor',2:'fire_drill',3:'rain_leak',4:'queue',5:'mascot'};
  const id=scripted[game.day];
  let event=null;
  if(id==='queue') event=BULLY_ENCOUNTERS[0];
  else if(id) event=RANDOM_EVENTS.find(e=>e.id===id);
  else if(Math.random()<0.0025*statusConfig().rumorRisk){
    const pool=[...RANDOM_EVENTS.filter(e=>game.day>=e.minDay),...BULLY_ENCOUNTERS];event=pool[Math.floor(Math.random()*pool.length)];
  }
  if(!event)return;
  game.dayFlags.event=true;
  openDialogue({speaker:event.title||'Hallway Situation',scene:event.scene??null,text:event.intro,choices:event.choices.map(c=>({...c,achievement:event.title||'Helped resolve a school conflict'}))});
}

function endDay(){
  if(game.overlay||game.mode!=='play')return;
  if(game.day>=20&&!showcaseRecord()){startMonthlyShowcase('Month finale');return;}
  if(game.player.detention>0){game.player.energy=Math.max(0,game.player.energy-12);game.player.stress=clamp(game.player.stress+5,0,100);game.player.detention--;game.player.score-=3;}
  const missionScore=game.missions.filter(m=>m.done).reduce((s,m)=>s+m.reward,0);
  const rank=getPlayerRank(game.player.gender);
  saveSilently();
  game.overlay={type:'dayEnd',title:`Day ${game.day} Complete`,lines:[
    `Current ${game.player.gender==='boy'?'Boys':'Girls'} Rank: #${rank.position}`,
    `Social status: ${statusConfig().name} (${statusConfig().difficulty})`,
    `${clubConfig().name}: ${currentClubRank()} • ${game.player.clubXP} XP`,
    `Standing: ${rank.score} points`,
    `Daily missions completed: ${game.missions.filter(m=>m.done).length}/${game.missions.length}`,
    `Conduct: ${game.player.tardies} tardies • ${game.player.demerits} demerits`,
    `Energy ${Math.round(game.player.energy)} • Stress ${Math.round(game.player.stress)}`,
    `Campus sessions ${game.player.campusActivityLog.length} • Badges ${game.player.achievements.length}/${ACHIEVEMENTS.length}`
  ],missionScore};
}
function nextDay(){
  game.overlay=null;
  if(game.day>=20){finalizeMonth();return;}
  game.day++;game.time=470;game.scheduleStatus={};game.dayFlags={talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false,message:false,showcase:false,activity:false};game.dailyBrief=null;
  game.player.energy=clamp(game.player.energy+28,0,100);game.player.stress=clamp(game.player.stress-18,0,100);
  assignMissions();game.player.x=220;game.player.y=350;game.lastSlot=null;relocateNPCs('arrival');saveSilently();setTimeout(showMorningBrief,120);
}
function finalizeMonth(){
  reviewClubMonth();
  const boys=getRanking('boy'),girls=getRanking('girl');
  const playerRank=getPlayerRank(game.player.gender);
  game.player.monthlyScores.push({year:game.year,month:game.month,rank:playerRank.position,score:playerRank.score,cleanRecord:game.player.demerits===0&&game.player.absences===0});
  updateRivalriesAfterMonth(game.player.gender==='boy'?boys:girls);checkAchievements();
  const special=MONTHLY_SPECIALS[(game.month-1)%12];
  game.overlay={type:'monthEnd',title:`Chapter ${campaignMonth().chapter} Rankings Finalized`,boys,girls,special,campaign:campaignMonth(),playerRank};
  saveSilently();
}

function reviewClubMonth(){
  const club=clubConfig();
  const special=MONTHLY_SPECIALS[(game.month-1)%12];
  const attendance=game.player.clubAttendance;
  const challengeScores=game.player.monthlyChallengeScores.filter(entry=>entry.year===game.year&&entry.month===game.month&&entry.club===game.player.club).map(entry=>entry.score);
  const challengeAverage=challengeScores.length?Math.round(challengeScores.reduce((a,b)=>a+b,0)/challengeScores.length):0;
  let xp=attendance>=12?28:attendance>=7?16:attendance>=3?8:0;
  if(challengeAverage>=85)xp+=22;else if(challengeAverage>=70)xp+=14;else if(challengeAverage>=50)xp+=7;
  if(special.event.toLowerCase().includes('club')||special.event.toLowerCase().includes('festival'))xp+=12;
  if(xp){awardClubXP(xp,`${club.name} monthly review`);game.player.score+=statusScore(Math.round(xp*.7));}
  if(attendance>=10&&game.player.stats[club.stat]>=7+game.year&&challengeAverage>=55){
    game.player.clubWins++;game.player.clubPrestige+=20;game.player.score+=statusScore(30);
    game.player.accomplishments.push({day:20,month:game.month,year:game.year,text:`Helped ${club.name} succeed at ${club.competitions[Math.min(3,game.year-1)]}`});
  }
  game.player.clubAttendance=0;
}

function continueMonth(){
  game.overlay=null;
  if(game.month===12){game.month=1;game.year++;}else game.month++;
  if(game.year>4){finishProm();return;}
  game.day=1;game.time=470;game.player.score=Math.round(game.player.score*.42);game.player.tardies=0;game.player.absences=0;
  game.player.demerits=Math.max(0,game.player.demerits-1);game.scheduleStatus={};game.dayFlags={talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false,message:false,showcase:false,activity:false};game.dailyBrief=null;
  assignMissions();game.player.x=220;game.player.y=350;game.lastSlot=null;relocateNPCs('arrival');saveSilently();setTimeout(showMonthIntro,120);
}
function finishProm(){
  const avg=game.player.monthlyScores.reduce((s,m)=>s+m.rank,0)/Math.max(1,game.player.monthlyScores.length);
  const crown=avg<=2.2&&game.player.demerits<8;
  game.finished=true;game.mode='prom';game.overlay=null;
  const closest=NPCS.slice().sort((a,b)=>(game.player.relationships[b.id]||0)-(game.player.relationships[a.id]||0))[0];
  game.promCompanion=closest?.name||'your friends';
  game.promResult=crown?`You are crowned Prom ${game.player.gender==='boy'?'King':'Queen'}! ${game.promCompanion} is the first person to reach you.`:`You do not take the crown—but ${game.promCompanion} starts a cheer that fills the hall.`;
  checkAchievements();saveSilently();
}
function saveSilently(){writeSave(localStorage,gameSnapshot());}

function socialScore(){
  const s=game.player.stats;
  const statScore=Object.values(s).reduce((a,b)=>a+b,0)*2;
  const friends=Object.values(game.player.relationships).reduce((a,b)=>a+Math.max(0,b),0)*3;
  const club=game.player.clubPrestige*1.4+game.player.clubWins*35+game.player.clubRankIndex*22;
  const showcases=game.player.eventPrestige*1.2+game.player.showcaseWins*24;
  const trust=game.player.teacherTrust*8;
  const rivalry=Object.values(game.player.rivalRespect||{}).reduce((a,b)=>a+b,0)*.8;
  const campus=(game.player.campusActivityLog||[]).length*1.5+(game.player.achievements||[]).length*3;
  return Math.round(100+game.player.score+statScore+friends+club+showcases+trust+rivalry+campus-game.player.demerits*10-game.player.absences*14-game.player.stress*.5);
}
function npcScore(npc){
  const base=310+(6-npc.rank)*45;
  const monthWave=((game.month*17+game.day*7+npc.name.length*11)%41)-20;
  return Math.round((base+monthWave+game.year*18)*statusConfig().npcPressure*campaignMonth().rivalPressure);
}
function getRanking(gender){
  const list=game.npcs.filter(n=>n.gender===gender).map(n=>({id:n.id,name:n.name,score:npcScore(n),player:false,portrait:n.portrait}));
  if(game.player.gender===gender)list.push({id:'player',name:game.player.name,score:socialScore(),player:true,portrait:game.player.gender==='boy'?0:1});
  list.sort((a,b)=>b.score-a.score);return list.map((e,i)=>({...e,position:i+1}));
}
function getPlayerRank(gender){return getRanking(gender).find(r=>r.player)||{position:6,score:socialScore()};}
