function ensureCampusLifeState(){
  game.player.phoneInbox ||= [];
  game.player.messageReplies ||= [];
  game.player.showcaseScores ||= [];
  game.player.showcaseWins ??= 0;
  game.player.eventPrestige ??= 0;
  game.dayFlags ||= {};
  game.dayFlags.message ??= false;
  game.dayFlags.showcase ??= false;
}
function messageById(id){return PHONE_MESSAGES.find(message=>message.id===id)||null;}
function npcById(id){return NPCS.find(npc=>npc.id===id)||null;}
function unreadMessageCount(){ensureCampusLifeState();return game.player.phoneInbox.filter(entry=>!entry.read&&!game.player.messageReplies.includes(entry.id)).length;}
function maybeQueuePhoneMessage(){
  ensureCampusLifeState();
  if(game.dayFlags.message||game.dialogue||game.overlay||game.mode!=='play')return;
  if(game.time<700||game.time>880)return;
  const owned=new Set(game.player.phoneInbox.map(entry=>entry.id));
  const eligible=PHONE_MESSAGES.filter(message=>!owned.has(message.id)&&(game.player.relationships[message.npcId]||0)>=message.threshold);
  if(!eligible.length){game.dayFlags.message=true;return;}
  const seed=game.year*997+game.month*73+game.day*31+game.player.name.length*11;
  const message=eligible[Math.abs(seed)%eligible.length];
  game.player.phoneInbox.unshift({id:message.id,read:false,received:{year:game.year,month:game.month,day:game.day}});
  game.dayFlags.message=true;
  notify(`New message from ${npcById(message.npcId)?.name||'a classmate'}`,COLORS.pink);
  audio.message?.();
  saveSilently();
}
function openPhone(){ensureCampusLifeState();game.overlay={type:'phone',title:'Crest Phone'};}
function openMessage(messageId){
  ensureCampusLifeState();
  const entry=game.player.phoneInbox.find(item=>item.id===messageId),message=messageById(messageId),npc=message&&npcById(message.npcId);
  if(!entry||!message||!npc)return;
  entry.read=true;
  if(game.player.messageReplies.includes(message.id)){
    openDialogue({speaker:`${npc.name} • ${message.subject}`,portrait:npc.portrait,text:`${message.text}\n\nYou already replied to this conversation.`,choices:[{text:'Close'}]});
    return;
  }
  game.overlay=null;
  openDialogue({speaker:`${npc.name} • ${message.subject}`,portrait:npc.portrait,text:message.text,choices:message.choices.map(choice=>({
    text:choice.text,effects:choice.effects,relationship:[npc.id,choice.bond||1],result:choice.result,
    achievement:`Message reply: ${npc.name} — ${message.subject}`,
    action:()=>{if(!game.player.messageReplies.includes(message.id))game.player.messageReplies.push(message.id);audio.good();saveSilently();}
  }))});
}
function drawPhoneOverlay(o){
  overlayBase(o.title);
  text('MESSAGES',82,102,18,COLORS.pink,true);
  text(`${unreadMessageCount()} unread • ${game.player.messageReplies.length}/${PHONE_MESSAGES.length} replied`,676,102,13,COLORS.gold,true);
  const inbox=game.player.phoneInbox.slice(0,8);
  if(!inbox.length){
    panel(130,160,700,180,COLORS.deep,COLORS.sky,3);
    centered('No messages yet',224,25,COLORS.paper,'bold 25px Trebuchet MS');
    centered('Conversations arrive during lunch and free periods as friendships develop.',270,14,COLORS.cream,'bold 14px Trebuchet MS');
  }else inbox.forEach((entry,index)=>{
    const message=messageById(entry.id),npc=message&&npcById(message.npcId);if(!message||!npc)return;
    const y=126+index*39,replied=game.player.messageReplies.includes(entry.id),unread=!entry.read&&!replied;
    ctx.fillStyle=unread?'rgba(232,142,164,.18)':'rgba(255,255,255,.045)';ctx.fillRect(82,y,796,34);
    const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;
    ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,87,y+3,28,28);
    text(npc.name,124,y+14,13,unread?COLORS.paper:COLORS.cream,true);
    text(message.subject,270,y+14,12,COLORS.sky,true);
    text(replied?'REPLIED':unread?'NEW':'READ',790,y+14,10,replied?COLORS.mint:unread?COLORS.pink:COLORS.muted||COLORS.cream,true);
    addButton(704,y+5,82,24,'OPEN',()=>openMessage(entry.id),true,false,unread?COLORS.rose:COLORS.navy);
  });
  addButton(240,465,210,34,'MEMORY GALLERY',()=>game.overlay={type:'memories',title:'Memory Gallery',page:0});
  addButton(510,465,210,34,'CLOSE',()=>game.overlay=null);
}
function routeCatalog(){return NPCS.flatMap(npc=>(RELATIONSHIP_ROUTES[npc.id]||[]).map(route=>({npc,route})));}
function openMemory(routeId){
  const item=routeCatalog().find(entry=>entry.route.id===routeId);if(!item||!game.player.routeScenes.includes(routeId))return;
  game.overlay=null;
  openDialogue({speaker:`Memory • ${item.npc.name} • ${item.route.title}`,portrait:item.npc.portrait,scene:item.route.scene,text:item.route.text,choices:[{text:'Return to the present'}]});
}
function drawMemoryGallery(o){
  overlayBase(o.title);
  const all=routeCatalog(),page=clamp(o.page||0,0,1),start=page*15,visible=all.slice(start,start+15);
  text('UNLOCKED FRIENDSHIP MEMORIES',82,100,17,COLORS.gold,true);
  text(`${game.player.routeScenes.length}/30 • Page ${page+1}/2`,728,100,13,COLORS.sky,true);
  visible.forEach((item,index)=>{
    const col=index%5,row=Math.floor(index/5),x=72+col*166,y=124+row*102,unlocked=game.player.routeScenes.includes(item.route.id);
    ctx.fillStyle=unlocked?'rgba(255,255,255,.065)':'rgba(8,12,22,.55)';ctx.fillRect(x,y,150,90);
    ctx.strokeStyle=unlocked?COLORS.gold:'#4c5262';ctx.lineWidth=2;ctx.strokeRect(x+.5,y+.5,149,89);
    if(unlocked){
      const sx=(item.npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(item.npc.portrait/4)*PORTRAIT_CELL;
      ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,x+5,y+6,56,56);
      text(item.npc.name.split(' ')[0],x+67,y+23,12,COLORS.paper,true);
      wrapped(item.route.title,x+67,y+43,76,11,COLORS.cream,2);
      addButton(x+5,y+66,140,19,'REPLAY',()=>openMemory(item.route.id),true,false,COLORS.navy);
    }else{
      centeredAt('LOCKED',x+75,y+37,13,'#73798a','bold 13px Trebuchet MS');
      centeredAt(`Bond ${item.route.threshold}`,x+75,y+58,11,'#646b7e','bold 11px Trebuchet MS');
    }
  });
  addButton(250,455,130,32,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);
  addButton(415,455,130,32,'PHONE',openPhone);
  addButton(580,455,130,32,'NEXT',()=>o.page=Math.min(1,page+1),page<1);
}
function currentShowcase(){return MONTHLY_SHOWCASES[(game.month-1)%MONTHLY_SHOWCASES.length];}
function showcaseRecord(){ensureCampusLifeState();return game.player.showcaseScores.find(entry=>entry.year===game.year&&entry.month===game.month)||null;}
function showcaseSequence(seed,length=4){const symbols=['A','B','C','D'];return Array.from({length},(_,index)=>symbols[Math.abs(seed+index*17+index*index*7)%symbols.length]);}
function startMonthlyShowcase(source='Monthly showcase'){
  ensureCampusLifeState();
  if(showcaseRecord()){notify('This month’s showcase is already complete.',COLORS.sky);return false;}
  const cfg=currentShowcase(),seed=game.year*1000+game.month*73+game.day*17;
  const overlay={type:'showcase',title:cfg.title,cfg,source,mechanic:cfg.mechanic,phase:'active',elapsed:0,score:0,feedback:'',flash:0};
  if(cfg.mechanic==='timing')Object.assign(overlay,{round:0,total:4,position:.05,targetCenter:.28+(seed%43)/100,targetWidth:.18,hits:[]});
  if(cfg.mechanic==='sequence')Object.assign(overlay,{sequence:showcaseSequence(seed,4),input:[],preview:2.7,mistakes:0});
  if(cfg.mechanic==='balance')Object.assign(overlay,{position:.5,velocity:0,targetCenter:.5,targetWidth:.28,duration:8,insideTime:0});
  game.overlay=overlay;game.dayFlags.showcase=true;audio.bell();return true;
}
function updateShowcase(dt){
  const o=game.overlay;if(o?.type!=='showcase'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,(o.flash||0)-dt);
  if(o.mechanic==='timing'){
    const speed=2.2+o.round*.38+game.year*.08;o.position=.5+.47*Math.sin(o.elapsed*speed+o.round*.73);
  }else if(o.mechanic==='sequence'){
    if(o.preview>0)o.preview=Math.max(0,o.preview-dt);
  }else if(o.mechanic==='balance'){
    const left=keys.has('arrowleft')||keys.has('a'),right=keys.has('arrowright')||keys.has('d');
    o.velocity+=(right-left)*dt*.95;o.velocity*=Math.pow(.32,dt);o.position=clamp(o.position+o.velocity*dt,0,1);
    o.targetCenter=.5+Math.sin(o.elapsed*.85+game.month)*.16;
    if(Math.abs(o.position-o.targetCenter)<=o.targetWidth/2)o.insideTime+=dt;
    if(o.elapsed>=o.duration)finishShowcase(Math.round(o.insideTime/o.duration*100));
  }
}
function showcaseAction(value=null){
  const o=game.overlay;if(o?.type!=='showcase'||o.phase!=='active')return;
  if(o.mechanic==='timing'){
    const distance=Math.abs(o.position-o.targetCenter),accuracy=Math.round(clamp(108-distance*190,0,100));o.hits.push(accuracy);o.flash=.24;audio.tone(accuracy>=70?900:250,.1,accuracy>=70?'sine':'sawtooth',.03);
    if(o.hits.length>=o.total){finishShowcase(Math.round(o.hits.reduce((a,b)=>a+b,0)/o.hits.length));return;}
    o.round++;o.elapsed=.14;o.targetCenter=.22+((game.year*31+game.month*19+o.round*27)%57)/100;o.targetWidth=Math.max(.1,.18-o.round*.015);
  }else if(o.mechanic==='sequence'){
    if(o.preview>0||value===null)return;
    const expected=o.sequence[o.input.length],actual=['A','B','C','D'][value];o.input.push(actual);
    if(actual!==expected){o.mistakes++;audio.bad();}else audio.good();
    if(o.input.length>=o.sequence.length)finishShowcase(Math.max(0,100-o.mistakes*24));
  }
}
function finishShowcase(score){
  const o=game.overlay;if(!o||o.type!=='showcase'||o.phase==='result')return;
  const cfg=o.cfg,grade=score>=90?'S':score>=75?'A':score>=58?'B':score>=40?'C':'D';
  const statGain=score>=90?3:score>=70?2:score>=45?1:0;
  const standing=Math.round(score/5)+game.year*2;
  applyEffects({score:standing,[cfg.stat]:statGain,stress:score<45?3:-2},`${cfg.event}: Grade ${grade}`);
  game.player.eventPrestige+=Math.round(score/10);
  if(score>=75)game.player.showcaseWins++;
  game.player.showcaseScores.push({year:game.year,month:game.month,score,grade,event:cfg.event});
  o.phase='result';o.score=score;o.grade=grade;o.resultColor=score>=75?COLORS.gold:score>=50?COLORS.sky:COLORS.rose;
  saveSilently();audio.good();
}
function drawShowcaseOverlay(o){
  overlayBase(`${o.cfg.event} • ${o.title}`);
  centered(o.cfg.description,103,15,COLORS.cream,'bold 15px Trebuchet MS');
  panel(100,135,760,252,COLORS.deep,o.cfg.color,4);
  if(o.phase==='result'){
    centered(`GRADE ${o.grade}`,196,42,o.resultColor,'bold 42px Trebuchet MS');
    centered(`${o.score}% showcase score`,245,21,COLORS.paper,'bold 21px Trebuchet MS');
    wrapped(`The result adds to event prestige and this month’s social standing. Strong showcase performances can become part of your final school legacy.`,220,290,520,15,COLORS.cream,4);
    addButton(325,427,310,42,'CONTINUE TO DAY SUMMARY',()=>{game.overlay=null;setTimeout(endDay,40);});return;
  }
  if(o.mechanic==='timing'){
    const x=155,y=230,w=650,h=44,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;
    text(`CUE ${o.hits.length+1}/${o.total}`,155,190,18,o.cfg.color,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    ctx.fillStyle='rgba(229,184,75,.38)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);
    ctx.fillStyle=o.flash?COLORS.white:o.cfg.color;ctx.fillRect(marker-5,y-16,10,h+32);
    o.hits.forEach((hit,index)=>text(`${index+1}: ${hit}%`,235+index*130,320,14,hit>=70?COLORS.mint:COLORS.paper,true));
    addButton(330,420,300,46,'HIT • E / SPACE',()=>showcaseAction(),true,false,o.cfg.color);
  }else if(o.mechanic==='sequence'){
    text(o.preview>0?'MEMORIZE THE ORDER':'REPEAT THE ORDER',155,185,18,o.cfg.color,true);
    const symbols=o.preview>0?o.sequence:o.input.map((value,index)=>value||'•');
    for(let i=0;i<4;i++){const x=220+i*135;panel(x,220,92,92,o.preview>0?o.cfg.color:'#151c31',COLORS.gold,3);centeredAt(symbols[i]||'•',x+46,279,38,COLORS.paper,'bold 38px Trebuchet MS');}
    if(o.preview<=0){['A','B','C','D'].forEach((symbol,index)=>addButton(220+index*135,345,92,48,`${index+1} • ${symbol}`,()=>showcaseAction(index),true,false,o.cfg.color));}
    else centered(`Sequence appears for ${o.preview.toFixed(1)} seconds`,430,15,COLORS.cream,'bold 15px Trebuchet MS');
  }else{
    const x=155,y=235,w=650,h=48,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;
    text(`HOLD THE PACE • ${Math.max(0,o.duration-o.elapsed).toFixed(1)}s`,155,188,18,o.cfg.color,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    ctx.fillStyle='rgba(229,184,75,.33)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.fillStyle=o.cfg.color;ctx.fillRect(marker-7,y-17,14,h+34);
    centered(`${Math.round(o.insideTime/o.duration*100)}% controlled`,333,17,COLORS.paper,'bold 17px Trebuchet MS');
    addButton(245,410,180,46,'← HOLD LEFT',()=>{},true,false,COLORS.navy,{holdKey:'arrowleft'});addButton(535,410,180,46,'HOLD RIGHT →',()=>{},true,false,COLORS.navy,{holdKey:'arrowright'});
  }
}

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
function performCampusActivity(activity){startCampusMastery(activity);}
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
    rival_all:currentLadderRivals().every(r=>r.scenes>=2),rank_one:latest?.rank===1,prom_crown:game.finished&&/crowned Prom/.test(game.promResult||''),
    moment_first:(game.player.friendshipMoments||[]).length>=1,moments_all:(game.player.friendshipMoments||[]).length>=10,
    incident_five:(game.player.incidentHistory||[]).length>=5,activity_s:Object.values(game.player.campusBest||{}).some(v=>v>=90),
    mastery_all:CAMPUS_ACTIVITIES.every(a=>(game.player.campusMastery?.[a.id]||0)>=2),legacy_ready:Object.values(game.player.legacyTags||{}).reduce((a,b)=>a+b,0)>=5,
    exam_pass:(game.player.examScores||[]).some(e=>e.score>=55),exam_ace:(game.player.examScores||[]).some(e=>e.grade==='S'),exam_all:(game.player.examScores||[]).length>=8,
    weekend_first:(game.player.weekendOutings||[]).length>=1,weekend_variety:new Set((game.player.weekendOutings||[]).map(o=>o.id)).size>=6,new_game_plus:(game.player.newGamePlus||0)>=1,
    campaign_first:(game.player.electionHistory||[]).length>=1,election_win:(game.player.leadershipWins||0)>=1,election_landslide:(game.player.electionHistory||[]).some(e=>e.landslide),election_all:(game.player.electionHistory||[]).length>=4
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
    text(`${activity.mastery}: ${mastery} • Best ${game.player.campusBest?.[activity.id]||0}%`,x+16,y+226,10,mastery>=3?COLORS.mint:COLORS.cream,true);
    addButton(x+20,y+246,210,30,game.dayFlags.activity?'DONE TODAY':'PLAY SESSION',()=>performCampusActivity(activity),available&&!game.dayFlags.activity&&game.player.energy+activity.energy>=0,false,index===0?COLORS.blue:index===1?COLORS.rose:COLORS.orange);
  });
  text(`Completed activities: ${game.player.campusActivityLog.length} • Distinct activities: ${new Set(game.player.campusActivityLog.map(a=>a.id)).size}/${CAMPUS_ACTIVITIES.length}`,86,453,12,COLORS.gold,true);
  addButton(365,476,230,30,'CLOSE',()=>game.overlay=null);
}
function drawYearbook(o){
  overlayBase(o.title);const perPage=10,pages=Math.ceil(ACHIEVEMENTS.length/perPage),page=clamp(o.page||0,0,pages-1),visible=ACHIEVEMENTS.slice(page*perPage,page*perPage+perPage);
  text('ACHIEVEMENTS & SCHOOL LEGACY',82,102,17,COLORS.gold,true);text(`${game.player.achievements.length}/${ACHIEVEMENTS.length} unlocked • Page ${page+1}/${pages}`,665,102,13,COLORS.sky,true);
  visible.forEach((badge,index)=>{
    const col=index%2,row=Math.floor(index/2),x=78+col*410,y=122+row*63,unlocked=achievementUnlocked(badge.id);
    ctx.fillStyle=unlocked?'rgba(229,184,75,.13)':'rgba(255,255,255,.035)';ctx.fillRect(x,y,390,54);ctx.strokeStyle=unlocked?COLORS.gold:'#4a5060';ctx.strokeRect(x+.5,y+.5,389,53);
    centeredAt(badge.icon,x+30,y+34,22,unlocked?COLORS.gold:'#596070','bold 22px Trebuchet MS');
    text(badge.name,x+56,y+19,13,unlocked?COLORS.paper:'#777d89',true);wrapped(badge.description,x+56,y+37,320,10,unlocked?COLORS.cream:'#646a76',2);
  });
  text(`Rivalry ${game.player.rivalScenes.length}/10 • Campus ${game.player.campusActivityLog.length} • Illustrated moments ${game.player.friendshipMoments?.length||0}/10 • Incidents ${game.player.incidentHistory?.length||0}`,92,447,11,COLORS.cream,true);
  addButton(170,474,130,30,'PREVIOUS',()=>o.page=Math.max(0,page-1),page>0);
  addButton(315,474,150,30,'MOMENTS',openMomentGallery);
  addButton(480,474,130,30,'CLOSE',()=>game.overlay=null);
  addButton(625,474,130,30,'NEXT',()=>o.page=Math.min(pages-1,page+1),page<pages-1);
}

