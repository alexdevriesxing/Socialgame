const collisionRects=[
  // Outer boundaries
  {x:0,y:0,w:1280,h:25},{x:0,y:775,w:1280,h:25},{x:0,y:0,w:25,h:800},{x:1255,y:0,w:25,h:800},
  // Upper room bottom walls with door gaps
  {x:30,y:250,w:120,h:28},{x:190,y:250,w:180,h:28},
  {x:395,y:250,w:120,h:28},{x:555,y:250,w:180,h:28},
  {x:760,y:250,w:120,h:28},{x:920,y:250,w:180,h:28},
  {x:1125,y:250,w:30,h:28},{x:1195,y:250,w:55,h:28},
  // Upper room side dividers
  {x:370,y:25,w:25,h:235},{x:735,y:25,w:25,h:235},{x:1100,y:25,w:25,h:235},
  // Hall lower walls, doors gaps
  {x:30,y:390,w:156,h:28},{x:234,y:390,w:360,h:28},{x:642,y:390,w:354,h:28},{x:1044,y:390,w:206,h:28},
  // Lower room dividers
  {x:400,y:415,w:25,h:360},{x:780,y:415,w:25,h:360},
  // room outer side walls lower
  {x:25,y:415,w:12,h:360},{x:1245,y:415,w:12,h:360}
];
function collides(x,y){
  const f={x:x-12,y:y-10,w:24,h:12};
  return collisionRects.some(r=>f.x<r.x+r.w&&f.x+f.w>r.x&&f.y<r.y+r.h&&f.y+f.h>r.y);
}

function update(dt){
  pollGamepad();
  game.notifications.forEach(n=>n.life-=dt);game.notifications=game.notifications.filter(n=>n.life>0);
  if(game.overlay?.type==='challenge'){updateChallenge(dt);return;}
  if(game.overlay?.type==='showcase'){updateShowcase(dt);return;}
  if(game.overlay?.type==='activityMastery'){updateCampusMastery(dt);return;}
  if(game.overlay?.type==='exam')return;
  if(game.mode!=='play'||game.dialogue||game.overlay||game.paused)return;
  let dx=0,dy=0;
  if(keys.has('arrowleft')||keys.has('a'))dx--;
  if(keys.has('arrowright')||keys.has('d'))dx++;
  if(keys.has('arrowup')||keys.has('w'))dy--;
  if(keys.has('arrowdown')||keys.has('s'))dy++;
  if(dx||dy){
    const len=Math.hypot(dx,dy);dx/=len;dy/=len;
    const speed=(game.player.energy<20?70:105);
    const nx=game.player.x+dx*speed*dt,ny=game.player.y+dy*speed*dt;
    if(!collides(nx,game.player.y))game.player.x=nx;
    if(!collides(game.player.x,ny))game.player.y=ny;
    if(Math.abs(dx)>Math.abs(dy))game.player.direction=dx<0?1:2;else game.player.direction=dy<0?3:0;
    game.player.anim=game.settings?.reducedMotion?1:(Math.floor(performance.now()/180)%3);
    game.player.energy=Math.max(0,game.player.energy-dt*.35);
  }else game.player.anim=game.settings?.reducedMotion?3:(Math.floor(performance.now()/900)%2?3:4);
  game.currentRoom=getRoomAt(game.player.x,game.player.y);
  game.camera.x=clamp(game.player.x-VIEW_W/2,0,1280-VIEW_W);
  game.camera.y=clamp(game.player.y-H/2,0,800-H);
  game.timeAccumulator+=dt;
  if(game.timeAccumulator>=.5){
    const steps=Math.floor(game.timeAccumulator/.5);game.timeAccumulator-=steps*.5;game.time+=steps;
    if(game.time>900)game.time=900;
    checkSchedule();maybeTriggerEvent();maybeQueuePhoneMessage();
    if(game.time>=900&&!game.dialogue&&!game.overlay)endDay();
  }
}

function draw(){
  ctx.clearRect(0,0,W,H);buttons=[];
  if(game.mode==='title')drawTitle();
  else if(game.mode==='creator')drawCreator();
  else if(game.mode==='play')drawPlay();
  else if(game.mode==='prom')drawProm();
  if(game.dialogue)drawDialogue();
  if(game.overlay)drawOverlay();
  drawNotifications();
}

