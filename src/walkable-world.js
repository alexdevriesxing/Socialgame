// Walkable District v1.5 — commercial-quality free-roaming bedroom and off-campus areas.
const WALKABLE_WORLD_VERSION='1.5.0';
const WW_MAP_W=1180,WW_MAP_H=760;
const WW_BOUNDARY=[{x:0,y:0,w:WW_MAP_W,h:54},{x:0,y:720,w:WW_MAP_W,h:40},{x:0,y:0,w:42,h:WW_MAP_H},{x:1138,y:0,w:42,h:WW_MAP_H}];

const WW_SCENES={
  home:{kind:'bedroom',start:[585,650],accent:'#db8fa8',obstacles:[
    {x:68,y:88,w:300,h:210},{x:760,y:82,w:330,h:190},{x:65,y:398,w:225,h:260},{x:805,y:390,w:275,h:245}
  ],npcSpots:[],hotspots:[
    ['bed',220,326,'REST','Recover energy and lower stress.'],['wardrobe',315,545,'WARDROBE','Open the full style studio.'],
    ['collection',780,555,'COLLECTIONS','Review keepsakes and displays.'],['desk',750,305,'MEMORY DESK','Reflect and save the day.'],
    ['map',580,690,'DISTRICT MAP','Choose another walkable destination.'],['school',1040,690,'RETURN TO SCHOOL','Return to Sakura Crest Academy.']
  ]},
  shopping:{kind:'street',start:[580,650],accent:'#e8bf59',obstacles:[
    {x:42,y:54,w:1096,h:192},{x:72,y:480,w:245,h:190},{x:855,y:480,w:245,h:190}
  ],npcSpots:[[410,390],[730,388]],hotspots:[
    ['gifts',270,270,'GIFT BOUTIQUE','Buy thoughtful gifts.'],['wardrobe',718,270,'STYLE BOUTIQUE','Browse hair, outfits and accessories.'],
    ['explore',585,385,'WINDOW WALK','Explore the shopping street.'],['map',500,690,'DISTRICT MAP','Choose another destination.'],['school',1040,690,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  cafe:{kind:'cafe',start:[585,650],accent:'#d88957',obstacles:[
    {x:42,y:54,w:1096,h:150},{x:90,y:250,w:260,h:105},{x:450,y:250,w:260,h:105},{x:810,y:250,w:260,h:105},
    {x:210,y:430,w:260,h:108},{x:710,y:430,w:260,h:108}
  ],npcSpots:[[390,395],[790,395]],hotspots:[
    ['explore',585,215,'ORDER & RELAX','Enjoy a drink and conversation.'],['gifts',1000,220,'COUNTER SHOP','Buy tea and small gifts.'],
    ['map',500,690,'DISTRICT MAP','Choose another destination.'],['school',1040,690,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  arcade:{kind:'arcade',start:[580,660],accent:'#9b83df',obstacles:[
    {x:42,y:54,w:1096,h:100},{x:85,y:190,w:180,h:175},{x:315,y:190,w:180,h:175},{x:685,y:190,w:180,h:175},{x:915,y:190,w:180,h:175},
    {x:210,y:455,w:260,h:110},{x:710,y:455,w:260,h:110}
  ],npcSpots:[[565,330],[590,510]],hotspots:[
    ['explore',585,395,'STARLINE CHALLENGE','Play a featured cabinet.'],['gifts',1000,590,'PRIZE COUNTER','Trade allowance for gifts.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  park:{kind:'park',start:[590,680],accent:'#78b985',obstacles:[
    {x:445,y:205,w:295,h:245},{x:70,y:90,w:145,h:145},{x:945,y:92,w:145,h:145},{x:80,y:475,w:160,h:150},{x:940,y:475,w:160,h:150}
  ],npcSpots:[[330,345],[850,345]],hotspots:[
    ['explore',585,485,'RIVERSIDE WALK','Walk, train or picnic.'],['memory',315,370,'PHOTO SPOT','Capture a seasonal memory.'],
    ['map',500,710,'DISTRICT MAP','Choose another destination.'],['school',1040,710,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  public_library:{kind:'library',start:[590,665],accent:'#80cbdc',obstacles:[
    {x:42,y:54,w:1096,h:100},{x:75,y:185,w:250,h:90},{x:75,y:315,w:250,h:90},{x:75,y:445,w:250,h:90},
    {x:855,y:185,w:250,h:90},{x:855,y:315,w:250,h:90},{x:855,y:445,w:250,h:90},{x:435,y:245,w:310,h:125}
  ],npcSpots:[[455,455],[725,455]],hotspots:[
    ['explore',590,420,'RESEARCH TABLE','Study archives and references.'],['collection',1010,570,'ARCHIVE DISPLAY','Review unlocked memories.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  cinema:{kind:'cinema',start:[590,665],accent:'#cf6483',obstacles:[
    {x:42,y:54,w:1096,h:112},{x:85,y:205,w:330,h:180},{x:765,y:205,w:330,h:180},{x:460,y:225,w:260,h:210}
  ],npcSpots:[[330,470],[850,470]],hotspots:[
    ['explore',590,470,'FEATURE SCREENING','Watch and discuss a film.'],['gifts',965,420,'POSTER SHOP','Browse cinema gifts.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  sports_center:{kind:'sports',start:[590,680],accent:'#df665b',obstacles:[
    {x:42,y:54,w:1096,h:82},{x:60,y:150,w:200,h:500},{x:920,y:150,w:200,h:500}
  ],npcSpots:[[380,360],[800,360]],hotspots:[
    ['explore',590,380,'TRAINING SESSION','Complete a safe training circuit.'],['memory',590,175,'SCOREBOARD','Review athletic milestones.'],
    ['map',500,710,'DISTRICT MAP','Choose another destination.'],['school',1040,710,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  music_venue:{kind:'venue',start:[590,675],accent:'#dda94d',obstacles:[
    {x:42,y:54,w:1096,h:205},{x:85,y:330,w:220,h:115},{x:365,y:330,w:220,h:115},{x:645,y:330,w:220,h:115},{x:925,y:330,w:170,h:115}
  ],npcSpots:[[460,515],[720,515]],hotspots:[
    ['explore',590,285,'SOUNDCHECK','Listen, rehearse or perform.'],['gifts',1010,500,'MERCH TABLE','Buy music-themed gifts.'],
    ['map',500,705,'DISTRICT MAP','Choose another destination.'],['school',1040,705,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  festival:{kind:'festival',start:[590,690],accent:'#eb91ad',obstacles:[
    {x:42,y:54,w:1096,h:100},{x:80,y:190,w:190,h:145},{x:350,y:190,w:190,h:145},{x:640,y:190,w:190,h:145},{x:910,y:190,w:190,h:145},
    {x:445,y:390,w:290,h:170}
  ],npcSpots:[[315,470],[865,470]],hotspots:[
    ['explore',590,580,'FESTIVAL STROLL','Explore lanterns, stalls and performances.'],['gifts',180,365,'FESTIVAL STALL','Buy seasonal gifts.'],
    ['memory',1000,365,'PHOTO LANTERNS','Capture a seasonal wallpaper.'],['map',500,715,'DISTRICT MAP','Choose another destination.'],['school',1040,715,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  museum:{kind:'museum',start:[590,665],accent:'#bc925f',obstacles:[
    {x:42,y:54,w:1096,h:105},{x:85,y:205,w:260,h:185},{x:460,y:205,w:260,h:185},{x:835,y:205,w:260,h:185},
    {x:260,y:470,w:250,h:120},{x:670,y:470,w:250,h:120}
  ],npcSpots:[[390,430],[790,430]],hotspots:[
    ['explore',590,415,'CURATED EXHIBIT','Explore art and local history.'],['gifts',1010,610,'MUSEUM SHOP','Buy exhibition gifts.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  study_center:{kind:'study',start:[590,665],accent:'#65b69a',obstacles:[
    {x:42,y:54,w:1096,h:100},{x:90,y:210,w:270,h:120},{x:455,y:210,w:270,h:120},{x:820,y:210,w:270,h:120},
    {x:270,y:430,w:260,h:110},{x:650,y:430,w:260,h:110}
  ],npcSpots:[[400,395],[780,395]],hotspots:[
    ['explore',590,375,'FOCUS SESSION','Complete structured exam preparation.'],['memory',1010,580,'PROGRESS BOARD','Review academic achievements.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  convenience:{kind:'store',start:[590,665],accent:'#5ab2c4',obstacles:[
    {x:42,y:54,w:1096,h:105},{x:75,y:205,w:260,h:92},{x:75,y:350,w:260,h:92},{x:460,y:205,w:260,h:92},{x:460,y:350,w:260,h:92},
    {x:845,y:190,w:245,h:230}
  ],npcSpots:[[390,520],[750,520]],hotspots:[
    ['explore',590,495,'RESTOCK','Buy a snack and practical supplies.'],['gifts',960,455,'CHECKOUT','Buy practical gifts.'],
    ['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]},
  station:{kind:'station',start:[590,660],accent:'#6598d1',obstacles:[
    {x:42,y:54,w:1096,h:95},{x:42,y:165,w:1096,h:115},{x:80,y:420,w:250,h:150},{x:850,y:420,w:250,h:150}
  ],npcSpots:[[430,360],[750,360]],hotspots:[
    ['explore',590,335,'PEOPLE WATCH','Wait, travel and observe the district.'],['gifts',980,590,'STATION KIOSK','Buy travel gifts.'],
    ['memory',195,590,'DEPARTURE BOARD','Dream about future journeys.'],['map',500,700,'DISTRICT MAP','Choose another destination.'],['school',1040,700,'RETURN TO SCHOOL','Return to the academy.']
  ]}
};

function wwEnsureState(){
  game.walkable ||= {active:false,locationId:null,weekend:false,x:580,y:650,camera:{x:0,y:0},npcs:[],explored:false,visitToken:0};
  game.walkable.camera ||= {x:0,y:0};
  return game.walkable;
}
function wwScene(id=game.walkable?.locationId){return WW_SCENES[id]||WW_SCENES.home;}
function wwPointInRect(x,y,r,pad=13){return x+pad>r.x&&x-pad<r.x+r.w&&y+8>r.y&&y-12<r.y+r.h;}
function wwCollides(x,y){
  const scene=wwScene(),rects=[...WW_BOUNDARY,...scene.obstacles];
  return rects.some(r=>wwPointInRect(x,y,r));
}
function wwNpcSpawn(locationId){
  const scene=wwScene(locationId),ids=worldAvailableNpcs(locationId);
  return ids.map((id,index)=>{
    const spot=scene.npcSpots[index%Math.max(1,scene.npcSpots.length)]||[480+index*180,400];
    return {id,x:spot[0],y:spot[1],homeX:spot[0],homeY:spot[1],targetX:spot[0],targetY:spot[1],direction:0,anim:3,wait:1+index*.8};
  });
}
function wwEnter(locationId,{weekend=false,preserve=false}={}){
  const scene=wwScene(locationId),state=wwEnsureState();
  state.active=true;state.locationId=locationId;state.weekend=Boolean(weekend);state.explored=false;state.visitToken++;
  state.x=scene.start[0];state.y=scene.start[1];state.camera.x=clamp(state.x-W/2,0,WW_MAP_W-W);state.camera.y=clamp(state.y-H/2,0,WW_MAP_H-H);
  state.npcs=wwNpcSpawn(locationId);game.overlay=null;game.dialogue=null;game.paused=false;game.currentRoom=`offsite:${locationId}`;
  if(!preserve)notify(`Entered ${WORLD_LOCATIONS[locationId]?.name||'the district'}`,scene.accent);
}
function wwExit(toMap=false){
  const state=wwEnsureState(),weekend=state.weekend;state.active=false;state.locationId=null;state.npcs=[];game.currentRoom='hallway';
  if(toMap)wwBaseOpenWorldMap({weekend});else{game.overlay=null;checkSchedule();notify('Returned to Sakura Crest Academy',COLORS.sky);}
}
function wwReturnToCurrent(){
  const state=wwEnsureState();if(state.active){game.overlay=null;game.dialogue=null;return true;}return false;
}

const wwBaseVisitWorldLocation=visitWorldLocation;
visitWorldLocation=function(locationId,options={}){
  if(locationId==='home'){openHomeHub();return true;}
  const ok=wwBaseVisitWorldLocation(locationId,options);
  if(ok)wwEnter(locationId,{weekend:Boolean(options.weekend)});
  return ok;
};
const wwBaseOpenHomeHub=openHomeHub;
openHomeHub=function(){
  ensureWorldState();grantCollectible('keepsake-key','Opened the bedroom hub');game.player.worldVisits.home=(game.player.worldVisits.home||0)+1;wwEnter('home',{weekend:game.walkable?.weekend,preserve:true});saveSilently();
};
const wwBaseOpenWorldMap=openWorldMap;
openWorldMap=function(options={}){
  const state=wwEnsureState();if(state.active){state.active=false;state.locationId=null;state.npcs=[];}
  wwBaseOpenWorldMap(options);
};
worldBackToLocation=function(locationId,weekend=false){
  const state=wwEnsureState();
  if(state.active&&(!locationId||locationId===state.locationId)){game.overlay=null;game.dialogue=null;return;}
  if(locationId&&WW_SCENES[locationId]){wwEnter(locationId,{weekend:Boolean(weekend||state.weekend),preserve:true});return;}
  openWorldMap({weekend:Boolean(weekend)});
};

function wwExplore(){
  const state=wwEnsureState(),location=WORLD_LOCATIONS[state.locationId];if(state.explored){notify('You already explored this location today.',COLORS.sky);return;}
  state.explored=true;applyEffects(location.effect||{score:2},`${location.name}: ${location.activity}`);game.player.wallet+=15;
  if(state.locationId==='festival')grantCollectible(`wallpaper-${seasonKey()}`,`${seasonKey()} festival visit`);
  if(!state.weekend)game.time=Math.min(900,game.time+6);saveSilently();
}
function wwMemory(){
  const state=wwEnsureState(),map={park:`wallpaper-${seasonKey()}`,festival:`wallpaper-${seasonKey()}`,station:'keepsake-ticket',sports_center:'trophy-sports',study_center:'badge-scholar',public_library:'poster-museum'};
  const id=map[state.locationId];if(id)grantCollectible(id,`${WORLD_LOCATIONS[state.locationId].name} discovery`);else notify('A memorable view is added to your journal.',COLORS.gold);
}
function wwHotspotAction(h){
  const state=wwEnsureState();
  if(h[0]==='explore')wwExplore();
  else if(h[0]==='gifts')openGiftShop(state.locationId);
  else if(h[0]==='wardrobe')openCustomization('hair','walkable');
  else if(h[0]==='collection')openCollectionBook();
  else if(h[0]==='memory')wwMemory();
  else if(h[0]==='bed'){applyEffects({energy:22,stress:-15},'Rested in the bedroom');saveSilently();}
  else if(h[0]==='desk'){saveGame();notify('Memory desk updated',COLORS.mint);}
  else if(h[0]==='map')wwExit(true);
  else if(h[0]==='school')wwExit(false);
}
function wwNearestInteraction(){
  const state=wwEnsureState(),scene=wwScene(),items=[];
  scene.hotspots.forEach(h=>items.push({kind:'hotspot',data:h,x:h[1],y:h[2],distance:Math.hypot(h[1]-state.x,h[2]-state.y)}));
  state.npcs.forEach(n=>items.push({kind:'npc',data:n,x:n.x,y:n.y,distance:Math.hypot(n.x-state.x,n.y-state.y)}));
  return items.sort((a,b)=>a.distance-b.distance)[0]||null;
}
function wwInteract(){
  const nearest=wwNearestInteraction();if(!nearest||nearest.distance>72){notify('Nothing nearby to interact with.',COLORS.sky);return;}
  if(nearest.kind==='hotspot')wwHotspotAction(nearest.data);
  else{
    const state=wwEnsureState(),scene=nextWorldScene(nearest.data.id,state.locationId);
    if(scene)playWorldScene(nearest.data.id,state.locationId);else discussWorldTopic(nearest.data.id);
  }
}
const wwBaseInteract=interact;
interact=function(){if(wwEnsureState().active){wwInteract();return;}wwBaseInteract();};

function wwMoveNpc(npc,dt,index){
  npc.wait-=dt;if(npc.wait<=0&&Math.hypot(npc.x-npc.targetX,npc.y-npc.targetY)<8){
    const angle=((game.year*31+game.month*17+game.day*13+index*71+Math.floor(performance.now()/2400))*1.91)%(Math.PI*2);
    npc.targetX=clamp(npc.homeX+Math.cos(angle)*75,70,1110);npc.targetY=clamp(npc.homeY+Math.sin(angle)*55,170,665);
    if(wwCollides(npc.targetX,npc.targetY)){npc.targetX=npc.homeX;npc.targetY=npc.homeY;}npc.wait=1.5+(index%3);
  }
  const dx=npc.targetX-npc.x,dy=npc.targetY-npc.y,d=Math.hypot(dx,dy);
  if(d>4){const speed=24+index*3;npc.x+=dx/d*speed*dt;npc.y+=dy/d*speed*dt;npc.direction=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;npc.anim=Math.floor(performance.now()/240)%3;}
  else npc.anim=Math.floor(performance.now()/1100)%2?3:4;
}
function wwUpdate(dt){
  pollGamepad();game.notifications.forEach(n=>n.life-=dt);game.notifications=game.notifications.filter(n=>n.life>0);
  const state=wwEnsureState();if(game.dialogue||game.overlay||game.paused)return;
  let dx=0,dy=0;if(keys.has('arrowleft')||keys.has('a'))dx--;if(keys.has('arrowright')||keys.has('d'))dx++;if(keys.has('arrowup')||keys.has('w'))dy--;if(keys.has('arrowdown')||keys.has('s'))dy++;
  if(dx||dy){
    const length=Math.hypot(dx,dy);dx/=length;dy/=length;const speed=game.player.energy<20?82:125,nx=state.x+dx*speed*dt,ny=state.y+dy*speed*dt;
    if(!wwCollides(nx,state.y))state.x=nx;if(!wwCollides(state.x,ny))state.y=ny;
    game.player.direction=Math.abs(dx)>Math.abs(dy)?dx<0?1:2:dy<0?3:0;game.player.anim=game.settings?.reducedMotion?1:Math.floor(performance.now()/170)%3;
  }else game.player.anim=game.settings?.reducedMotion?3:Math.floor(performance.now()/900)%2?3:4;
  state.npcs.forEach((npc,index)=>wwMoveNpc(npc,dt,index));
  state.camera.x=clamp(state.x-W/2,0,WW_MAP_W-W);state.camera.y=clamp(state.y-H/2,0,WW_MAP_H-H);
}
const wwBaseUpdate=update;
update=function(dt){if(wwEnsureState().active){wwUpdate(dt);return;}wwBaseUpdate(dt);};

function wwSky(top,bottom){const g=ctx.createLinearGradient(0,0,0,WW_MAP_H);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(0,0,WW_MAP_W,WW_MAP_H);}
function wwWallFloor(wall='#eee6da',floor='#b78258'){wwSky(wall,wall);artWall(42,54,1096,165,wall);artWoodFloor(42,219,1096,501,floor);}
function wwHeaderSign(name,accent){ctx.save();ctx.shadowColor='rgba(0,0,0,.32)';ctx.shadowBlur=12;artRect(390,72,400,58,'#1d2a42',accent,3,14);ctx.restore();centeredAt(name.toUpperCase(),590,109,24,'#fff7e8',`bold 24px ${UI_FONT}`);}
function wwStreetBuilding(x,w,name,color){
  ctx.save();ctx.shadowColor='rgba(20,30,40,.3)';ctx.shadowBlur=12;ctx.shadowOffsetY=8;artRect(x,65,w,178,color,'#30465d',4,10);ctx.restore();
  artRect(x+18,92,w-36,48,'#24344b','#e8c65d',2,8);centeredAt(name,x+w/2,123,15,'#fff8e9',`bold 15px ${UI_FONT}`);
  for(let i=0;i<3;i++)artWindow(x+24+i*(w-48)/3,151,(w-60)/3,68,seasonKey());artRect(x+w/2-30,196,60,50,'#35475f','#d7bd78',2,6);
}
function wwCounter(x,y,w,color){ctx.save();ctx.shadowColor='rgba(0,0,0,.28)';ctx.shadowBlur=9;ctx.shadowOffsetY=5;artRect(x,y,w,58,color,'#4e3428',3,9);ctx.restore();ctx.fillStyle='rgba(255,255,255,.15)';artRect(x+10,y+8,w-20,7,'rgba(255,255,255,.17)',null,1,3);}
function wwTable(x,y,w=150){artRect(x-w/2,y-24,w,48,'#ac724d','#62432f',2,10);artChair(x-w/2-20,y+9,.62);artChair(x+w/2+20,y+9,.62);}
function wwMachine(x,y,color,labelText){ctx.save();ctx.shadowColor=color;ctx.shadowBlur=12;artRect(x,y,150,165,'#26314b',color,3,10);ctx.restore();artRect(x+17,y+20,116,76,'#0f1729','#8fd7ec',2,7);const g=ctx.createLinearGradient(x,y,x+150,y+165);g.addColorStop(0,color);g.addColorStop(1,'rgba(255,255,255,.15)');ctx.fillStyle=g;ctx.fillRect(x+28,y+112,94,24);centeredAt(labelText,x+75,y+129,10,'#fff',`bold 10px ${UI_FONT}`);artEllipse(x+50,y+150,7,7,'#efc75e');artEllipse(x+99,y+150,7,7,'#e68aa5');}
function wwBookshelf(x,y,w=250){artRect(x,y,w,84,'#674936','#3b2a22',3,7);for(let row=0;row<2;row++)for(let i=0;i<12;i++)artRect(x+10+i*(w-20)/12,y+9+row*36,(w-30)/14,25-(i%3)*2,['#c96c5d','#5f89a7','#d4a253','#73916c','#9672a6'][(i+row)%5]);artLine(x+5,y+42,x+w-5,y+42,'#3b2a22',3);}
function wwStall(x,y,w,color,name){artRect(x,y+38,w,100,'#f0dfc9','#6b4a38',3,8);ctx.fillStyle=color;for(let i=0;i<6;i++)ctx.fillRect(x+i*w/6,y,w/12,43),ctx.fillRect(x+(i*2+1)*w/12,y,w/12,43);artRect(x+20,y+62,w-40,32,'#26364c','#e9c65c',2,6);centeredAt(name,x+w/2,y+83,11,'#fff7e8',`bold 11px ${UI_FONT}`);}
function wwDrawScene(){
  const state=wwEnsureState(),id=state.locationId,scene=wwScene(),location=WORLD_LOCATIONS[id],season=seasonKey();
  if(scene.kind==='street'){
    wwSky('#9fd7ed','#f3cfad');artRect(42,54,1096,666,'#b9bdc3');artRect(42,250,1096,300,'#414957');for(let x=65;x<1130;x+=125)artRect(x,386,72,12,'#f3e6b3');wwStreetBuilding(72,310,'MOMIJI GIFTS','#b66b58');wwStreetBuilding(435,310,'CREST STYLE','#6c7fa5');wwStreetBuilding(798,310,'SAKURA BOOKS','#6b8c79');for(let i=0;i<7;i++)artTree(90+i*165,600,.42,season);
  }else if(scene.kind==='cafe'){
    wwWallFloor('#f0dfca','#9e6d4b');artWall(42,54,1096,150,'#d8b898');for(let i=0;i<6;i++)artWindow(80+i*175,80,135,82,season);wwCounter(60,168,1060,'#6f4430');text('MAPLE CAFÉ • ROASTED DAILY',420,204,17,'#fff0d4',true);[[220,300],[580,300],[940,300],[340,480],[840,480]].forEach(p=>wwTable(p[0],p[1],190));for(let i=0;i<5;i++)artPlant(100+i*235,680,.72);
  }else if(scene.kind==='arcade'){
    wwSky('#11162b','#30254d');for(let i=0;i<18;i++){ctx.fillStyle=['rgba(140,111,232,.18)','rgba(79,199,224,.14)','rgba(232,104,164,.15)'][i%3];ctx.fillRect((i*137)%WW_MAP_W,54+(i*83)%650,80,5);}wwHeaderSign('Starline Arcade',scene.accent);[[85,190,'RHYTHM'],[315,190,'RACER'],[685,190,'PUZZLE'],[915,190,'CLAW'],[210,455,'DANCE'],[710,455,'CO-OP']].forEach((p,i)=>wwMachine(p[0],p[1],['#9b83df','#67c9df','#e581a7'][i%3],p[2]));
  }else if(scene.kind==='park'){
    wwSky('#a7dcf0','#d9ebd0');artRect(42,54,1096,666,'#77b77b');artRect(520,54,140,666,'#d9ccb4');artRect(42,320,1096,120,'#d9ccb4');artEllipse(590,325,145,112,'#78bdd4','#4c8197',5);artEllipse(590,325,118,87,'#8bd2e2','#d9f4f7',3);for(const p of [[120,130],[1040,130],[130,545],[1040,545],[300,215],[880,215]])artTree(p[0],p[1],.8,season);for(const p of [[330,350],[850,350],[350,565],[830,565]]){artRect(p[0]-45,p[1]-12,90,24,'#916344','#513d30',2,7);artRect(p[0]-35,p[1]+12,8,22,'#46515b');artRect(p[0]+27,p[1]+12,8,22,'#46515b');}
  }else if(scene.kind==='library'){
    wwWallFloor('#e9e2d5','#9c7355');wwHeaderSign('Sakura Public Library',scene.accent);[[75,185],[75,315],[75,445],[855,185],[855,315],[855,445]].forEach(p=>wwBookshelf(p[0],p[1],250));wwTable(590,295,300);wwTable(590,500,300);artPlant(410,655,.9);artPlant(770,655,.9);
  }else if(scene.kind==='cinema'){
    wwSky('#321d2b','#101423');artRect(42,54,1096,666,'#2a2030');wwHeaderSign('Moonlight Cinema',scene.accent);artRect(460,185,260,210,'#151822','#d9bd68',4,12);artRect(485,210,210,118,'#f0dcb5','#a0526d',3,8);centeredAt('TONIGHT',590,245,15,'#7d3750',`bold 15px ${UI_FONT}`);centeredAt('A SKY OF LETTERS',590,285,20,'#302336',`bold 20px ${UI_FONT}`);centeredAt('ALL AGES',590,315,11,'#7d3750',`bold 11px ${UI_FONT}`);wwCounter(85,205,330,'#734154');wwCounter(765,205,330,'#734154');for(let i=0;i<4;i++){artRect(105+i*78,415,62,42,'#8b3f58','#d9bd68',2,8);artRect(785+i*78,415,62,42,'#8b3f58','#d9bd68',2,8);}
  }else if(scene.kind==='sports'){
    wwSky('#dce8ec','#a8c4c3');artRect(42,54,1096,666,'#b87751');artRect(260,145,660,505,'#d49a66','#f8f2df',5,8);ctx.strokeStyle='rgba(255,255,255,.86)';ctx.lineWidth=5;ctx.strokeRect(300,180,580,435);artLine(590,180,590,615,'rgba(255,255,255,.86)',5);artEllipse(590,398,82,82,'rgba(255,255,255,0)','rgba(255,255,255,.86)',5);for(let i=0;i<5;i++){artRect(82,180+i*88,145,58,'#50637a','#27384a',2,6);artRect(953,180+i*88,145,58,'#50637a','#27384a',2,6);}wwHeaderSign('Crest Sports Center',scene.accent);
  }else if(scene.kind==='venue'){
    wwSky('#171527','#30233d');artRect(42,54,1096,666,'#241d31');artRect(42,54,1096,205,'#171622','#d5a94d',4,8);for(let x=90;x<1120;x+=85){ctx.fillStyle=['#e68aa5','#82c9df','#efc75e'][Math.floor(x/85)%3];ctx.beginPath();ctx.arc(x,76,6,0,Math.PI*2);ctx.fill();const beam=ctx.createLinearGradient(x,82,x,250);beam.addColorStop(0,'rgba(255,255,255,.16)');beam.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(x-5,82);ctx.lineTo(x-55,250);ctx.lineTo(x+55,250);ctx.closePath();ctx.fill();}artRect(310,130,560,105,'#1d2940','#d5a94d',3,10);text('ECHO LIVE HOUSE',475,188,24,'#efc75e',true);[[85,330],[365,330],[645,330],[925,330]].forEach(p=>wwTable(p[0]+100,p[1]+40,175));wwCounter(850,510,245,'#5b3d4e');
  }else if(scene.kind==='festival'){
    wwSky('#4a3158','#141827');artRect(42,54,1096,666,'#87634f');artRect(545,54,90,666,'#c7a77e');for(let y=85;y<700;y+=85){artLine(90,y,1090,y,'rgba(239,199,94,.35)',2);for(let x=105;x<1100;x+=72){ctx.fillStyle=['#efc75e','#e68aa5','#82c9df'][Math.floor((x+y)/72)%3];artEllipse(x,y,10,14,ctx.fillStyle,'rgba(255,255,255,.25)',1);}}wwStall(80,190,190,'#d75b50','TAKOYAKI');wwStall(350,190,190,'#5f8fb4','MASKS');wwStall(640,190,190,'#d59b52','CHARMS');wwStall(910,190,190,'#9b71a6','GAMES');artRect(445,390,290,170,'#6b3f43','#efc75e',4,10);centeredAt('FESTIVAL STAGE',590,440,22,'#fff3d7',`bold 22px ${UI_FONT}`);
  }else if(scene.kind==='museum'){
    wwWallFloor('#ede8df','#b7a288');wwHeaderSign('Sakura City Museum',scene.accent);for(const p of [[85,205],[460,205],[835,205]]){artRect(p[0],p[1],260,185,'#dad3c7','#9b7e5b',3,10);artRect(p[0]+35,p[1]+25,190,105,['#a9675c','#66829d','#8873a0'][(p[0]/100)%3|0],'#efe5c5',7,6);artRect(p[0]+70,p[1]+145,120,18,'#3b4656','#d2b669',2,4);}artRect(260,470,250,120,'#d8cbb7','#9b7e5b',3,12);artEllipse(385,510,72,34,'#82674f','#e0c889',3);artRect(670,470,250,120,'#d8cbb7','#9b7e5b',3,12);artEllipse(795,520,55,55,'#678a87','#e0c889',3);
  }else if(scene.kind==='study'){
    wwWallFloor('#e6eee9','#aa8564');wwHeaderSign('Crest Study Center',scene.accent);[[90,210],[455,210],[820,210],[270,430],[650,430]].forEach((p,i)=>{artRect(p[0],p[1],i<3?270:260,110,'#d8c8b4','#5c493a',2,10);for(let d=0;d<3;d++)artDesk(p[0]+55+d*80,p[1]+45,.62);});artRect(85,575,1010,55,'#2f4f50','#d4bd68',2,9);text('FOCUS • CLARITY • CONSISTENCY',405,610,15,'#e9f7ee',true);
  }else if(scene.kind==='store'){
    wwWallFloor('#e9f0ee','#c7d0c9');wwHeaderSign('Crest Convenience',scene.accent);[[75,205],[75,350],[460,205],[460,350]].forEach(p=>{artRect(p[0],p[1],260,92,'#e6e2d8','#527181',2,7);for(let i=0;i<8;i++){const c=['#df6d63','#e1aa4f','#6ca481','#6f91b0'][i%4];artRect(p[0]+12+i*30,p[1]+15,22,58,c,'rgba(255,255,255,.25)',1,3);}});wwCounter(845,190,245,'#397c86');for(let i=0;i<4;i++)artRect(880+i*48,230,35,52,['#efc75e','#e68aa5','#82c9df','#80c9a1'][i],'#fff',1,4);
  }else if(scene.kind==='station'){
    wwSky('#bddce9','#8fabb7');artRect(42,54,1096,666,'#b9b8b2');artRect(42,165,1096,115,'#354353');for(let x=70;x<1120;x+=120){artRect(x,180,90,65,'#dce9ec','#4d667c',2,7);artLine(x+45,180,x+45,245,'#4d667c',2);}artRect(42,300,1096,75,'#dfd8c8');for(let x=50;x<1130;x+=95)artRect(x,350,55,8,'#f2c957');artLine(42,400,1138,400,'#4c5661',7);artLine(42,450,1138,450,'#4c5661',7);for(let x=65;x<1135;x+=80){artRect(x,392,10,68,'#5c4d42');}wwHeaderSign('Sakura Station',scene.accent);artRect(80,480,250,100,'#26364b','#efc75e',3,10);text('DEPARTURES',120,515,15,'#efc75e',true);text('NORTH LINE   16:10',105,545,11,'#fff',true);text('RIVER LINE   16:18',105,566,11,'#fff',true);wwCounter(850,480,250,'#526b82');
  }else{
    wwWallFloor('#eadde3','#9d6d7d');wwHeaderSign(`${game.player.name}'s Bedroom`,scene.accent);artRect(68,88,300,210,'#d7b3bd','#6f4e5b',3,12);artRect(85,105,270,160,'#f3d9df','#9d7180',2,12);artRect(95,115,105,48,'#fff5ed','#c09aa6',1,12);artRect(760,82,330,190,'#9a7459','#4f382d',3,10);for(let i=0;i<5;i++)artRect(785+i*57,105,38,125,['#d8757e','#6686ac','#e1ad58','#72a27b','#9773a4'][i],'#f3e7cf',1,5);artRect(65,398,225,260,'#6e5260','#3f3340',3,12);artRect(95,425,165,185,'#dce8eb','#7691a0',4,10);artRect(805,390,275,245,'#a37355','#533a2e',3,12);artRect(845,430,195,110,'#efe0c5','#8b684d',2,6);artPlant(735,650,.85);artTree(1100,120,.38,season);
  }
  wwHeaderSign(location.name,scene.accent);
}

function wwDrawActors(){
  const state=wwEnsureState(),actors=[...state.npcs.map(n=>({...n,type:'npc'})),{id:game.player.gender==='boy'?'player_boy':'player_girl',x:state.x,y:state.y,direction:game.player.direction,anim:game.player.anim,type:'player'}];
  actors.sort((a,b)=>a.y-b.y);for(const actor of actors){const sx=actor.x-state.camera.x,sy=actor.y-state.camera.y;if(sx<-60||sx>W+60||sy<-90||sy>H+50)continue;ctx.save();ctx.shadowColor='rgba(7,12,20,.42)';ctx.shadowBlur=9;artEllipse(sx,sy-2,21,8,'rgba(12,18,28,.32)');ctx.restore();if(actor.type==='player'){ctx.strokeStyle=COMMERCIAL_UI.gold;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy-2,25,10,0,0,Math.PI*2);ctx.stroke();}drawCharacter(actor.id,actor.anim,actor.direction||0,sx-34,sy-93,68,93);}
}
function wwDrawInteraction(){
  const nearest=wwNearestInteraction();if(!nearest||nearest.distance>90)return;const state=wwEnsureState(),sx=nearest.x-state.camera.x,sy=nearest.y-state.camera.y;
  if(nearest.kind==='npc'){const npc=npcById(nearest.data.id);label(`E • TALK TO ${npc?.name||'FRIEND'}`,sx-88,sy-112,176,24,COMMERCIAL_UI.sky);}
  else label(`E • ${nearest.data[3]}`,sx-82,sy-58,164,24,wwScene().accent);
}
function wwDrawHud(){
  const state=wwEnsureState(),location=WORLD_LOCATIONS[state.locationId],scene=wwScene();
  ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=16;uiRoundedPath(18,16,480,62,13);ctx.fillStyle='rgba(16,24,40,.91)';ctx.fill();ctx.restore();uiRoundedPath(18.5,16.5,479,61,13);ctx.strokeStyle=scene.accent;ctx.lineWidth=2;ctx.stroke();
  text(location.name,38,43,20,COMMERCIAL_UI.paper,true);text(`${state.weekend?'WEEKEND':'AFTER SCHOOL'} • ¥${game.player.wallet} • SCENES ${game.player.worldScenes.length}/${allWorldScenes().length}`,38,65,10,COMMERCIAL_UI.cream,true);
  addButton(618,18,102,32,'MAP [X]',()=>wwExit(true),true,false,scene.accent);addButton(730,18,102,32,'ROOM [B]',openHomeHub,true,false,COMMERCIAL_UI.rose);addButton(842,18,102,32,'SCHOOL',()=>wwExit(false),true,false,COMMERCIAL_UI.sky);
  const touchControls=game.showControls&&typeof window.matchMedia==='function'&&window.matchMedia('(pointer: coarse)').matches;
  if(touchControls){ctx.globalAlpha=.62;[['↑',70,420,'arrowup'],['←',28,462,'arrowleft'],['↓',70,462,'arrowdown'],['→',112,462,'arrowright']].forEach(([lab,x,y,key])=>addButton(x,y,38,38,lab,()=>{},true,false,COMMERCIAL_UI.ink2,{holdKey:key,world:true}));addButton(870,440,64,64,'E',wwInteract,true,false,scene.accent,{world:true});ctx.globalAlpha=1;}
}
function wwDraw(){
  const state=wwEnsureState();ctx.save();ctx.translate(-state.camera.x,-state.camera.y);wwDrawScene();ctx.restore();wwDrawActors();wwDrawInteraction();wwDrawHud();
}
const wwBaseDrawPlay=drawPlay;
drawPlay=function(){if(wwEnsureState().active){wwDraw();return;}wwBaseDrawPlay();};

function validateWalkableWorld(){
  const issues=[],ids=Object.keys(WW_SCENES);if(ids.length!==14)issues.push(`Expected 14 walkable maps, found ${ids.length}.`);
  for(const [id,scene] of Object.entries(WW_SCENES)){
    if(!WORLD_LOCATIONS[id])issues.push(`${id} is not a canonical location.`);
    if(!Array.isArray(scene.start)||scene.start.length!==2)issues.push(`${id} has no player start.`);
    if(!scene.hotspots?.some(h=>h[0]==='map')||!scene.hotspots?.some(h=>h[0]==='school'))issues.push(`${id} lacks map or school exits.`);
    if(scene.kind!=='bedroom'&&scene.npcSpots.length<1)issues.push(`${id} has no NPC staging.`);
    if(wwPointInRect(scene.start[0],scene.start[1],{x:0,y:0,w:0,h:0}))issues.push(`${id} start validation failed.`);
  }
  return {valid:issues.length===0,issues,maps:ids.length,walkableOffsite:13,walkableBedroom:true,collisionMaps:ids.length,npcWander:true,commercialSceneArt:true,placeholderCards:false};
}

window.addEventListener('keydown',event=>{
  const state=wwEnsureState();if(!state.active)return;const key=event.key.toLowerCase();
  if(game.overlay||game.dialogue)return;
  if(key==='escape'){event.preventDefault();event.stopImmediatePropagation();wwExit(false);}
  else if(key==='x'){event.preventDefault();event.stopImmediatePropagation();wwExit(true);}
  else if(key==='b'){event.preventDefault();event.stopImmediatePropagation();openHomeHub();}
  else if(key==='u'){event.preventDefault();event.stopImmediatePropagation();openCollectionBook();}
},true);
wwEnsureState();