function ensureV8State(){
  ensureV7State();
  game.player.friendshipMoments ||= [];
  game.player.incidentHistory ||= [];
  game.player.legacyTags ||= {};
  game.player.graduationLegacy ??= null;
  game.player.campusBest ||= Object.fromEntries(CAMPUS_ACTIVITIES.map(a=>[a.id,0]));
  game.dayFlags ||= {};
  game.dayFlags.incident ??= false;
}
function addLegacyMark(tag,amount=1){
  if(!tag)return;
  ensureV8State();
  game.player.legacyTags[tag]=(game.player.legacyTags[tag]||0)+amount;
}
function nextFriendshipMoment(npc){
  ensureV8State();
  const moment=FRIENDSHIP_MOMENTS.find(m=>m.npcId===npc.id);
  if(!moment||game.player.friendshipMoments.includes(moment.id))return null;
  if(completedRouteCount(npc.id)<3||(game.player.relationships[npc.id]||0)<15)return null;
  return moment;
}
function triggerFriendshipMoment(npc,moment){
  openDialogue({speaker:`Lasting Moment • ${npc.name}`,portrait:npc.portrait,scene:moment.scene,atlas:'memory_atlas',text:`${moment.location}\n\n${moment.text}`,choices:moment.choices.map(choice=>({
    text:choice.text,effects:choice.effects,result:choice.result,achievement:`Lasting Moment: ${moment.title}`,
    action:()=>{
      if(!game.player.friendshipMoments.includes(moment.id))game.player.friendshipMoments.push(moment.id);
      addLegacyMark(choice.legacy,2);
      game.player.relationships[npc.id]=clamp((game.player.relationships[npc.id]||0)+1,-10,20);
      notify(`Memory unlocked: ${moment.title}`,COLORS.gold);audio.sparkle();checkAchievements();saveSilently();
    }
  }))});
}
function openMomentGallery(){ensureV8State();game.overlay={type:'moments',title:'Illustrated Moments',page:0};}
function drawMomentGallery(o){
  overlayBase(o.title);
  centered(`${game.player.friendshipMoments.length}/10 lasting moments unlocked`,97,14,COLORS.gold,`bold 14px ${UI_FONT}`);
  FRIENDSHIP_MOMENTS.forEach((moment,index)=>{
    const col=index%5,row=Math.floor(index/5),x=68+col*169,y=122+row*164,unlocked=game.player.friendshipMoments.includes(moment.id);
    panel(x,y,151,145,COLORS.deep,unlocked?COLORS.gold:COLORS.navy,2);
    if(unlocked&&images.memory_atlas){
      const sx=(moment.scene%4)*200,sy=Math.floor(moment.scene/4)*200;
      ctx.save();ctx.beginPath();ctx.rect(x+7,y+7,137,91);ctx.clip();ctx.drawImage(images.memory_atlas,sx,sy,200,200,x+7,y+7,137,91);ctx.restore();
      text(moment.title,x+9,y+117,11,COLORS.paper,true);text(moment.location,x+9,y+135,9,COLORS.cream);
    }else{
      centeredAt('LOCKED',x+75,y+62,14,COLORS.muted||COLORS.cream,`bold 14px ${UI_FONT}`);
      text(NPCS.find(n=>n.id===moment.npcId)?.name||moment.npcId,x+9,y+119,11,COLORS.cream,true);
      text('Complete route + Bond 15',x+9,y+136,9,COLORS.sky);
    }
  });
  addButton(244,459,210,32,'MEMORY GALLERY',()=>game.overlay={type:'memories',title:'Memory Gallery',page:0});
  addButton(506,459,210,32,'CLOSE',()=>game.overlay=null);
}
function deterministicUnit(seed){const x=Math.sin(seed*12.9898+78.233)*43758.5453;return x-Math.floor(x);}
function incidentEligible(incident,slot){
  const weatherName=game.dailyBrief?.weather||'Clear Skies';
  const weatherKey=({'Clear Skies':'clear','Petal Breeze':'clear','Silver Rain':'rain','Bright Heat':'clear','Cloud Cover':'cloudy','Autumn Wind':'wind','First Frost':'snow','Light Snow':'snow'})[weatherName]||'clear';
  return incident.slots.includes(slot?.id)&&incident.weather.includes(weatherKey)&&campaignIndex()>=incident.minMonth&&!game.player.incidentHistory.includes(incident.id);
}
function maybeTriggerCampusIncident(slot=currentSlot()){
  ensureV8State();
  if(game.dayFlags.incident||game.dialogue||game.overlay||!slot?.optional)return false;
  if(!['arrival','break','lunch','free'].includes(slot.id))return false;
  const seed=game.year*100000+game.month*1000+game.day*31+slot.start;
  if(deterministicUnit(seed)<.42)return false;
  const eligible=CAMPUS_INCIDENTS.filter(i=>incidentEligible(i,slot));
  if(!eligible.length)return false;
  const incident=eligible[Math.floor(deterministicUnit(seed+19)*eligible.length)];
  game.dayFlags.incident=true;
  openDialogue({speaker:`Campus Moment • ${incident.title}`,scene:(CAMPUS_INCIDENTS.indexOf(incident)%12),text:incident.text,choices:incident.choices.map(choice=>({
    ...choice,achievement:`Resolved: ${incident.title}`,action:()=>{
      if(!game.player.incidentHistory.includes(incident.id))game.player.incidentHistory.push(incident.id);
      addLegacyMark(choice.effects?.kindness?'mentor':choice.effects?.reliability?'steward':choice.effects?.charisma?'connector':'constant',1);
      progressMission('help',1);checkAchievements();saveSilently();
    }
  }))});
  return true;
}
const ACTIVITY_MECHANIC_LABELS={timing:'Press at the gold window',sequence:'Repeat the four-step pattern',balance:'Use left/right to stay centered',focus:'Hit each moving focus point'};
function startCampusMastery(activity){
  ensureV8State();
  if(!campusActivityAvailable()){notify('Campus activities are available at the start of Free Period.',COLORS.rose);return;}
  if(game.player.energy+activity.energy<0){notify('Not enough energy for that activity.',COLORS.rose);return;}
  const seed=game.year*9000+game.month*400+game.day*17+CAMPUS_ACTIVITIES.indexOf(activity);
  const o={type:'activityMastery',title:activity.name,activity,mechanic:activity.mechanic,phase:'active',elapsed:0,score:0,round:0,total:4,feedback:ACTIVITY_MECHANIC_LABELS[activity.mechanic],flash:0};
  if(activity.mechanic==='timing'||activity.mechanic==='focus')Object.assign(o,{position:.05,direction:1,targetCenter:.25+deterministicUnit(seed)*.5,targetWidth:activity.mechanic==='focus'?.12:.18,hits:[]});
  if(activity.mechanic==='sequence')Object.assign(o,{sequence:[0,1,2,3].map((_,i)=>Math.floor(deterministicUnit(seed+i*23)*4)),input:[],preview:2.8,mistakes:0});
  if(activity.mechanic==='balance')Object.assign(o,{position:.5,velocity:0,control:0,targetCenter:.5,targetWidth:.26,duration:9,insideTime:0});
  game.overlay=o;audio.bell();
}
function updateCampusMastery(dt){
  const o=game.overlay;if(o?.type!=='activityMastery'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,o.flash-dt);
  if(o.mechanic==='timing'||o.mechanic==='focus'){
    const speed=o.mechanic==='focus'?.72:.58;
    o.position+=o.direction*dt*speed;
    if(o.position>=.97){o.position=.97;o.direction=-1;}else if(o.position<=.03){o.position=.03;o.direction=1;}
  }else if(o.mechanic==='sequence'){
    o.preview=Math.max(0,o.preview-dt);
  }else if(o.mechanic==='balance'){
    const held=(keys.has('arrowleft')?-1:0)+(keys.has('arrowright')?1:0);if(held)o.control=held;else if(!pointer.down)o.control=0;
    const drift=Math.sin(o.elapsed*2.2+game.day)*.32;
    o.velocity+=(o.control*.95+drift-o.position+.5)*dt;
    o.velocity*=.985;o.position=clamp(o.position+o.velocity*dt,.02,.98);
    if(Math.abs(o.position-o.targetCenter)<=o.targetWidth/2)o.insideTime+=dt;
    if(o.elapsed>=o.duration)finishCampusMastery();
  }
}
function campusMasteryAction(value=null){
  const o=game.overlay;if(o?.type!=='activityMastery'||o.phase!=='active')return;
  if(o.mechanic==='timing'||o.mechanic==='focus'){
    const dist=Math.abs(o.position-o.targetCenter),ratio=Math.max(0,1-dist/(o.targetWidth*.9));
    const pts=Math.round(ratio*100);o.hits.push(pts);o.feedback=pts>=90?'Perfect!':pts>=70?'Great!':pts>=45?'Good':'Miss';o.flash=.18;o.round++;
    if(o.round>=o.total){o.score=Math.round(o.hits.reduce((a,b)=>a+b,0)/o.hits.length);finishCampusMastery();return;}
    const seed=game.year*7000+game.month*300+game.day*31+o.round*47;
    o.targetCenter=.2+deterministicUnit(seed)*.6;o.targetWidth=Math.max(.085,o.targetWidth-.014);return;
  }
  if(o.mechanic==='sequence'){
    if(o.preview>0)return;
    const expected=o.sequence[o.input.length];
    if(value===expected){o.input.push(value);o.feedback='Correct';audio.good();}
    else{o.mistakes++;o.feedback='Pattern reset';o.input=[];audio.bad();}
    if(o.input.length===o.sequence.length){o.score=Math.max(30,100-o.mistakes*18);finishCampusMastery();}
  }
}
function setCampusBalanceControl(value){const o=game.overlay;if(o?.type==='activityMastery'&&o.mechanic==='balance')o.control=value;}
function finishCampusMastery(){
  const o=game.overlay;if(!o||o.type!=='activityMastery'||o.phase==='result')return;
  if(o.mechanic==='balance')o.score=Math.round(clamp(o.insideTime/o.duration,0,1)*100);
  const score=Math.round(o.score||0),grade=score>=90?'S':score>=75?'A':score>=55?'B':'C';
  o.phase='result';o.grade=grade;o.score=score;o.feedback=`Grade ${grade} • ${score}%`;
  const activity=o.activity,previous=game.player.campusMastery[activity.id]||0;
  game.player.campusMastery[activity.id]=previous+1;game.player.campusBest[activity.id]=Math.max(game.player.campusBest[activity.id]||0,score);
  const partnerId=activityPartner(activity),partner=NPCS.find(n=>n.id===partnerId),bonus=grade==='S'?3:grade==='A'?2:1;
  game.player.relationships[partnerId]=clamp((game.player.relationships[partnerId]||0)+bonus,-10,20);
  if(sameLadder(partner))adjustRivalry(partnerId,grade==='S'?2:1,0);
  applyEffects({[activity.stat]:grade==='S'?2:1,energy:activity.energy,stress:activity.stress,score:activity.score+Math.round(score/10)},`${activity.name}: Grade ${grade}`);
  addLegacyMark(activity.legacy,grade==='S'?2:1);
  game.player.campusActivityLog.push({id:activity.id,year:game.year,month:game.month,day:game.day,partner:partnerId,score,grade});
  game.dayFlags.activity=true;progressMission('activity',1);advanceTime(Math.min(activity.time,Math.max(0,885-game.time)));checkAchievements();saveSilently();
}
function drawCampusMasteryOverlay(o){
  overlayBase(`${o.activity.name} • Mastery Session`);
  centered(ACTIVITY_MECHANIC_LABELS[o.mechanic],103,15,COLORS.cream,`bold 15px ${UI_FONT}`);
  panel(105,142,750,222,COLORS.deep,COLORS.gold,4);
  if(o.phase==='result'){
    centered(`GRADE ${o.grade}`,204,38,o.grade==='S'?COLORS.gold:o.grade==='A'?COLORS.mint:COLORS.sky,'bold 38px Trebuchet MS');
    centered(`${o.score}% performance`,248,20,COLORS.paper,'bold 20px Trebuchet MS');
    const best=game.player.campusBest[o.activity.id]||o.score;
    wrapped(`Personal best: ${best}%. Mastery: ${game.player.campusMastery[o.activity.id]} sessions. Strong performance increases relationship gains, campus standing and your graduation legacy.`,205,286,550,14,COLORS.cream,4);
    addButton(330,414,300,44,'RETURN TO SCHOOL',()=>game.overlay=null);return;
  }
  if(o.mechanic==='timing'||o.mechanic==='focus'){
    const x=155,y=238,w=650,h=42;ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    const tx=x+o.targetCenter*w,tw=o.targetWidth*w;ctx.fillStyle='rgba(229,184,75,.42)';ctx.fillRect(tx-tw/2,y,tw,h);ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(tx-tw/2+.5,y+.5,tw-1,h-1);
    const px=x+o.position*w;ctx.fillStyle=o.flash?COLORS.white:COLORS.sky;ctx.fillRect(px-5,y-15,10,h+30);
    text(`ROUND ${o.round+1}/${o.total}`,155,200,17,COLORS.gold,true);centered(o.feedback,329,15,COLORS.paper,`bold 15px ${UI_FONT}`);addButton(330,396,300,48,'FOCUS • E / SPACE',campusMasteryAction);
  }else if(o.mechanic==='sequence'){
    const symbols=['1','2','3','4'];centered(o.preview>0?'WATCH THE PATTERN':'REPEAT THE PATTERN',194,18,COLORS.gold,'bold 18px Trebuchet MS');
    o.sequence.forEach((v,i)=>{const x=210+i*140,y=238,active=o.preview>0&&Math.floor((2.8-o.preview)*2)%o.sequence.length===i;panel(x,y,100,80,active?COLORS.gold:COLORS.navy,active?COLORS.paper:COLORS.sky,3);centeredAt(symbols[v],x+50,y+51,30,active?COLORS.ink:COLORS.paper,'bold 30px Trebuchet MS');});
    if(o.preview<=0)[0,1,2,3].forEach((v,i)=>addButton(210+i*140,382,100,44,String(v+1),()=>campusMasteryAction(v),true,false,COLORS.blue));
  }else{
    const x=175,y=242,w=610,h=46;ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);const tx=x+o.targetCenter*w,tw=o.targetWidth*w;ctx.fillStyle='rgba(131,185,139,.42)';ctx.fillRect(tx-tw/2,y,tw,h);const px=x+o.position*w;ctx.fillStyle=COLORS.paper;ctx.beginPath();ctx.arc(px,y+23,16,0,Math.PI*2);ctx.fill();
    centered(`${Math.max(0,o.duration-o.elapsed).toFixed(1)} seconds • ${Math.round(o.insideTime/o.duration*100)}% steady`,330,16,COLORS.paper,`bold 16px ${UI_FONT}`);
    addButton(230,390,220,48,'◀ HOLD LEFT',()=>{},true,false,COLORS.blue,{holdKey:'arrowleft'});addButton(510,390,220,48,'HOLD RIGHT ▶',()=>{},true,false,COLORS.blue,{holdKey:'arrowright'});
  }
}
function legacyScores(crown=false){
  ensureV8State();const p=game.player,tags={...p.legacyTags};
  const add=(id,v)=>tags[id]=(tags[id]||0)+v;
  if(crown)add('crown',12);if(p.teacherTrust>=10)add('steward',4);if((p.leadershipWins||0)>=1)add('steward',(p.leadershipWins||0)*3);if((p.electionHistory||[]).some(e=>e.landslide))add('connector',3);if(p.clubWins>=3)add('leader',4);if(p.showcaseWins>=5)add('artist',4);
  add('mentor',Math.floor(Object.values(p.relationships).filter(v=>v>=15).length*2));add('confidant',p.friendshipMoments.length);
  add('champion',Math.floor((p.rivalScenes.length+Object.values(p.rivalRespect).filter(v=>v>=15).length)/2));add('builder',Math.floor((p.campusMastery.robotics_lab||0)/2));
  add('diplomat',Math.floor((p.campusMastery.debate_clinic||0)/2));add('connector',Math.floor(p.messageReplies.length/5));add('constant',Math.floor(p.onTimeClasses/25));
  add('visionary',Math.floor(p.achievements.length/8));return tags;
}
function determineGraduationLegacy(crown=false){
  const scores=legacyScores(crown),ordered=GRADUATION_LEGACIES.map(l=>({...l,score:scores[l.id]||0})).sort((a,b)=>b.score-a.score||a.name.localeCompare(b.name));
  const legacy=ordered[0].score?ordered[0]:GRADUATION_LEGACIES.find(l=>l.id==='constant');
  game.player.graduationLegacy={id:legacy.id,name:legacy.name,subtitle:legacy.subtitle,description:legacy.description,color:legacy.color,score:legacy.score,runnerUp:ordered[1]?.name||null};
  return game.player.graduationLegacy;
}
function drawLegacyOverlay(){
  const legacy=game.player.graduationLegacy||determineGraduationLegacy(/crowned Prom/.test(game.promResult||''));
  overlayBase('Graduation Legacy');centered(legacy.name,128,31,legacy.color,'bold 31px Trebuchet MS');centered(legacy.subtitle,164,16,COLORS.paper,`bold 16px ${UI_FONT}`);
  panel(145,198,670,156,COLORS.deep,legacy.color,4);wrapped(legacy.description,185,246,590,20,COLORS.cream,5);
  centered(`Legacy strength ${legacy.score} • Secondary path: ${legacy.runnerUp||'Everyday Legend'}`,386,14,COLORS.gold,`bold 14px ${UI_FONT}`);
  centered(`Moments ${game.player.friendshipMoments.length}/10 • Incidents ${game.player.incidentHistory.length}/${CAMPUS_INCIDENTS.length} • Activity mastery ${Object.values(game.player.campusMastery).reduce((a,b)=>a+b,0)}`,416,13,COLORS.sky,`bold 13px ${UI_FONT}`);
  addButton(365,458,230,34,'CLOSE',()=>game.overlay=null);
}