function drawTitle(){
  ctx.drawImage(images.keyart,0,0,W,H);
  ctx.fillStyle='rgba(12,14,24,.35)';ctx.fillRect(0,0,W,H);
  panel(140,26,680,112,COLORS.ink,COLORS.gold,5);
  centered('SAKURA CREST',65,40,COLORS.paper,'bold 42px Trebuchet MS');
  centered('SOCIAL SUMMIT',109,24,COLORS.pink,'bold 25px Trebuchet MS');
  centered('Four school years. Forty-eight rankings. One unforgettable prom.',164,18,COLORS.paper,'bold 18px Trebuchet MS');
  addButton(340,235,280,48,'NEW GAME',()=>{audio.startMusic();resetGame();game.mode='creator';creator.classList.remove('hidden');});
  addButton(340,295,280,48,'CONTINUE',()=>{audio.startMusic();if(!loadGame())notify('No save found yet.',COLORS.red);},!!localStorage.getItem(SAVE_KEY));
  addButton(340,355,280,48,'HOW TO PLAY',()=>game.overlay={type:'help',title:'How to Play'});
  addButton(340,415,280,42,'ACCESSIBILITY & CONTROLS',openAccessibility);
  centered('WASD / Arrows • E interact • O options • Controller supported',486,14,COLORS.cream,'bold 14px Trebuchet MS');
  centered('Exams & New Game+ edition • Weekend outings • v0.9',515,12,COLORS.sky,`12px ${UI_FONT}`);
}

function drawCreator(){
  ctx.drawImage(images.keyart,0,0,W,H);ctx.fillStyle='rgba(13,15,26,.78)';ctx.fillRect(0,0,W,H);
  panel(35,25,890,440,COLORS.panel,COLORS.gold,4);
  centered('CREATE YOUR STUDENT',60,28,COLORS.paper,'bold 28px Trebuchet MS');
  text('Choose your ranking ladder',60,102,16,COLORS.sky,true);
  charCard(60,125,'boy','BOYS LADDER','player_boy',game.creatorGender==='boy');
  charCard(230,125,'girl','GIRLS LADDER','player_girl',game.creatorGender==='girl');
  text('Choose a school circle / club',440,102,16,COLORS.sky,true);
  Object.entries(CLUBS).forEach(([id,c],i)=>{
    const x=440+(i%2)*220,y=125+Math.floor(i/2)*112;
    addButton(x,y,198,86,c.name,()=>game.creatorClub=id,true,game.creatorClub===id,c.color);
    wrapped(c.blurb,x+10,y+44,178,14,COLORS.cream,3);
  });
  text('Choose starting social status / difficulty',60,330,16,COLORS.sky,true);
  Object.entries(SOCIAL_STATUS_LEVELS).forEach(([id,status],i)=>{
    const x=60+i*282,y=348;
    addButton(x,y,260,72,`${status.name} • ${status.difficulty}`,()=>game.creatorStatus=id,true,game.creatorStatus===id,id==='outsider'?COLORS.rose:id==='established'?COLORS.green:COLORS.blue);
    wrapped(status.description,x+10,y+38,240,11,COLORS.cream,3);
  });
  text('Status changes invitations, club gates, rumor risk, penalties and ranking pressure.',60,442,13,COLORS.gold,true);
}
function charCard(x,y,id,label,characterName,selected){
  panel(x,y,145,190,selected?COLORS.navy:COLORS.deep,selected?COLORS.gold:COLORS.sky,selected?4:2);
  drawCharacter(characterName,1,0,x+39,y+18,68,92);
  centeredAt(label,x+72,y+112,14,selected?COLORS.gold:COLORS.paper,'bold 14px Trebuchet MS');
  wrapped(id==='boy'?'Compete for Prom King.':'Compete for Prom Queen.',x+12,y+137,120,13,COLORS.cream,3);
  addButton(x+12,y+158,120,25,selected?'SELECTED':'CHOOSE',()=>game.creatorGender=id,true,selected);
}

