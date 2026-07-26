// Sakura Crest v1.8 — expanded three-wing academy, seated classes and commercial anime presentation.
const ANIME_CAMPUS_VERSION='1.8.0';
const ANIME_CAMPUS_W=4096,ANIME_CAMPUS_H=768;
const ANIME_CLASSROOMS=new Set(['homeroom','math','literature']);
const ANIME_ROOM_GEOMETRY={
  homeroom:{name:'Class 1-A',x:58,y:18,w:280,h:205},
  math:{name:'Mathematics Room',x:354,y:18,w:280,h:205},
  literature:{name:'Literature Room',x:650,y:18,w:280,h:205},
  hallway:{name:'Grand Main Hall',x:12,y:228,w:1338,h:525},
  courtyard:{name:'Sakura Courtyard',x:1370,y:12,w:665,h:742},
  cafeteria:{name:'Crest Cafeteria',x:2044,y:12,w:676,h:742},
  library:{name:'Library & Club Hall',x:2734,y:12,w:932,h:742},
  gym:{name:'Grand Gymnasium',x:3675,y:12,w:408,h:742}
};
Object.entries(ANIME_ROOM_GEOMETRY).forEach(([id,room])=>Object.assign(ROOMS[id],room));

const ANIME_SEATS={
  homeroom:[[105,92],[160,92],[215,92],[270,92],[105,145],[160,145],[215,145],[270,145],[132,190],[242,190]],
  math:[[402,92],[457,92],[512,92],[567,92],[402,145],[457,145],[512,145],[567,145],[430,190],[540,190]],
  literature:[[698,92],[753,92],[808,92],[863,92],[698,145],[753,145],[808,145],[863,145],[725,190],[835,190]],
  hallway:[[150,365],[305,440],[470,350],[625,470],[780,365],[940,455],[1085,350],[1230,455],[410,610],[985,620]],
  courtyard:[[1510,250],[1700,220],[1890,250],[1515,470],[1710,505],[1900,470],[1580,650],[1840,650],[1710,350],[1710,610]],
  cafeteria:[[2155,210],[2300,210],[2450,210],[2600,210],[2155,390],[2300,390],[2450,390],[2600,390],[2240,575],[2520,575]],
  library:[[2815,180],[2950,180],[3090,180],[3230,180],[2815,390],[2960,390],[3110,390],[3290,390],[3440,215],[3480,520]],
  gym:[[3755,180],[3870,180],[3990,180],[3755,350],[3870,350],[3990,350],[3755,555],[3870,555],[3990,555],[3880,660]]
};
Object.entries(ANIME_SEATS).forEach(([id,points])=>CAMPUS_ROOM_POINTS[id]=points);
Object.assign(CAMPUS_ROOM_DOORS,{
  homeroom:{inside:{x:198,y:204},hall:{x:198,y:264}},
  math:{inside:{x:494,y:204},hall:{x:494,y:264}},
  literature:{inside:{x:790,y:204},hall:{x:790,y:264}},
  hallway:{inside:{x:1180,y:510},hall:{x:1180,y:510}},
  courtyard:{inside:{x:1415,y:540},hall:{x:1320,y:540}},
  cafeteria:{inside:{x:2090,y:555},hall:{x:1990,y:555}},
  library:{inside:{x:2785,y:565},hall:{x:2680,y:565}},
  gym:{inside:{x:3725,y:570},hall:{x:3625,y:570}}
});

const animeCollision=[];
function animeWall(x,y,w,h){animeCollision.push({x,y,w,h});}
animeWall(0,0,ANIME_CAMPUS_W,12);animeWall(0,756,ANIME_CAMPUS_W,12);animeWall(0,0,12,ANIME_CAMPUS_H);animeWall(4084,0,12,ANIME_CAMPUS_H);
for(const [x,door] of [[58,198],[354,494],[650,790]]){
  animeWall(x,18,280,12);animeWall(x,18,12,205);animeWall(x+268,18,12,205);
  animeWall(x,211,door-x-34,12);animeWall(door+34,211,x+280-(door+34),12);
}
for(const room of ['homeroom','math','literature'])for(const [x,y] of ANIME_SEATS[room].slice(0,8))animeWall(x-24,y-18,48,25);
[[90,300,130,42],[330,300,160,42],[720,300,160,42],[1080,300,150,42],[550,470,150,80],[930,470,150,80]].forEach(r=>animeWall(...r));
animeWall(1580,235,260,245);[[1400,40,100,175],[1905,40,110,175],[1400,590,120,140],[1900,590,120,140]].forEach(r=>animeWall(...r));
animeWall(2090,70,575,150);[[2130,285,150,75],[2350,285,150,75],[2560,285,130,75],[2160,475,170,75],[2430,475,170,75]].forEach(r=>animeWall(...r));
[[2755,60,120,270],[2920,60,120,270],[3085,60,120,270],[3250,60,120,270],[2790,500,240,80],[3110,500,240,80],[3400,70,230,235],[3400,390,230,230],[3680,20,400,40],[3680,690,400,55],[3680,20,45,715],[4035,20,45,715]].forEach(r=>animeWall(...r));
collisionRects.splice(0,collisionRects.length,...animeCollision);