function ensureV9State(){
  ensureV8State();
  game.player.examScores ||= [];
  game.player.examBest ??= 0;
  game.player.weekendOutings ||= [];
  game.player.legacyArchive ||= [];
  game.player.newGamePlus ??= 0;
  game.player.ngPlusPerk ??= null;
  game.settings ||= {reducedMotion:false,highContrast:false,largeText:false,gamepad:true};
  game.settings.reducedMotion ??= false;game.settings.highContrast ??= false;game.settings.largeText ??= false;game.settings.gamepad ??= true;
  applyAccessibility();
}
function applyAccessibility(){
  if(!canvas||!game.settings)return;
  canvas.style ||= {};
  canvas.style.filter=game.settings.highContrast?'contrast(1.28) saturate(1.12)':'';
}
function toggleAccessibility(key){ensureV9State();game.settings[key]=!game.settings[key];applyAccessibility();saveSilently();audio.click();}
function openAccessibility(){ensureV9State();game.overlay={type:'accessibility',title:'Accessibility & Controls'};}
function currentExam(){return EXAM_SEASONS.find(e=>e.year===game.year&&e.month===game.month)||null;}
function examRecord(){ensureV9State();const cfg=currentExam();return cfg?game.player.examScores.find(r=>r.id===cfg.id):null;}
function examDue(){const cfg=currentExam();return !!cfg&&game.day>=18&&!examRecord();}
function startExam(){
  ensureV9State();const cfg=currentExam();if(!cfg||examRecord())return false;
  game.overlay={type:'exam',title:cfg.title,cfg,phase:'prep',questionIndex:0,correct:0,prepBonus:0,answers:[],feedback:cfg.subtitle};audio.bell();return true;
}
function chooseExamPrep(type){
  const o=game.overlay;if(o?.type!=='exam'||o.phase!=='prep')return;
  if(type==='notes'){o.prepBonus=12;game.player.stress=clamp(game.player.stress+4,0,100);o.feedback='Your notes are organized, highlighted and slightly intimidating.';}
  else if(type==='practice'){o.prepBonus=9;game.player.energy=clamp(game.player.energy-6,0,100);const partner=['emi','sora','aiko','kenji'][(game.year+game.month)%4];game.player.relationships[partner]=clamp((game.player.relationships[partner]||0)+1,-10,20);o.feedback='A study partner catches the gaps in your reasoning.';}
  else{o.prepBonus=5;game.player.energy=clamp(game.player.energy+8,0,100);game.player.stress=clamp(game.player.stress-8,0,100);o.feedback='A rested brain is less dramatic and more accurate.';}
  o.phase='question';o.questionIndex=0;audio.good();
}
function examAnswer(index){
  const o=game.overlay;if(o?.type!=='exam'||o.phase!=='question')return;
  const q=o.cfg.questions[o.questionIndex],right=index===q.correct;o.answers.push({index,right});if(right)o.correct++;
  o.feedback=right?'Correct — clear reasoning under pressure.':`Not quite. The best answer was “${q.options[q.correct]}”.`;
  o.phase='feedback';right?audio.good():audio.bad();
}
function nextExamQuestion(){
  const o=game.overlay;if(o?.type!=='exam'||o.phase!=='feedback')return;
  o.questionIndex++;if(o.questionIndex>=o.cfg.questions.length){finishExam();return;}o.phase='question';o.feedback=`Question ${o.questionIndex+1} of ${o.cfg.questions.length}`;
}
function finishExam(){
  const o=game.overlay;if(o?.type!=='exam')return;
  const score=clamp(Math.round(o.correct/o.cfg.questions.length*88+o.prepBonus),0,100),grade=score>=90?'S':score>=80?'A':score>=68?'B':score>=55?'C':'D';
  const record={id:o.cfg.id,year:game.year,month:game.month,score,grade,correct:o.correct};game.player.examScores.push(record);game.player.examBest=Math.max(game.player.examBest,score);
  const gain=grade==='S'?4:grade==='A'?3:grade==='B'?2:grade==='C'?1:0;game.player.stats.intellect=clamp(game.player.stats.intellect+gain,0,20);game.player.stats.reliability=clamp(game.player.stats.reliability+(score>=68?1:0),0,20);game.player.teacherTrust+=score>=80?2:score>=55?1:0;game.player.score+=statusScore(Math.round(score*o.cfg.rankWeight*.35));addLegacyMark(score>=80?'scholar':'steady',score>=80?2:1);
  game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:`${o.cfg.title}: Grade ${grade} (${score}%)`});o.phase='result';o.score=score;o.grade=grade;o.feedback=score>=90?'A near-flawless academic performance.':score>=68?'A solid result that strengthens your standing.':score>=55?'You pass, with clear room to improve.':'A difficult result—but not the end of the story.';checkAchievements();saveSilently();
}
function weekendKey(){return `${game.year}-${game.month}`;}
function weekendRecord(){ensureV9State();return game.player.weekendOutings.find(x=>x.key===weekendKey())||null;}
function weekendOptions(){const seed=game.year*101+game.month*37;return [0,1,2,3].map(i=>WEEKEND_OUTINGS[(seed+i*3)%WEEKEND_OUTINGS.length]);}
function openWeekendPlanner(returnOverlay=game.overlay){ensureV9State();game.returnOverlay=returnOverlay;game.overlay={type:'weekend',title:'Weekend Outing',options:weekendOptions()};}
function completeWeekendOuting(outing){
  if(weekendRecord()){notify('This month’s weekend plan is already complete.',COLORS.sky);return;}
  const partnerId=outing.partners.slice().sort((a,b)=>(game.player.relationships[b]||0)-(game.player.relationships[a]||0))[0],partner=NPCS.find(n=>n.id===partnerId);
  game.overlay=null;
  openDialogue({speaker:`Weekend • ${outing.name}`,portrait:partner?.portrait??null,text:`${outing.description}\n\n${partner?.name||'A friend'} joins you. Away from the ranking board, conversation becomes easier.`,choices:[{text:'Make the day count.',effects:{[outing.stat]:1,energy:outing.energy,stress:outing.stress,score:8},relationship:[partnerId,2],result:`The outing becomes one of those small memories that quietly changes Monday morning.`,action:()=>{
    game.player.weekendOutings.push({key:weekendKey(),id:outing.id,partnerId,year:game.year,month:game.month});addLegacyMark(outing.stat==='kindness'?'mentor':outing.stat==='charisma'?'connector':'constant',1);checkAchievements();saveSilently();game.overlay=game.returnOverlay||null;game.returnOverlay=null;
  }}]});
}
function openNewGamePlus(){ensureV9State();game.overlay={type:'newGamePlus',title:'New Game+ Legacy Perk'};}
function startNewGamePlus(perk){
  ensureV9State();const old=game.player,archive=[...(old.legacyArchive||[]),{legacy:old.graduationLegacy,promResult:game.promResult,achievements:old.achievements.length,moments:old.friendshipMoments.length,exams:old.examScores.length}];
  const preserve={name:old.name,gender:old.gender,club:old.club,socialStatus:old.socialStatus,achievements:[...old.achievements],achievementDates:{...old.achievementDates},friendshipMoments:[...old.friendshipMoments],newGamePlus:(old.newGamePlus||0)+1};
  resetGame();Object.assign(game.player,preserve);game.player.legacyArchive=archive;game.player.ngPlusPerk=perk.id;initializeSocialStatus();
  if(perk.apply==='relationships')for(const id of Object.keys(game.player.relationships))game.player.relationships[id]+=2;
  else if(perk.apply==='academics'){game.player.stats.intellect+=2;game.player.stats.reliability+=1;}
  else if(perk.apply==='club'){game.player.clubXP=35;game.player.clubRankIndex=1;game.player.clubPrestige=10;}
  else if(perk.apply==='calm'){game.player.stats.kindness+=2;game.player.stress=0;}
  game.mode='play';game.overlay=null;game.promResult=null;game.promCompanion=null;game.finished=false;assignMissions();relocateNPCs('arrival');checkAchievements();saveSilently();
  openDialogue({speaker:'Ms. Hayashi',portrait:12,text:`The first bell rings again. Some details feel strangely familiar.\n\nNew Game+ ${game.player.newGamePlus} • ${perk.name}\n${perk.description}`,choices:[{text:'Begin another school life.',effects:{reliability:1,score:6},result:'This time, experience is not a shortcut. It is perspective.',action:()=>setTimeout(showMonthIntro,100)}]});
}
function drawExamOverlay(o){
  overlayBase(o.title);centered(o.cfg.subtitle,100,15,COLORS.sky,`bold 15px ${UI_FONT}`);
  panel(105,132,750,282,COLORS.deep,COLORS.gold,4);
  if(o.phase==='prep'){
    centered('CHOOSE YOUR PREPARATION',174,22,COLORS.gold,'bold 22px Trebuchet MS');wrapped(o.feedback,180,215,600,15,COLORS.cream,4);
    addButton(145,322,210,52,'REVIEW NOTES',()=>chooseExamPrep('notes'));addButton(375,322,210,52,'PRACTICE TOGETHER',()=>chooseExamPrep('practice'));addButton(605,322,210,52,'REST PROPERLY',()=>chooseExamPrep('rest'));
  }else if(o.phase==='question'){
    const q=o.cfg.questions[o.questionIndex];text(`${q.subject.toUpperCase()} • ${o.questionIndex+1}/${o.cfg.questions.length}`,145,170,15,COLORS.gold,true);wrapped(q.prompt,145,207,665,18,COLORS.paper,4);
    q.options.forEach((option,i)=>addButton(145+(i%2)*335,300+Math.floor(i/2)*58,310,44,`${i+1}. ${option}`,()=>examAnswer(i),true,false,i%2?COLORS.rose:COLORS.blue));
  }else if(o.phase==='feedback'){
    centered(o.answers.at(-1)?.right?'CORRECT':'REVIEW THIS ONE',184,24,o.answers.at(-1)?.right?COLORS.mint:COLORS.rose,'bold 24px Trebuchet MS');wrapped(o.feedback,185,236,590,18,COLORS.paper,5);addButton(330,350,300,48,o.questionIndex+1>=o.cfg.questions.length?'CALCULATE RESULT':'NEXT QUESTION',nextExamQuestion);
  }else{
    centered(`GRADE ${o.grade} • ${o.score}%`,192,32,o.grade==='S'?COLORS.gold:o.score>=68?COLORS.mint:COLORS.rose,'bold 32px Trebuchet MS');wrapped(o.feedback,185,246,590,18,COLORS.cream,5);centered(`Best exam ${game.player.examBest}% • Completed ${game.player.examScores.length}/8`,342,15,COLORS.sky,`bold 15px ${UI_FONT}`);addButton(330,374,300,48,'CONTINUE TO DAY SUMMARY',()=>{game.overlay=null;setTimeout(endDay,40);});
  }
}
function drawWeekendOverlay(o){
  overlayBase(o.title);centered(weekendRecord()?'This month already has a weekend memory.':'Choose one outing before the next chapter begins.',100,15,weekendRecord()?COLORS.rose:COLORS.mint,`bold 15px ${UI_FONT}`);
  o.options.forEach((outing,i)=>{const x=70+(i%2)*420,y=132+Math.floor(i/2)*150;panel(x,y,400,132,COLORS.deep,i%2?COLORS.pink:COLORS.sky,3);text(outing.name.toUpperCase(),x+16,y+28,15,COLORS.paper,true);wrapped(outing.description,x+16,y+54,365,12,COLORS.cream,3);text(`${outing.stat.toUpperCase()} • Energy ${outing.energy>=0?'+':''}${outing.energy} • Stress ${outing.stress}`,x+16,y+104,11,COLORS.gold,true);addButton(x+250,y+94,132,28,'CHOOSE',()=>completeWeekendOuting(outing),!weekendRecord());});
  addButton(365,464,230,32,'BACK',()=>{game.overlay=game.returnOverlay||null;game.returnOverlay=null;});
}
function drawNewGamePlusOverlay(){
  overlayBase('New Game+');centered('Carry your memories into a fresh four-year run.',99,16,COLORS.gold,`bold 16px ${UI_FONT}`);
  NEW_GAME_PLUS_PERKS.forEach((perk,i)=>{const x=85+(i%2)*405,y=132+Math.floor(i/2)*145;panel(x,y,380,125,COLORS.deep,i%2?COLORS.pink:COLORS.sky,3);text(perk.name.toUpperCase(),x+18,y+31,16,COLORS.paper,true);wrapped(perk.description,x+18,y+60,340,13,COLORS.cream,3);addButton(x+220,y+86,140,28,'SELECT',()=>startNewGamePlus(perk));});addButton(365,455,230,32,'BACK TO PROM',()=>game.overlay=null);
}
function drawAccessibilityOverlay(){
  overlayBase('Accessibility & Controls');centered('Settings save with your school-life file.',101,15,COLORS.sky,`bold 15px ${UI_FONT}`);
  const rows=[['reducedMotion','REDUCED MOTION','Limits decorative animation and slows sprite cycling.'],['highContrast','HIGH CONTRAST','Raises canvas contrast and saturation.'],['largeText','LARGER UI TEXT','Increases interface text size.'],['gamepad','GAMEPAD INPUT','Enables standard controller movement and interaction.']];
  rows.forEach(([key,labelText,desc],i)=>{const y=135+i*72;panel(150,y,660,58,COLORS.deep,game.settings[key]?COLORS.mint:COLORS.navy,2);text(labelText,172,y+24,15,COLORS.paper,true);text(desc,172,y+45,11,COLORS.cream);addButton(660,y+12,125,34,game.settings[key]?'ON':'OFF',()=>toggleAccessibility(key),true,game.settings[key],game.settings[key]?COLORS.green:COLORS.blue);});
  wrapped('Keyboard: WASD/arrows, E interact, O options. Standard gamepads use the left stick/D-pad to move, A to interact and Start to pause.',180,442,600,12,COLORS.gold,3);addButton(365,485,230,30,'CLOSE',()=>game.overlay=null);
}
let gamepadLatch={};
function pollGamepad(){
  if(!game.settings?.gamepad||typeof navigator==='undefined'||!navigator.getGamepads)return;const pad=navigator.getGamepads()[0];if(!pad)return;
  const axisX=pad.axes[0]||0,axisY=pad.axes[1]||0;const set=(k,on)=>on?keys.add(k):keys.delete(k);
  set('arrowleft',axisX<-.35||pad.buttons[14]?.pressed);set('arrowright',axisX>.35||pad.buttons[15]?.pressed);set('arrowup',axisY<-.35||pad.buttons[12]?.pressed);set('arrowdown',axisY>.35||pad.buttons[13]?.pressed);
  const press=(id,on,fn)=>{if(on&&!gamepadLatch[id])fn();gamepadLatch[id]=on;};
  press('a',pad.buttons[0]?.pressed,()=>{if(game.dialogue){if(game.dialogue.reveal<game.dialogue.text.length)game.dialogue.reveal=game.dialogue.text.length;else closeDialogue(game.dialogue.selected||0);}else if(game.mode==='play'&&!game.overlay)interact();});
  press('start',pad.buttons[9]?.pressed,()=>{if(game.mode==='play'){game.paused=!game.paused;notify(game.paused?'Paused':'Resumed',COLORS.sky);}});
}