function drawPlay(){
  ctx.save();ctx.beginPath();ctx.rect(0,0,VIEW_W,H);ctx.clip();
  const seasonIndex={spring:0,summer:1,autumn:2,winter:3}[seasonKey()]??0;const mapX=(seasonIndex%2)*640+game.camera.x*.5,mapY=Math.floor(seasonIndex/2)*400+game.camera.y*.5;ctx.drawImage(images.school_maps,mapX,mapY,VIEW_W*.5,H*.5,0,0,VIEW_W,H);
  drawWorldMarkers();drawWorldCharacters();drawAmbientWeather();drawMobileControls();ctx.restore();
  drawHudPanel();
}

function drawWorldMarkers(){
  const slot=currentSlot();const target=roomForSlot(slot);
  if(slot&&!slot.optional&&ROOMS[target]){
    const r=ROOMS[target],sx=r.x+r.w/2-game.camera.x,sy=r.y+22-game.camera.y;
    const pulse=3+Math.sin(performance.now()/180)*2;
    ctx.fillStyle=game.time>slot.start+(slot.grace||5)?COLORS.red:COLORS.gold;
    ctx.beginPath();ctx.moveTo(sx,sy-pulse);ctx.lineTo(sx-8,sy-16-pulse);ctx.lineTo(sx+8,sy-16-pulse);ctx.closePath();ctx.fill();
  }
  for(const h of HOTSPOTS){
    const sx=h.x-game.camera.x,sy=h.y-game.camera.y;if(sx<0||sx>VIEW_W||sy<0||sy>H)continue;
    if(Math.hypot(h.x-game.player.x,h.y-game.player.y)<h.radius){
      ctx.fillStyle='rgba(229,184,75,.25)';ctx.beginPath();ctx.arc(sx,sy,h.radius*.55,0,Math.PI*2);ctx.fill();
      label('E INTERACT',sx-42,sy-54,84,20,COLORS.gold);
    }
  }
}
function drawWorldCharacters(){
  const actors=[...game.npcs.map(n=>({...n,type:'npc'})),...game.teachers.map(t=>({...t,type:'teacher'})),{...game.player,id:game.player.gender==='boy'?'player_boy':'player_girl',type:'player'}];
  actors.sort((a,b)=>a.y-b.y);
  for(const a of actors){
    const sx=Math.round(a.x-game.camera.x),sy=Math.round(a.y-game.camera.y);if(sx<-60||sx>VIEW_W+60||sy<-80||sy>H+50)continue;
    if(CHARACTER_INDEX[a.id]===undefined)continue;
    const row=a.type==='player'?game.player.direction:0;let col=a.type==='player'?game.player.anim:(Math.floor((performance.now()+a.x*7)/1100)%2?3:4);if(a.type==='npc'&&sameLadder(a)&&(game.player.rivalHeat[a.id]||0)>=12)col=5;if(a.type==='npc'&&(game.player.relationships[a.id]||0)>=15)col=6;if(a.type==='npc'&&(game.player.friendshipMoments||[]).some(id=>id.startsWith(a.id)))col=Math.floor(performance.now()/1400)%2?7:8;
    ctx.fillStyle='rgba(20,20,30,.28)';ctx.beginPath();ctx.ellipse(sx,sy-2,18,7,0,0,Math.PI*2);ctx.fill();
    drawCharacter(a.id,col,row,sx-31,sy-86,62,86);
    if(a.type!=='player'&&Math.hypot(a.x-game.player.x,a.y-game.player.y)<72)label(a.name,sx-58,sy-82,116,20,a.type==='teacher'?COLORS.rose:COLORS.sky);
  }
}

function drawAmbientWeather(){
  const brief=dailyBrief(),now=performance.now()/1000,season=seasonKey();
  ctx.save();ctx.globalAlpha=.65;
  const count=season==='winter'?34:season==='spring'?28:brief.weather.includes('Rain')?42:18;
  for(let i=0;i<count;i++){
    const seed=i*83+game.month*41+game.day*19;
    let x=(seed*13+now*(brief.weather.includes('Rain')?150:24))%(VIEW_W+70)-35;
    let y=(seed*29+now*(brief.weather.includes('Rain')?240:season==='winter'?34:22))%(H+80)-40;
    if(brief.weather.includes('Rain')){ctx.strokeStyle='#c6e2f1';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+18);ctx.stroke();}
    else if(season==='winter'){ctx.fillStyle='white';ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fill();}
    else if(season==='spring'){ctx.fillStyle=i%3?'#f4a9bd':'#fff0f4';ctx.save();ctx.translate(x,y);ctx.rotate(now+i);ctx.beginPath();ctx.ellipse(0,0,5,2,0,0,Math.PI*2);ctx.fill();ctx.restore();}
    else if(season==='autumn'){ctx.fillStyle=i%2?'#d88750':'#e5b84b';ctx.save();ctx.translate(x,y);ctx.rotate(now*.7+i);ctx.fillRect(-3,-2,7,4);ctx.restore();}
  }
  ctx.restore();
}

