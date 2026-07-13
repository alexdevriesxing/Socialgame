function relationshipTier(value){
  if(value>=15)return 'Confidant';
  if(value>=9)return 'Close Friend';
  if(value>=4)return 'Friend';
  if(value>=1)return 'Acquaintance';
  if(value<0)return 'Strained';
  return 'New Face';
}
function completedRouteCount(npcId){return game.player.routeScenes.filter(id=>id.startsWith(`${npcId}-`)).length;}
function nextRouteScene(npc){
  const rel=game.player.relationships[npc.id]||0;
  return (RELATIONSHIP_ROUTES[npc.id]||[]).find(route=>rel>=route.threshold&&!game.player.routeScenes.includes(route.id))||null;
}
function triggerRouteScene(npc,route){
  const choices=route.choices.map(routeChoice=>({
    text:routeChoice.text,
    effects:routeChoice.effects,
    relationship:[npc.id,routeChoice.bond||2],
    achievement:`Friendship route: ${npc.name} — ${route.title}`,
    result:routeChoice.result,
    action:()=>{
      if(!game.player.routeScenes.includes(route.id))game.player.routeScenes.push(route.id);
      game.player.score+=statusScore(6+completedRouteCount(npc.id)*2);
      notify(`${npc.name} route advanced: ${route.title}`,COLORS.gold);
      audio.good();
    }
  }));
  openDialogue({speaker:`${npc.name} • ${route.title}`,portrait:npc.portrait,scene:route.scene,text:route.text,choices});
}
function dailyBrief(){
  const id=`${game.year}-${game.month}-${game.day}`;
  if(!game.dailyBrief||game.dailyBrief.id!==id)game.dailyBrief=createDailyBrief(game.year,game.month,game.day,game.player.club);
  return game.dailyBrief;
}
function showMorningBrief(){
  const brief=dailyBrief();
  if(game.dayFlags.brief)return;
  game.dayFlags.brief=true;
  const featured=NPCS[brief.featuredIndex%NPCS.length];
  const effects={score:2,energy:3};
  if(game.day%5===0)effects[brief.bonusStat]=1;
  openDialogue({
    speaker:`Morning Broadcast • ${brief.weather}`,
    scene:(game.month+game.day)%8,
    text:`${brief.weatherText}\n\nCampus notice: ${brief.notice}\n\nToday’s social pressure: ${brief.pressure}\n\nStudent spotlight: ${featured.name} of ${featured.clique}.`,
    choices:[{text:'Start the school day.',effects,result:`You note the announcement and step into the day with a clearer plan.${game.day%5===0?` ${brief.bonusStat} improves from the weekly momentum bonus.`:''}`}]
  });
}
function startClubChallenge(source='Club practice'){
  if(game.dayFlags.challenge&&source!=='Monthly showcase'){
    notify('Today’s scored club challenge is already complete.',COLORS.sky);return;
  }
  const cfg=CLUB_CHALLENGES[game.player.club];
  const stat=game.player.stats[cfg.stat]||0;
  game.overlay={
    type:'challenge',title:cfg.title,source,cfg,phase:'active',round:0,hits:[],elapsed:0,
    targetCenter:challengeTarget(0),targetWidth:clamp(.12+stat*.004,.12,.2),position:.05,flash:0
  };
}
function challengeTarget(round){
  const seed=game.year*37+game.month*29+game.day*17+round*23+game.player.club.length*11;
  return .25+(seed%51)/100;
}
function updateChallenge(dt){
  const o=game.overlay;if(o?.type!=='challenge'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,(o.flash||0)-dt);
  const speed=2.35+o.round*.42+game.year*.12;
  o.position=.5+.47*Math.sin(o.elapsed*speed+o.round*.85);
}
function challengeHit(){
  const o=game.overlay;if(o?.type!=='challenge'||o.phase!=='active')return;
  const distance=Math.abs(o.position-o.targetCenter);
  const inside=distance<=o.targetWidth/2;
  const accuracy=Math.round(clamp(100-distance*175+(inside?12:0),0,100));
  o.hits.push(accuracy);o.flash=.28;audio.tone(inside?840:260,.1,inside?'sine':'sawtooth',.03);
  if(o.hits.length>=3){finishClubChallenge();return;}
  o.round++;o.targetCenter=challengeTarget(o.round);o.elapsed=.2+o.round*.17;
}
function finishClubChallenge(){
  const o=game.overlay,cfg=o.cfg;
  const average=Math.round(o.hits.reduce((sum,value)=>sum+value,0)/o.hits.length);
  let grade='Practice Complete',xp=5,score=2,statGain=0,color=COLORS.sky;
  if(average>=88){grade='Summit Performance';xp=28;score=20;statGain=2;color=COLORS.gold;}
  else if(average>=72){grade='Excellent';xp=20;score=13;statGain=1;color=COLORS.mint;}
  else if(average>=52){grade='Solid';xp=13;score=8;statGain=1;color=COLORS.sky;}
  else {game.player.stress=clamp(game.player.stress+2,0,100);}
  awardClubXP(xp,`${cfg.title}: ${grade}`);
  applyEffects({score,[cfg.stat]:statGain});
  game.player.challengeAttempts++;
  game.player.challengeBest[game.player.club]=Math.max(game.player.challengeBest[game.player.club]||0,average);
  game.player.monthlyChallengeScores.push({year:game.year,month:game.month,day:game.day,club:game.player.club,score:average});
  game.dayFlags.challenge=true;progressMission('club',1);
  o.phase='result';o.average=average;o.grade=grade;o.resultColor=color;
}
function drawChallengeOverlay(o){
  overlayBase(`${o.title} • ${o.source}`);
  const cfg=o.cfg;
  centered(cfg.instruction,103,15,COLORS.cream,`bold 15px ${UI_FONT}`);
  panel(105,142,750,195,COLORS.deep,cfg.color,4);
  if(o.phase==='active'){
    const x=155,y=228,w=650,h=42;
    text(`ROUND ${o.hits.length+1}/3 • ${cfg.labels[o.round]}`,155,190,18,cfg.color,true);
    ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    const targetX=x+o.targetCenter*w,targetW=o.targetWidth*w;
    ctx.fillStyle='rgba(229,184,75,.38)';ctx.fillRect(targetX-targetW/2,y,targetW,h);
    ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);
    const markerX=x+o.position*w;
    ctx.fillStyle=o.flash>0?COLORS.white:cfg.color;ctx.fillRect(markerX-5,y-15,10,h+30);
    text('Too early',x,y+72,12,COLORS.cream,true);text('Perfect timing',x+w/2-42,y+72,12,COLORS.gold,true);text('Too late',x+w-48,y+72,12,COLORS.cream,true);
    o.hits.forEach((hit,i)=>text(`${i+1}: ${hit}%`,225+i*170,318,14,hit>=72?COLORS.mint:COLORS.paper,true));
    addButton(330,380,300,56,'HIT • E / SPACE',challengeHit,true,false,cfg.color);
  }else{
    centered(o.grade,192,30,o.resultColor,'bold 30px Trebuchet MS');
    centered(`${o.average}% average accuracy`,236,20,COLORS.paper,'bold 20px Trebuchet MS');
    wrapped(`Best ${clubConfig().name} score: ${game.player.challengeBest[game.player.club]}%. Strong challenge results improve monthly competition outcomes and club prestige.`,220,278,520,15,COLORS.cream,4);
    addButton(330,390,300,44,'RETURN TO SCHOOL',()=>game.overlay=null);
  }
}
function drawRelationshipsOverlay(o){
  overlayBase(o.title);
  text('FRIENDSHIP ROUTES',86,103,17,COLORS.sky,true);
  text(`${game.player.routeScenes.length}/30 route chapters completed`,650,103,13,COLORS.gold,true);
  NPCS.forEach((npc,index)=>{
    const col=index%2,row=Math.floor(index/2),x=82+col*414,y=125+row*62;
    const value=game.player.relationships[npc.id]||0,tier=relationshipTier(value),done=completedRouteCount(npc.id);
    ctx.fillStyle=index%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.055)';ctx.fillRect(x,y,390,52);
    const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;
    ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,x+4,y+4,44,44);
    text(npc.name,x+58,y+20,14,COLORS.paper,true);
    text(`${tier} • Bond ${value}`,x+58,y+40,12,value>=9?COLORS.gold:COLORS.sky,true);
    text(`${done}/3`,x+340,y+31,15,done===3?COLORS.mint:COLORS.cream,true);
  });
  addButton(170,466,135,32,'PHONE',openPhone);
  addButton(320,466,135,32,'MEMORIES',()=>game.overlay={type:'memories',title:'Memory Gallery',page:0});
  addButton(470,466,135,32,'YEARBOOK',openYearbook);
  addButton(620,466,135,32,'CLOSE',()=>game.overlay=null);
}