if(typeof HOTSPOTS!=='undefined'){
  HOTSPOTS.splice(0,HOTSPOTS.length,
    {id:'board',name:'Grand Ranking Gallery',x:530,y:335,radius:70,text:'The live social ladders glow beside club announcements and student work.'},
    {id:'fountain',name:'Sakura Fountain',x:1710,y:525,radius:78,text:'Petals circle the fountain beneath the academy crest.'},
    {id:'counter',name:'Cafeteria Counter',x:2390,y:245,radius:72,text:'Fresh lunch sets and curry bread line the polished counter.'},
    {id:'hoop',name:'Championship Court',x:3870,y:590,radius:78,text:'The regulation court hosts practices, relays and school finals.'},
    {id:'shelves',name:'Legacy Archive',x:3040,y:615,radius:72,text:'Yearbooks and trophies preserve generations of school stories.'}
  );
}
if(typeof CAMPUS_SERVICES!=='undefined'){
  const servicePositions={noticeboard:[530,335],office:[1060,560],counselor:[1170,560],nurse:[1260,560]};
  CAMPUS_SERVICES.forEach(service=>{const p=servicePositions[service.id];if(p){service.x=p[0];service.y=p[1];service.radius=65;}});
}

const ANIME_DOORS=[
  {room:'homeroom',x:198,y:217,label:'CLASS 1-A'},
  {room:'math',x:494,y:217,label:'MATHEMATICS'},
  {room:'literature',x:790,y:217,label:'LITERATURE'},
  {room:'courtyard',x:1370,y:540,label:'COURTYARD WING'},
  {room:'cafeteria',x:2044,y:555,label:'CAFETERIA WING'},
  {room:'library',x:2734,y:565,label:'LIBRARY & CLUBS'},
  {room:'gym',x:3675,y:570,label:'GRAND GYM'}
];
const ANIME_WING_TRANSIT=[
  {x:1260,y:560,to:{x:1435,y:560},label:'COURTYARD / CAFETERIA'},
  {x:1435,y:560,to:{x:1260,y:560},label:'MAIN HALL'},
  {x:2645,y:570,to:{x:2800,y:570},label:'LIBRARY / CLUBS / GYM'},
  {x:2800,y:570,to:{x:2645,y:570},label:'COURTYARD / CAFETERIA'}
];
const animeObjectAtlas=new Image();animeObjectAtlas.src=ANIME_ART_PATHS.objects;

function animeCampusPoint(roomId,index){
  const points=ANIME_SEATS[roomId]||ANIME_SEATS.hallway,point=points[Math.abs(index)%points.length];
  return {x:point[0],y:point[1]};
}
campusPoint=animeCampusPoint;
function animeCampusPath(actor,targetRoom,target){
  const current=campusRoomForActor(actor),path=[],from=CAMPUS_ROOM_DOORS[current],to=CAMPUS_ROOM_DOORS[targetRoom];
  if(current===targetRoom)return [{...target}];
  if(current!=='hallway'&&from)path.push({...from.inside},{...from.hall});
  const corridorY=560;
  if(to&&targetRoom!=='hallway')path.push({x:to.hall.x,y:corridorY},{...to.hall},{...to.inside});
  else path.push({x:target.x,y:corridorY});
  path.push({...target});return path;
}
campusPath=animeCampusPath;