function drawMobileControls(){
  if(!game.showControls)return;
  const alpha=.55;ctx.globalAlpha=alpha;
  [['↑',72,410,'arrowup'],['←',30,452,'arrowleft'],['↓',72,452,'arrowdown'],['→',114,452,'arrowright']].forEach(([lab,x,y,key])=>{
    addButton(x,y,38,38,lab,()=>{},true,false,COLORS.navy,{holdKey:key,world:true});
  });
  addButton(625,445,64,64,'E',interact,true,false,COLORS.rose,{world:true});
  ctx.globalAlpha=1;
}

function drawHudPanel(){
  ctx.fillStyle=COLORS.panel;ctx.fillRect(PANEL_X,0,PANEL_W,H);ctx.fillStyle=COLORS.gold;ctx.fillRect(PANEL_X,0,4,H);
  text(`YEAR ${game.year} • MONTH ${game.month}`,738,22,14,COLORS.gold,true);
  text(campaignMonth().title,738,39,10,COLORS.sky,true);
  text(`DAY ${game.day}/20 • ${statusConfig().badge}`,738,54,11,COLORS.paper,true);
  text(`${currentClubRank()} • ${game.player.clubXP} XP`,738,68,10,clubConfig().color,true);
  panel(736,76,208,54,COLORS.deep,COLORS.sky,2);
  text(formatTime(game.time),748,105,24,COLORS.white,true);
  const slot=currentSlot(),next=nextSlot();
  wrapped(slot?.title||'School day complete',812,87,122,12,COLORS.sky,2);
  if(next)wrapped(`Next ${formatTime(next.start)} ${next.title}`,812,109,122,10,COLORS.cream,2);
  const rank=getPlayerRank(game.player.gender);
  panel(736,138,208,64,COLORS.deep,COLORS.gold,2);
  text(`${game.player.gender==='boy'?'BOYS':'GIRLS'} RANK`,748,159,12,COLORS.cream,true);
  text(`#${rank.position}`,748,191,30,COLORS.gold,true);
  text(`${rank.score} pts`,818,187,16,COLORS.paper,true);
  drawBar(742,215,194,12,game.player.energy,100,COLORS.mint,'ENERGY');
  drawBar(742,239,194,12,game.player.stress,100,COLORS.rose,'STRESS');
  text('TODAY',738,276,14,COLORS.sky,true);
  game.missions.forEach((m,i)=>{
    const y=292+i*43;ctx.fillStyle=m.done?'rgba(77,139,104,.28)':'rgba(255,255,255,.04)';ctx.fillRect(736,y,208,38);
    text(m.done?'✓':'•',744,y+19,15,m.done?COLORS.mint:COLORS.gold,true);
    wrapped(m.title,762,y+13,164,12,COLORS.paper,1);text(`${m.progress}/${m.goal}`,880,y+31,10,COLORS.cream,true);
  });
  addButton(736,412,98,26,'RANKINGS',()=>game.overlay={type:'rankings',title:'Live Social Rankings'});
  addButton(846,412,98,26,'SCHEDULE',()=>game.overlay={type:'schedule',title:'Class Schedule'});
  addButton(736,444,98,26,'CLUB',()=>game.overlay={type:'club',title:clubConfig().name});
  addButton(846,444,98,26,unreadMessageCount()?`PHONE ${unreadMessageCount()}`:'FRIENDS',()=>unreadMessageCount()?openPhone():game.overlay={type:'relationships',title:'Friendships'},true,false,unreadMessageCount()?COLORS.rose:COLORS.blue);
  addButton(736,476,98,26,'SAVE',saveGame);
  addButton(846,476,98,26,audio.enabled?'SOUND ON':'SOUND OFF',()=>audio.toggle());
  const brief=dailyBrief();
  text(`${brief.weather} • ${ROOMS[game.currentRoom]?.name||'School Grounds'}`,738,526,10,COLORS.cream,true);
}
function drawBar(x,y,w,h,val,max,color,labelText){
  text(labelText,x,y-4,10,COLORS.cream,true);ctx.fillStyle=COLORS.ink;ctx.fillRect(x+48,y-12,w-48,h);
  ctx.fillStyle=color;ctx.fillRect(x+49,y-11,(w-50)*clamp(val/max,0,1),h-2);text(`${Math.round(val)}`,x+w-25,y-3,10,COLORS.paper,true);
}

