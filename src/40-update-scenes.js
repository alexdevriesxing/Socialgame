const collisionRects=[
  {x:0,y:0,w:1280,h:25},{x:0,y:775,w:1280,h:25},{x:0,y:0,w:25,h:800},{x:1255,y:0,w:25,h:800},
  {x:30,y:250,w:120,h:28},{x:190,y:250,w:180,h:28},
  {x:395,y:250,w:120,h:28},{x:555,y:250,w:180,h:28},
  {x:760,y:250,w:120,h:28},{x:920,y:250,w:180,h:28},
  {x:1125,y:250,w:30,h:28},{x:1195,y:250,w:55,h:28},
  {x:370,y:25,w:25,h:235},{x:735,y:25,w:25,h:235},{x:1100,y:25,w:25,h:235},
  {x:30,y:390,w:156,h:28},{x:234,y:390,w:360,h:28},{x:642,y:390,w:354,h:28},{x:1044,y:390,w:206,h:28},
  {x:400,y:415,w:25,h:360},{x:780,y:415,w:25,h:360},
  {x:25,y:415,w:12,h:360},{x:1245,y:415,w:12,h:360}
];
function collides(x,y){
  const f={x:x-12,y:y-10,w:24,h:12};
  return collisionRects.some(r=>f.x<r.x+r.w&&f.x+f.w>r.x&&f.y<r.y+r.h&&f.y+f.h>r.y);
}

function update(dt){
  game.notifications.forEach(n=>n.life-=dt);game.notifications=game.notifications.filter(n=>n.life>0);
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
    game.player.anim=(Math.floor(performance.now()/180)%3);
    game.player.energy=Math.max(0,game.player.energy-dt*.35);
  }else game.player.anim=1;
  game.currentRoom=getRoomAt(game.player.x,game.player.y);
  game.camera.x=clamp(game.player.x-VIEW_W/2,0,1280-VIEW_W);
  game.camera.y=clamp(game.player.y-H/2,0,800-H);
  game.timeAccumulator+=dt;
  if(game.timeAccumulator>=.5){
    const steps=Math.floor(game.timeAccumulator/.5);game.timeAccumulator-=steps*.5;game.time+=steps;
    if(game.time>900)game.time=900;
    checkSchedule();maybeTriggerEvent();
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
  centered('WASD / Arrows • E / Space interact • R rankings • Q schedule',486,14,COLORS.cream,'bold 14px Trebuchet MS');
  centered('Crisp anime edition • Complete 48-month campaign framework • v0.4',515,12,COLORS.sky,`12px ${UI_FONT}`);
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
  drawWorldMarkers();drawWorldCharacters();drawMobileControls();ctx.restore();
  drawHudPanel();
}