function ensureV10State(){
  ensureV9State();
  game.player.electionHistory ||= [];
  game.player.leadershipWins ??= 0;
  game.player.campaignBest ??= 0;
  game.player.campaignPlatform ??= null;
}
function currentElection(){return LEADERSHIP_ELECTIONS.find(e=>e.year===game.year&&e.month===game.month)||null;}
function electionRecord(){ensureV10State();const cfg=currentElection();return cfg?game.player.electionHistory.find(r=>r.id===cfg.id):null;}
function electionDue(){const cfg=currentElection();return !!cfg&&game.day>=cfg.day&&!electionRecord();}
function startElection(){
  ensureV10State();const cfg=currentElection();if(!cfg||electionRecord())return false;
  game.overlay={type:'election',title:cfg.title,cfg,phase:'platform',platform:null,questionIndex:0,correct:0,campaignPoints:0,answers:[],feedback:cfg.subtitle};audio.bell();return true;
}
function chooseCampaignPlatform(id){
  const o=game.overlay;if(o?.type!=='election'||o.phase!=='platform')return;
  const platform=CAMPAIGN_PLATFORMS.find(p=>p.id===id);if(!platform)return;
  const friendStrength=Object.values(game.player.relationships).filter(v=>v>=9).length;
  o.platform=platform;o.campaignPoints=12+game.player.stats[platform.stat]*2+Math.min(12,friendStrength*2)+(game.player.club==='council'?8:0);
  game.player.campaignPlatform=platform.id;o.phase='question';o.feedback=`Platform selected: ${platform.name}. Debate question 1 of ${o.cfg.questions.length}.`;audio.good();
}
function electionAnswer(index){
  const o=game.overlay;if(o?.type!=='election'||o.phase!=='question')return;
  const q=o.cfg.questions[o.questionIndex],right=index===q.correct;o.answers.push({index,right});if(right){o.correct++;o.campaignPoints+=14;}else o.campaignPoints+=4;
  o.feedback=`${right?'Strong answer.':'A difficult answer.'} ${q.explanation}`;o.phase='feedback';right?audio.good():audio.bad();
}
function nextElectionQuestion(){
  const o=game.overlay;if(o?.type!=='election'||o.phase!=='feedback')return;
  o.questionIndex++;if(o.questionIndex>=o.cfg.questions.length){finishElection();return;}o.phase='question';o.feedback=`Debate question ${o.questionIndex+1} of ${o.cfg.questions.length}.`;
}
function finishElection(){
  const o=game.overlay;if(o?.type!=='election')return;
  const rank=getPlayerRank(game.player.gender),reputation=Math.max(0,7-rank.position)*5;
  const character=game.player.stats.charisma*2+game.player.stats.reliability*2+game.player.stats.kindness+game.player.teacherTrust*2;
  const score=Math.round(o.campaignPoints+character+reputation),won=score>=o.cfg.threshold,landslide=score>=o.cfg.threshold+20;
  const result=landslide?'Landslide Victory':won?'Election Victory':score>=o.cfg.threshold-10?'Narrow Defeat':'Campaign Defeat';
  const record={id:o.cfg.id,year:game.year,month:game.month,score,won,landslide,result,correct:o.correct,platform:o.platform.id};
  game.player.electionHistory.push(record);game.player.campaignBest=Math.max(game.player.campaignBest,score);if(won)game.player.leadershipWins++;
  const gain=landslide?4:won?3:score>=o.cfg.threshold-10?2:1;game.player.score+=statusScore(won?45:18);game.player.teacherTrust+=won?2:1;game.player.stats.charisma=clamp(game.player.stats.charisma+gain,0,20);game.player.stats.reliability=clamp(game.player.stats.reliability+(won?2:1),0,20);
  addLegacyMark(o.platform.legacy,won?3:1);if(won)addLegacyMark('steward',2);
  game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:`${o.cfg.title}: ${result} (${score})`});
  o.phase='result';o.score=score;o.won=won;o.landslide=landslide;o.result=result;o.feedback=won?`The school chooses your ${o.platform.name} platform. Leadership now carries consequences, not just applause.`:`The result hurts, but your campaign made ${o.platform.name} part of the school conversation.`;checkAchievements();saveSilently();audio.sparkle();
}
function openLeadershipJournal(){ensureV10State();game.overlay={type:'leadership',title:'Leadership Record'};}
function drawElectionOverlay(o){
  overlayBase(o.title);centered(o.cfg.subtitle,100,15,COLORS.sky,`bold 15px ${UI_FONT}`);panel(92,128,776,286,COLORS.deep,COLORS.gold,4);
  if(o.phase==='platform'){
    centered('CHOOSE A CAMPAIGN PLATFORM',164,22,COLORS.gold,'bold 22px Trebuchet MS');
    CAMPAIGN_PLATFORMS.forEach((p,i)=>{const x=118+(i%2)*370,y=194+Math.floor(i/2)*96;panel(x,y,344,80,COLORS.navy,p.color,3);text(p.name.toUpperCase(),x+14,y+25,14,COLORS.paper,true);wrapped(p.description,x+14,y+48,314,11,COLORS.cream,2);addButton(x+232,y+47,98,24,'CHOOSE',()=>chooseCampaignPlatform(p.id),true,false,p.color);});
  }else if(o.phase==='question'){
    const q=o.cfg.questions[o.questionIndex];text(`PUBLIC DEBATE • ${o.questionIndex+1}/${o.cfg.questions.length}`,128,166,15,COLORS.gold,true);wrapped(q.prompt,128,205,704,18,COLORS.paper,4);
    q.options.forEach((option,i)=>addButton(128,282+i*44,704,34,`${i+1}. ${option}`,()=>electionAnswer(i),true,false,i===1?COLORS.blue:COLORS.navy));
  }else if(o.phase==='feedback'){
    centered(o.answers.at(-1)?.right?'TRUST GAINED':'CAMPAIGN TESTED',181,25,o.answers.at(-1)?.right?COLORS.mint:COLORS.rose,'bold 25px Trebuchet MS');wrapped(o.feedback,160,230,640,18,COLORS.paper,5);centered(`Campaign momentum ${o.campaignPoints}`,340,16,COLORS.gold,`bold 16px ${UI_FONT}`);addButton(330,368,300,42,o.questionIndex+1>=o.cfg.questions.length?'COUNT THE VOTES':'NEXT QUESTION',nextElectionQuestion);
  }else{
    centered(o.result,176,30,o.won?COLORS.gold:COLORS.rose,'bold 30px Trebuchet MS');centered(`${o.score} campaign points • ${o.correct}/${o.cfg.questions.length} strongest debate answers`,215,16,COLORS.sky,`bold 16px ${UI_FONT}`);wrapped(o.feedback,170,260,620,18,COLORS.cream,5);centered(`Leadership wins ${game.player.leadershipWins}/4 • Best campaign ${game.player.campaignBest}`,350,14,COLORS.paper,`bold 14px ${UI_FONT}`);addButton(330,382,300,44,'CONTINUE TO DAY SUMMARY',()=>{game.overlay=null;setTimeout(endDay,40);});
  }
}
function drawLeadershipJournal(o){
  overlayBase(o.title);ensureV10State();text('ANNUAL STUDENT ELECTIONS',82,103,17,COLORS.gold,true);text(`${game.player.leadershipWins}/4 victories • Best campaign ${game.player.campaignBest}`,620,103,13,COLORS.sky,true);
  LEADERSHIP_ELECTIONS.forEach((cfg,i)=>{const record=game.player.electionHistory.find(r=>r.id===cfg.id),y=126+i*72;ctx.fillStyle=record?.won?'rgba(229,184,75,.13)':'rgba(255,255,255,.04)';ctx.fillRect(82,y,796,60);ctx.strokeStyle=record?.won?COLORS.gold:'#4a5060';ctx.strokeRect(82.5,y+.5,795,59);text(`YEAR ${cfg.year} • ${cfg.title}`,100,y+22,14,record?COLORS.paper:'#777d89',true);text(record?`${record.result} • ${record.score} points • ${record.correct}/3 debate answers`:`Scheduled for Month ${cfg.month}, Day ${cfg.day}`,100,y+45,12,record?.won?COLORS.gold:COLORS.cream,true);if(record){const p=CAMPAIGN_PLATFORMS.find(x=>x.id===record.platform);text(p?.name||record.platform,666,y+34,12,p?.color||COLORS.sky,true);}});
  wrapped('Election outcomes strengthen social standing, teacher trust and graduation legacy. Losing is not a dead end: a principled campaign still builds character and changes the school conversation.',105,430,750,13,COLORS.cream,3);addButton(365,477,230,30,'CLOSE',()=>game.overlay=null);
}