function drawDialogue(){
  const d=game.dialogue;const boxY=350;
  ctx.fillStyle='rgba(9,11,18,.78)';ctx.fillRect(0,0,W,H);
  panel(28,boxY,904,164,COLORS.ink,COLORS.gold,4);
  if(d.portrait!==null&&d.portrait!==undefined){
    const sx=(d.portrait%4)*PORTRAIT_CELL,sy=Math.floor(d.portrait/4)*PORTRAIT_CELL;
    ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,42,360,136,136);
  }
  if(d.scene!==null&&d.scene!==undefined&&images[d.atlas||'event_atlas']){
    const ex=(d.scene%4)*200,ey=Math.floor(d.scene/4)*200;const atlas=images[d.atlas||'event_atlas'];
    panel(590,62,318,250,'rgba(18,25,42,.92)',COLORS.sky,3);
    ctx.save();ctx.beginPath();ctx.rect(600,72,298,230);ctx.clip();ctx.drawImage(atlas,ex,ey,200,200,600,72,298,230);ctx.restore();
  }
  const tx=d.portrait!==null&&d.portrait!==undefined?194:52;
  text(d.speaker.toUpperCase(),tx,377,18,COLORS.gold,true);
  d.reveal=Math.min(d.text.length,d.reveal+2.2);
  const shown=d.text.slice(0,Math.floor(d.reveal));
  wrapped(shown,tx,398,730-(tx-178),16,COLORS.paper,5);
  if(d.reveal>=d.text.length){
    const choices=d.choices?.length?d.choices:[{text:'Continue'}];
    choices.forEach((c,i)=>{
      const cw=choices.length>2?350:Math.min(360,760/choices.length-10);
      const row=Math.floor(i/2),col=i%2;const x=tx+col*(cw+12),y=458+row*34;
      addButton(x,y,cw,28,`${choiceLabel(i)}  ${c.text}`,()=>closeDialogue(i),true,d.selected===i,COLORS.navy);
    });
  }else text('Press E / Space to reveal',710,496,11,COLORS.sky,true);
}

function drawOverlay(){
  const o=game.overlay;ctx.fillStyle='rgba(9,11,18,.88)';ctx.fillRect(0,0,W,H);
  if(o.type==='rankings')drawRankingsOverlay(o);
  else if(o.type==='schedule')drawScheduleOverlay(o);
  else if(o.type==='club')drawClubOverlay(o);
  else if(o.type==='help')drawHelpOverlay(o);
  else if(o.type==='dayEnd')drawDayEnd(o);
  else if(o.type==='monthEnd')drawMonthEnd(o);
  else if(o.type==='relationships')drawRelationshipsOverlay(o);
  else if(o.type==='challenge')drawChallengeOverlay(o);
  else if(o.type==='phone')drawPhoneOverlay(o);
  else if(o.type==='memories')drawMemoryGallery(o);
  else if(o.type==='showcase')drawShowcaseOverlay(o);
  else if(o.type==='rivals')drawRivalBoard(o);
  else if(o.type==='campus')drawCampusPlanner(o);
  else if(o.type==='yearbook')drawYearbook(o);
  else if(o.type==='moments')drawMomentGallery(o);
  else if(o.type==='activityMastery')drawCampusMasteryOverlay(o);
  else if(o.type==='legacy')drawLegacyOverlay(o);
  else if(o.type==='exam')drawExamOverlay(o);
  else if(o.type==='weekend')drawWeekendOverlay(o);
  else if(o.type==='newGamePlus')drawNewGamePlusOverlay(o);
  else if(o.type==='accessibility')drawAccessibilityOverlay(o);
  else if(o.type==='election')drawElectionOverlay(o);
  else if(o.type==='leadership')drawLeadershipJournal(o);
}