function animeEnsurePlayerLocation(){
  if(game.player.animeCampusV18)return;
  const room=ANIME_ROOM_GEOMETRY[game.currentRoom]?game.currentRoom:'hallway';
  const spawn={homeroom:[198,188],math:[494,188],literature:[790,188],hallway:[680,600],courtyard:[1450,560],cafeteria:[2100,560],library:[2800,570],gym:[3735,570]}[room]||[680,520];
  game.player.x=spawn[0];game.player.y=spawn[1];game.player.animeCampusV18=true;game.player.animeSeated=false;
  game.camera.x=clamp(game.player.x-VIEW_W/2,0,ANIME_CAMPUS_W-VIEW_W);game.camera.y=clamp(game.player.y-H/2,0,ANIME_CAMPUS_H-H);
  if(game.campus)Object.assign(game.campus,{initialized:false,signature:null});
}
function animeNearbyTransit(){return ANIME_WING_TRANSIT.map(item=>({...item,distance:Math.hypot(item.x-game.player.x,item.y-game.player.y)})).sort((a,b)=>a.distance-b.distance)[0];}
const animeBaseInteract=interact;
interact=function(){
  if(game.mode==='play'&&!game.walkable?.active&&!game.dialogue&&!game.overlay){
    const transit=animeNearbyTransit();
    if(transit&&transit.distance<78){game.player.x=transit.to.x;game.player.y=transit.to.y;game.player.animeSeated=false;audio.bell();notify(`Entered ${transit.label}`,COLORS.gold);return;}
  }
  animeBaseInteract();
};

const animeBaseTriggerClass=triggerClass;
triggerClass=function(slot,late=false){
  const room=roomForSlot(slot);
  if(ANIME_SEATS[room]){const seat=ANIME_SEATS[room][Math.min(ANIME_SEATS[room].length-1,9)];game.player.x=seat[0];game.player.y=seat[1];game.player.direction=0;game.player.anim=4;game.player.animeSeated=true;game.currentRoom=room;}
  animeBaseTriggerClass(slot,late);
};
function animeActorFrame(actor,type){
  const source=actor.source||actor,state=source.campus||{},activity=String(state.activity||'').toLowerCase(),room=state.room||getRoomAt(actor.x,actor.y);
  if(type==='player')return game.player.animeSeated?4:game.player.anim;
  if(state.state==='moving')return source.anim??1;
  if(ANIME_CLASSROOMS.has(room)||/lesson|homeroom|attendance|class/.test(activity))return 4;
  if(room==='cafeteria'||/lunch|tea|café|cafe/.test(activity))return 4;
  if(room==='library'||/read|research|study|homework|archive/.test(activity))return 7;
  if(room==='gym'||/train|physical|warm-up|coach|athletic/.test(activity))return 8;
  if(/teach|present|meeting|support|duty|greet/.test(activity))return 5;
  return Math.floor((performance.now()+actor.x*5)/1500)%2?0:6;
}
function drawWorldCharacters(){
  const actors=[...game.npcs.map(n=>({...n,type:'npc',source:n})),...game.teachers.map(t=>({...t,type:'teacher',source:t})),{...game.player,id:game.player.gender==='boy'?'player_boy':'player_girl',type:'player',source:game.player}];
  actors.sort((a,b)=>a.y-b.y);
  for(const actor of actors){
    const sx=Math.round(actor.x-game.camera.x),sy=Math.round(actor.y-game.camera.y);if(sx<-90||sx>VIEW_W+90||sy<-120||sy>H+80)continue;
    if(CHARACTER_INDEX[actor.id]===undefined)continue;
    const source=actor.source||actor,row=actor.type==='player'?game.player.direction:(source.direction??0),frame=animeActorFrame(actor,actor.type),seated=frame===4;
    ctx.fillStyle='rgba(20,24,38,.28)';ctx.beginPath();ctx.ellipse(sx,sy-2,seated?22:19,seated?7:6,0,0,Math.PI*2);ctx.fill();
    drawCharacter(actor.id,frame,row,sx-36,sy-(seated?82:100),72,seated?84:100);
    if(actor.type!=='player'&&Math.hypot(actor.x-game.player.x,actor.y-game.player.y)<82){label(actor.name,sx-66,sy-102,132,21,actor.type==='teacher'?COLORS.rose:COLORS.sky);const activity=String(source.campus?.activity||'Campus life').replace('In transit • ','→ ').slice(0,26);label(activity,sx-72,sy-78,144,18,campusActorColor(source));}
  }
}
function animeDrawDoors(){
  const now=performance.now()/500;
  for(const door of ANIME_DOORS){
    const sx=door.x-game.camera.x,sy=door.y-game.camera.y;if(sx<-100||sx>VIEW_W+100||sy<-100||sy>H+100)continue;
    const near=Math.hypot(door.x-game.player.x,door.y-game.player.y)<95;
    if(animeObjectAtlas.complete)ctx.drawImage(animeObjectAtlas,256,0,256,256,sx-34,sy-54,68,68);
    ctx.strokeStyle=near?COLORS.gold:'rgba(255,255,255,.62)';ctx.lineWidth=near?4:2;ctx.strokeRect(sx-30,sy-49,60,59);
    if(near||Math.sin(now+door.x)>.82)label(door.label,sx-58,sy-72,116,19,near?COLORS.gold:COLORS.sky);
  }
  for(const transit of ANIME_WING_TRANSIT){const sx=transit.x-game.camera.x,sy=transit.y-game.camera.y;if(sx<0||sx>VIEW_W||sy<0||sy>H)continue;const distance=Math.hypot(transit.x-game.player.x,transit.y-game.player.y);ctx.fillStyle='rgba(229,184,75,.22)';ctx.beginPath();ctx.arc(sx,sy,distance<78?30:20,0,Math.PI*2);ctx.fill();if(distance<78)label(`E • ${transit.label}`,sx-82,sy-55,164,22,COLORS.gold);}
}

