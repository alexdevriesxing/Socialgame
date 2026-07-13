function ensureV7State(){
  game.player.rivalScenes ||= [];
  game.player.rivalRespect ||= Object.fromEntries(NPCS.map(n=>[n.id,0]));
  game.player.rivalHeat ||= Object.fromEntries(NPCS.map(n=>[n.id,0]));
  game.player.campusActivityLog ||= [];
  game.player.campusMastery ||= Object.fromEntries(CAMPUS_ACTIVITIES.map(a=>[a.id,0]));
  game.player.achievements ||= [];
  game.player.achievementDates ||= {};
  game.player.onTimeClasses ??= 0;
  game.dayFlags ||= {};
  game.dayFlags.activity ??= false;
}
function campaignIndex(){return (game.year-1)*12+game.month;}
function sameLadder(npc){return npc?.gender===game.player.gender;}
function rivalSceneCount(id){ensureV7State();return game.player.rivalScenes.filter(sceneId=>sceneId.startsWith(`${id}-rival-`)).length;}
function rivalryTier(value){return value>=20?'Trusted Rival':value>=12?'Respected Challenger':value>=6?'Competitive Peer':value>=1?'On the Radar':'Unproven';}
function adjustRivalry(id,respect=0,heat=0){
  ensureV7State();
  game.player.rivalRespect[id]=clamp((game.player.rivalRespect[id]||0)+respect,0,30);
  game.player.rivalHeat[id]=clamp((game.player.rivalHeat[id]||0)+heat,0,30);
}
function nextRivalryScene(npc){
  ensureV7State();
  if(!sameLadder(npc))return null;
  return (RIVALRY_ARCS[npc.id]||[]).find(scene=>!game.player.rivalScenes.includes(scene.id)&&campaignIndex()>=scene.minMonth&&(game.player.rivalRespect[npc.id]||0)>=scene.minRespect)||null;
}
function triggerRivalryScene(npc,scene){
  openDialogue({speaker:`Rivalry • ${npc.name}`,portrait:npc.portrait,scene:scene.scene,atlas:'rival_atlas',text:scene.text,choices:scene.choices.map(choice=>({
    text:choice.text,effects:choice.effects,result:choice.result,achievement:`Rivalry: ${npc.name} — ${scene.title}`,
    action:()=>{
      if(!game.player.rivalScenes.includes(scene.id))game.player.rivalScenes.push(scene.id);
      adjustRivalry(npc.id,choice.respect||1,-2);
      game.player.relationships[npc.id]=clamp((game.player.relationships[npc.id]||0)+1,-10,20);
      notify(`${npc.name}: ${rivalryTier(game.player.rivalRespect[npc.id])}`,COLORS.gold);audio.sparkle();checkAchievements();saveSilently();
    }
  }))});
}
function currentLadderRivals(){
  ensureV7State();
  const ranking=getRanking(game.player.gender);
  return NPCS.filter(sameLadder).map(npc=>{
    const entry=ranking.find(r=>r.id===npc.id)||{position:6,score:npcScore(npc)};
    return {...npc,position:entry.position,score:entry.score,respect:game.player.rivalRespect[npc.id]||0,heat:game.player.rivalHeat[npc.id]||0,scenes:rivalSceneCount(npc.id)};
  }).sort((a,b)=>a.position-b.position);
}
function openRivalBoard(){ensureV7State();game.overlay={type:'rivals',title:'Rivalry Board'};}
function updateRivalriesAfterMonth(rankings){
  ensureV7State();
  const player=rankings.find(r=>r.player);if(!player)return;
  for(const rival of currentLadderRivals()){
    const gap=Math.abs(player.position-rival.position);
    const heat=Math.max(0,5-gap*2);
    adjustRivalry(rival.id,player.position<=rival.position?1:0,heat);
  }
  checkAchievements();
}
function campusOptions(){
  ensureV7State();const seed=game.year*401+game.month*47+game.day*13;
  return [0,1,2].map(i=>CAMPUS_ACTIVITIES[(seed+i*3+i*i)%CAMPUS_ACTIVITIES.length]);
}
function campusActivityAvailable(){const slot=currentSlot();return slot?.id==='free'&&game.time<=884&&!game.dayFlags.activity;}
function openCampusPlanner(){ensureV7State();game.overlay={type:'campus',title:'After-School Planner',options:campusOptions()};}
function activityPartner(activity){
  const map={intellect:['emi','sora','kenji'],kindness:['hana','aiko'],fitness:['mina','ren'],talent:['rina','haru'],charisma:['daichi','aiko'],reliability:['aiko','hana'],courage:['sora','mina']};
  const ids=map[activity.stat]||['hana'];return ids[(game.day+game.month)%ids.length];
}
function performCampusActivity(activity){
  ensureV7State();
  if(!campusActivityAvailable()){notify('Campus activities are available at the start of Free Period.',COLORS.rose);return;}
  if(game.player.energy+activity.energy<0){notify('Not enough energy for that activity.',COLORS.rose);return;}
  game.dayFlags.activity=true;
  const previous=game.player.campusMastery[activity.id]||0;
  game.player.campusMastery[activity.id]=previous+1;
  const partnerId=activityPartner(activity),partner=NPCS.find(n=>n.id===partnerId);
  game.player.relationships[partnerId]=clamp((game.player.relationships[partnerId]||0)+1,-10,20);
  if(sameLadder(partner))adjustRivalry(partnerId,1,0);
  applyEffects({[activity.stat]:1,energy:activity.energy,stress:activity.stress,score:activity.score},`${activity.name} session`);
  game.player.campusActivityLog.push({id:activity.id,year:game.year,month:game.month,day:game.day,partner:partnerId});progressMission('activity',1);
  advanceTime(Math.min(activity.time,Math.max(0,885-game.time)));
  game.overlay=null;
  const outcome=activity.outcomes[(game.day+previous+game.month)%activity.outcomes.length];
  openDialogue({speaker:activity.name,portrait:partner?.portrait??null,text:`${outcome}\n\n${partner?.name||'A classmate'} worked beside you. Mastery: ${game.player.campusMastery[activity.id]} session${game.player.campusMastery[activity.id]===1?'':'s'}.`,choices:[{text:'Head to closing homeroom',action:()=>{checkAchievements();saveSilently();}}]});
}
function achievementUnlocked(id){return game.player.achievements.includes(id);}
function unlockAchievement(id){
  ensureV7State();if(achievementUnlocked(id))return false;
  const badge=ACHIEVEMENTS.find(a=>a.id===id);if(!badge)return false;
  game.player.achievements.push(id);game.player.achievementDates[id]={year:game.year,month:game.month,day:game.day};game.player.score+=6;
  notify(`Achievement: ${badge.name}`,COLORS.gold);audio.sparkle();return true;
}
function checkAchievements(){
  ensureV7State();
  const rel=Object.values(game.player.relationships),activityIds=new Set(game.player.campusActivityLog.map(a=>a.id));
  const latest=game.player.monthlyScores.at(-1);
  const checks={
    first_friend:rel.some(v=>v>=4),trusted_circle:rel.filter(v=>v>=4).length>=5,confidant:rel.some(v=>v>=15),
    route_complete:game.player.routeScenes.length>=3,all_routes:game.player.routeScenes.length>=30,
    message_ten:game.player.messageReplies.length>=10,message_all:game.player.messageReplies.length>=20,
    club_rank_two:game.player.clubRankIndex>=1,club_master:game.player.clubRankIndex>=3,club_winner:game.player.clubWins>=1,
    showcase_s:game.player.showcaseScores.some(s=>s.grade==='S'),showcase_six:game.player.showcaseScores.length>=6,showcase_all:new Set(game.player.showcaseScores.map(s=>s.month)).size>=12,
    punctual_week:game.player.onTimeClasses>=15,clean_record:!!latest&&latest.cleanRecord===true,teacher_trust:game.player.teacherTrust>=10,
    activity_three:game.player.campusActivityLog.length>=3,activity_master:Object.values(game.player.campusMastery).some(v=>v>=3),activity_variety:activityIds.size>=CAMPUS_ACTIVITIES.length,
    rival_first:game.player.rivalScenes.length>=1,rival_respect:Object.values(game.player.rivalRespect).some(v=>v>=20),
    rival_all:currentLadderRivals().every(r=>r.scenes>=2),rank_one:latest?.rank===1,prom_crown:game.finished&&/crowned Prom/.test(game.promResult||'')
  };
  let changed=false;for(const badge of ACHIEVEMENTS)if(checks[badge.id])changed=unlockAchievement(badge.id)||changed;
  if(changed)saveSilently();
}
function openYearbook(){ensureV7State();game.overlay={type:'yearbook',title:'Crest Yearbook',page:0};}
function drawRivalBoard(o){
  overlayBase(o.title);
  const rivals=currentLadderRivals(),playerRank=getPlayerRank(game.player.gender);
  text(`${game.player.gender==='boy'?'BOYS':'GIRLS'} LADDER • Your current rank #${playerRank.position}`,82,102,16,COLORS.sky,true);
  text(`${game.player.rivalScenes.length}/${rivals.length*2} rivalry chapters`,686,102,13,COLORS.gold,true);
  rivals.forEach((r,index)=>{
    const y=126+index*62;ctx.fillStyle=index%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.06)';ctx.fillRect(82,y,796,52);
    const sx=(r.portrait%4)*PORTRAIT_CELL,sy=Math.floor(r.portrait/4)*PORTRAIT_CELL;ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,88,y+4,44,44);
    text(`#${r.position} ${r.name}`,144,y+21,15,COLORS.paper,true);text(`${r.score} pts`,144,y+42,11,COLORS.cream,true);
    text(rivalryTier(r.respect),390,y+20,13,r.respect>=12?COLORS.gold:COLORS.sky,true);text(`Respect ${r.respect}/30`,390,y+41,11,COLORS.cream,true);
    drawBar(585,y+25,180,10,r.heat,30,COLORS.rose,'HEAT');text(`${r.scenes}/2`,816,y+31,14,r.scenes===2?COLORS.mint:COLORS.paper,true);
  });
  wrapped('Rivalry heat rises when monthly ranks are close. Respect grows through honest talks and rivalry chapters; it improves standing without turning classmates into enemies.',100,446,760,12,COLORS.cream,3);
  addButton(365,477,230,30,'CLOSE',()=>game.overlay=null);
}
function drawCampusPlanner(o){
  overlayBase(o.title);const available=campusActivityAvailable();
  centered(available?'Free Period is open. Choose one focused activity.':'Activities unlock at 14:15 during Free Period and can be completed once per day.',100,14,available?COLORS.mint:COLORS.rose,`bold 14px ${UI_FONT}`);
  (o.options||campusOptions()).forEach((activity,index)=>{
    const x=75+index*285,y=135,mastery=game.player.campusMastery[activity.id]||0;
    panel(x,y,250,285,COLORS.deep,index===0?COLORS.sky:index===1?COLORS.pink:COLORS.gold,3);
    text(activity.name.toUpperCase(),x+16,y+30,15,COLORS.paper,true);
    text(`${ROOMS[activity.room]?.name||activity.room} • ${activity.time} min`,x+16,y+54,11,COLORS.sky,true);
    wrapped(activity.description,x+16,y+84,218,13,COLORS.cream,5);
    text(`Focus: ${activity.stat.toUpperCase()}`,x+16,y+176,12,COLORS.gold,true);
    text(`Energy ${activity.energy} • Stress ${activity.stress>=0?'+':''}${activity.stress}`,x+16,y+201,11,COLORS.paper,true);
    text(`${activity.mastery}: ${mastery}`,x+16,y+226,11,mastery>=3?COLORS.mint:COLORS.cream,true);
    addButton(x+20,y+246,210,30,game.dayFlags.activity?'DONE TODAY':'CHOOSE',()=>performCampusActivity(activity),available&&!game.dayFlags.activity&&game.player.energy+activity.energy>=0,false,index===0?COLORS.blue:index===1?COLORS.rose:COLORS.orange);
  });
  text(`Completed activities: ${game.player.campusActivityLog.length} • Distinct activities: ${new Set(game.player.campusActivityLog.map(a=>a.id)).size}/${CAMPUS_ACTIVITIES.length}`,86,453,12,COLORS.gold,true);
  addButton(365,476,230,30,'CLOSE',()=>game.overlay=null);
}
function drawYearbook(o){
  overlayBase(o.title);const page=clamp(o.page||0,0,1),visible=ACHIEVEMENTS.slice(page*12,page*12+12);
  text('ACHIEVEMENTS & SCHOOL LEGACY',82,102,17,COLORS.gold,true);text(`${game.player.achievements.length}/${ACHIEVEMENTS.length} unlocked • Page ${page+1}/2`,665,102,13,COLORS.sky,true);
  visible.forEach((badge,index)=>{
    const col=index%3,row=Math.floor(index/3),x=74+col*278,y=126+row*76,unlocked=achievementUnlocked(badge.id);
    ctx.fillStyle=unlocked?'rgba(229,184,75,.13)':'rgba(255,255,255,.035)';ctx.fillRect(x,y,258,64);ctx.strokeStyle=unlocked?COLORS.gold:'#4a5060';ctx.strokeRect(x+.5,y+.5,257,63);
    centeredAt(badge.icon,x+32,y+38,24,unlocked?COLORS.gold:'#596070','bold 24px Trebuchet MS');
    text(badge.name,x+58,y+22,13,unlocked?COLORS.paper:'#777d89',true);wrapped(badge.description,x+58,y+42,190,10,unlocked?COLORS.cream:'#646a76',2);
  });
  text(`Rivalry ${game.player.rivalScenes.length}/10 • Campus ${game.player.campusActivityLog.length} • Memories ${game.player.routeScenes.length}/30 • Messages ${game.player.messageReplies.length}/20`,92,447,11,COLORS.cream,true);
  addButton(220,474,150,30,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);
  addButton(405,474,150,30,'CLOSE',()=>game.overlay=null);
  addButton(590,474,150,30,'NEXT',()=>o.page=Math.min(1,page+1),page<1);
}