const animeBaseDrawPlay=drawPlay;
drawPlay=function(){
  animeEnsurePlayerLocation();
  if(game.walkable?.active){animeBaseDrawPlay();return;}
  ctx.save();ctx.beginPath();ctx.rect(0,0,VIEW_W,H);ctx.clip();ctx.drawImage(images.school_maps,game.camera.x,game.camera.y,VIEW_W,H,0,0,VIEW_W,H);
  const season=seasonKey();ctx.fillStyle={spring:'rgba(255,190,215,.035)',summer:'rgba(255,218,132,.035)',autumn:'rgba(210,118,66,.045)',winter:'rgba(170,214,240,.055)'}[season]||'transparent';ctx.fillRect(0,0,VIEW_W,H);
  animeDrawDoors();drawWorldMarkers();if(typeof drawCampusServices==='function')drawCampusServices();drawWorldCharacters();drawAmbientWeather();drawMobileControls();ctx.restore();drawHudPanel();
};

const animeBaseUpdate=update;let animeClockAccumulator=0;
update=function(dt){
  animeEnsurePlayerLocation();
  if(game.walkable?.active){animeBaseUpdate(dt);return;}
  if(game.mode!=='play'||game.dialogue||game.overlay||game.paused){animeBaseUpdate(dt);return;}
  animeBaseUpdate(0);pollGamepad();game.notifications.forEach(n=>n.life-=dt);game.notifications=game.notifications.filter(n=>n.life>0);
  let dx=0,dy=0;if(keys.has('arrowleft')||keys.has('a'))dx--;if(keys.has('arrowright')||keys.has('d'))dx++;if(keys.has('arrowup')||keys.has('w'))dy--;if(keys.has('arrowdown')||keys.has('s'))dy++;
  if(dx||dy){game.player.animeSeated=false;const len=Math.hypot(dx,dy);dx/=len;dy/=len;const speed=game.player.energy<20?115:165,nx=game.player.x+dx*speed*dt,ny=game.player.y+dy*speed*dt;if(!collides(nx,game.player.y))game.player.x=nx;if(!collides(game.player.x,ny))game.player.y=ny;game.player.direction=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;game.player.anim=game.settings?.reducedMotion?1:1+Math.floor(performance.now()/145)%3;game.player.energy=Math.max(0,game.player.energy-dt*.28);}
  else game.player.anim=game.player.animeSeated?4:(game.settings?.reducedMotion?0:Math.floor(performance.now()/1250)%2?0:6);
  game.currentRoom=getRoomAt(game.player.x,game.player.y);game.camera.x=clamp(game.player.x-VIEW_W/2,0,ANIME_CAMPUS_W-VIEW_W);game.camera.y=clamp(game.player.y-H/2,0,ANIME_CAMPUS_H-H);updateCampusSimulation(dt);animeClockAccumulator+=dt;
  if(animeClockAccumulator>=1.15){const steps=Math.floor(animeClockAccumulator/1.15);animeClockAccumulator-=steps*1.15;game.time=Math.min(900,game.time+steps);checkSchedule();maybeTriggerEvent();maybeQueuePhoneMessage();if(game.time>=900&&!game.dialogue&&!game.overlay)endDay();}
};

const animeWorldCrops={home:[2730,0,650,768],shopping:[0,0,1365,768],cafe:[2048,0,682,768],arcade:[3330,0,345,768],park:[1365,0,683,768],public_library:[2730,0,650,768],cinema:[0,0,1365,768],sports_center:[3675,0,421,768],music_venue:[3330,0,345,768],festival:[1365,0,683,768],museum:[2730,0,650,768],study_center:[2730,0,650,768],convenience:[2048,0,682,768],station:[0,0,1365,768]};
if(typeof wwDrawScene==='function')wwDrawScene=function(){
  const state=wwEnsureState(),scene=wwScene(),location=WORLD_LOCATIONS[state.locationId]||{name:'Sakura District'},crop=animeWorldCrops[state.locationId]||animeWorldCrops.shopping;
  ctx.drawImage(images.school_maps,crop[0],crop[1],crop[2],crop[3],0,0,WW_MAP_W,WW_MAP_H);
  const vignette=ctx.createLinearGradient(0,0,0,WW_MAP_H);vignette.addColorStop(0,'rgba(10,17,31,.08)');vignette.addColorStop(.72,'rgba(10,17,31,.05)');vignette.addColorStop(1,'rgba(10,17,31,.42)');ctx.fillStyle=vignette;ctx.fillRect(0,0,WW_MAP_W,WW_MAP_H);
  ctx.save();ctx.shadowColor='rgba(0,0,0,.35)';ctx.shadowBlur=14;uiRoundedPath(360,62,460,64,18);ctx.fillStyle='rgba(18,28,47,.88)';ctx.fill();ctx.strokeStyle=scene.accent;ctx.lineWidth=3;ctx.stroke();ctx.restore();centeredAt(location.name.toUpperCase(),590,102,23,'#fff7e8',`bold 23px ${UI_FONT}`);
};

function drawTitle(){
  ctx.drawImage(images.keyart,0,0,W,H);const shade=ctx.createLinearGradient(560,0,W,0);shade.addColorStop(0,'rgba(8,12,24,0)');shade.addColorStop(1,'rgba(8,12,24,.72)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  panel(675,54,251,350,'rgba(15,22,38,.78)',COLORS.gold,3);text('BEGIN YOUR STORY',700,88,16,COLORS.gold,true);text('COMMERCIAL ANIME EDITION',700,108,10,COLORS.mint,true);
  addButton(700,132,201,45,'NEW GAME',()=>{audio.startMusic();resetGame();game.mode='creator';creator.classList.remove('hidden');});
  addButton(700,187,201,45,'CONTINUE',()=>{audio.startMusic();if(!loadGame())notify('No valid save found yet.',COLORS.red);},!!localStorage.getItem(SAVE_KEY)||!!localStorage.getItem(SAVE_BACKUP_KEY)||!!localStorage.getItem(SAVE_TEMP_KEY));
  addButton(700,242,201,41,'HOW TO PLAY',()=>game.overlay={type:'help',title:'How to Play'});addButton(700,293,201,41,'AUDIO & ACCESSIBILITY',openAccessibility);
  wrapped('Three academy wings • seated lessons • 16 animated characters • 14 illustrated destinations',700,363,201,11,COLORS.cream,3);panel(22,18,225,43,'rgba(14,22,39,.72)',COLORS.pink,2);text('SAKURA CREST • v1.8',38,45,15,COLORS.paper,true);
}
function validateAnimeCampusV18(){
  const errors=[];if(ANIME_CAMPUS_W<4000||ANIME_CAMPUS_H<700)errors.push('campus scale');if(Object.keys(ANIME_ROOM_GEOMETRY).length!==8)errors.push('room count');if(ANIME_DOORS.length<7)errors.push('door count');for(const id of ANIME_CLASSROOMS){if((ANIME_SEATS[id]||[]).length<10)errors.push(`${id} seating`);if(!CAMPUS_ROOM_DOORS[id])errors.push(`${id} door`);}if(collisionRects.length<35)errors.push('collision detail');return {valid:errors.length===0,errors,version:ANIME_CAMPUS_VERSION,width:ANIME_CAMPUS_W,height:ANIME_CAMPUS_H,rooms:Object.keys(ANIME_ROOM_GEOMETRY).length,doors:ANIME_DOORS.length,classroomSeats:[...ANIME_CLASSROOMS].reduce((n,id)=>n+ANIME_SEATS[id].length,0),walkableLocations:Object.keys(animeWorldCrops).length,proceduralPlaceholders:false};
}
window.SAKURA_ANIME_CAMPUS={version:ANIME_CAMPUS_VERSION,width:ANIME_CAMPUS_W,height:ANIME_CAMPUS_H,rooms:ANIME_ROOM_GEOMETRY,doors:ANIME_DOORS,validate:validateAnimeCampusV18};
