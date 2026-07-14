// Living Campus v1.2 — deterministic schedules, movement and contextual school services.
const CAMPUS_PERIOD_IDS = SCHEDULE.map(slot => slot.id);
const CAMPUS_ROOM_POINTS = {
  homeroom:[[95,115],[170,115],[245,115],[320,115],[95,180],[170,180],[245,180],[320,180],[130,225],[280,225]],
  math:[[455,115],[530,115],[605,115],[680,115],[455,180],[530,180],[605,180],[680,180],[500,225],[650,225]],
  literature:[[820,115],[895,115],[970,115],[1045,115],[820,180],[895,180],[970,180],[1045,180],[860,225],[1010,225]],
  hallway:[[110,325],[215,350],[325,320],[430,350],[535,323],[650,350],[765,322],[875,350],[990,322],[1105,350]],
  gym:[[870,500],[950,510],[1030,500],[1120,520],[900,610],[990,630],[1080,620],[1170,610],[930,700],[1120,700]],
  cafeteria:[[475,500],[545,500],[650,500],[725,520],[485,590],[565,590],[690,590],[500,680],[610,680],[720,680]],
  courtyard:[[80,500],[180,500],[300,500],[350,560],[90,650],[180,680],[300,660],[350,720],[240,550],[270,720]],
  library:[[1150,80],[1200,92],[1165,132],[1212,155],[1150,200],[1205,215],[1175,245],[1220,240],[1150,165],[1220,110]]
};
const CAMPUS_ROOM_DOORS = {
  homeroom:{inside:{x:170,y:232},hall:{x:170,y:312}},
  math:{inside:{x:535,y:232},hall:{x:535,y:312}},
  literature:{inside:{x:900,y:232},hall:{x:900,y:312}},
  library:{inside:{x:1175,y:232},hall:{x:1175,y:312}},
  courtyard:{inside:{x:210,y:448},hall:{x:210,y:350}},
  cafeteria:{inside:{x:618,y:448},hall:{x:618,y:350}},
  gym:{inside:{x:1020,y:448},hall:{x:1020,y:350}},
  hallway:{inside:{x:640,y:335},hall:{x:640,y:335}}
};
const CAMPUS_CLIQUE_ROOMS = {
  'Crest Council':'homeroom',
  'Skybound Athletics':'gym',
  'Velvet Bloom Arts':'literature',
  'Byte Brigade':'library',
  'Hallway Legends':'hallway'
};
const CAMPUS_FREE_ROOMS = {
  aiko:'homeroom',mina:'gym',rina:'literature',emi:'library',hana:'courtyard',
  ren:'gym',haru:'literature',daichi:'hallway',kenji:'library',sora:'homeroom'
};
const CAMPUS_BREAK_ROOMS = {
  aiko:'hallway',mina:'courtyard',rina:'literature',emi:'library',hana:'courtyard',
  ren:'gym',haru:'hallway',daichi:'hallway',kenji:'library',sora:'hallway'
};
const CAMPUS_LUNCH_GROUPS = [
  ['aiko','hana','sora','daichi'],
  ['mina','ren'],
  ['rina','haru'],
  ['emi','kenji']
];
const CAMPUS_TEACHER_ROUTINES = {
  teacher_hayashi:{
    arrival:['hallway','Greeting students at the entrance'],
    homeroom:['homeroom','Taking morning attendance'],
    math:['hallway','Checking attendance notes'],
    literature:['hallway','Meeting the class representative'],
    break:['hallway','Hallway duty'],
    pe:['courtyard','Supervising the grounds'],
    lunch:['cafeteria','Lunch duty'],
    club:['homeroom','Advising Crest Council'],
    social:['homeroom','Teaching Social Studies'],
    free:['hallway','Student support appointments'],
    closing:['homeroom','Closing attendance']
  },
  teacher_mori:{
    arrival:['math','Preparing lesson examples'],
    homeroom:['math','Reviewing homework'],
    math:['math','Teaching Mathematics'],
    literature:['library','Research period'],
    break:['hallway','Hallway duty'],
    pe:['math','Marking quizzes'],
    lunch:['cafeteria','Faculty lunch'],
    club:['library','Advising technical projects'],
    social:['math','Planning tomorrow’s lesson'],
    free:['library','Mathematics help desk'],
    closing:['hallway','Departure duty']
  },
  teacher_arai:{
    arrival:['literature','Arranging reading materials'],
    homeroom:['literature','Rehearsing the lesson opening'],
    math:['library','Selecting reference books'],
    literature:['literature','Teaching Literature'],
    break:['hallway','Talking with student editors'],
    pe:['literature','Reviewing essays'],
    lunch:['cafeteria','Faculty lunch'],
    club:['literature','Advising arts rehearsal'],
    social:['library','Research and writing'],
    free:['literature','Creative writing clinic'],
    closing:['hallway','Festival committee check-in']
  },
  coach_kondo:{
    arrival:['gym','Inspecting equipment'],
    homeroom:['gym','Setting up training stations'],
    math:['courtyard','Grounds safety inspection'],
    literature:['gym','Equipment inventory'],
    break:['hallway','Hydration patrol'],
    pe:['gym','Teaching Physical Education'],
    lunch:['cafeteria','Athletics table duty'],
    club:['gym','Coaching athletics'],
    social:['courtyard','Field maintenance check'],
    free:['gym','Open practice supervision'],
    closing:['hallway','Final safety round']
  }
};
const CAMPUS_SERVICES = [
  {id:'noticeboard',name:'Campus Noticeboard',x:365,y:335,radius:56,slots:CAMPUS_PERIOD_IDS,color:'#e5b84b',icon:'!',activity:'Daily notices and campus pulse'},
  {id:'office',name:'School Office',x:570,y:335,radius:52,slots:['arrival','break','lunch','free'],color:'#87c9d8',icon:'O',activity:'Attendance and conduct support'},
  {id:'counselor',name:'Counselor Desk',x:730,y:335,radius:52,slots:['break','lunch','free'],color:'#e88ea4',icon:'C',activity:'Confidential student support'},
  {id:'nurse',name:'Nurse Station',x:1085,y:335,radius:52,slots:['arrival','break','lunch','free'],color:'#83b98b',icon:'+',activity:'First aid and quiet recovery'}
];

function campusStudentBaseRoutine(npc,index,slotId){
  const seat=index%10;
  if(slotId==='arrival')return {room:'hallway',point:seat,activity:index%2?'Checking the morning board':'Greeting classmates'};
  if(slotId==='homeroom')return {room:'homeroom',point:seat,activity:'Morning homeroom'};
  if(slotId==='math')return {room:'math',point:seat,activity:'Mathematics lesson'};
  if(slotId==='literature')return {room:'literature',point:seat,activity:'Literature lesson'};
  if(slotId==='break')return {room:CAMPUS_BREAK_ROOMS[npc.id]||'hallway',point:seat,activity:'Morning break'};
  if(slotId==='pe')return {room:'gym',point:seat,activity:index%3===0?'Warm-up captain':'Physical Education'};
  if(slotId==='lunch'){
    const group=Math.max(0,CAMPUS_LUNCH_GROUPS.findIndex(ids=>ids.includes(npc.id)));
    const member=Math.max(0,CAMPUS_LUNCH_GROUPS[group].indexOf(npc.id));
    return {room:'cafeteria',point:(group*2+member)%10,activity:`Lunch group ${group+1}`};
  }
  if(slotId==='club')return {room:CAMPUS_CLIQUE_ROOMS[npc.clique]||'hallway',point:seat,activity:`${npc.clique} gathering`};
  if(slotId==='social')return {room:'homeroom',point:seat,activity:'Social Studies'};
  if(slotId==='free')return {room:CAMPUS_FREE_ROOMS[npc.id]||'courtyard',point:seat,activity:'Independent campus time'};
  if(slotId==='closing')return {room:'homeroom',point:seat,activity:'Closing homeroom'};
  return {room:'hallway',point:seat,activity:'Moving between periods'};
}
const CAMPUS_STUDENT_ROUTINES = Object.fromEntries(NPCS.map((npc,index)=>[
  npc.id,
  Object.fromEntries(CAMPUS_PERIOD_IDS.map(slotId=>[slotId,campusStudentBaseRoutine(npc,index,slotId)]))
]));

function campusWeatherClosed(roomId){
  if(roomId!=='courtyard')return false;
  const weather=String(dailyBrief()?.weather||'');
  return /rain|storm|snow|typhoon|thunder/i.test(weather);
}
function campusRoomOpen(roomId){return Boolean(ROOMS[roomId])&&!campusWeatherClosed(roomId);}
function campusCampaignRoom(npc,routine,slotId){
  if(slotId!=='free')return routine;
  const event=String(campaignMonth()?.event||'').toLowerCase();
  if(/exam|academic|debate/.test(event))return {...routine,room:npc.stats.intellect>=8?'library':'homeroom',activity:'Preparing for the featured academic event'};
  if(/festival|arts|performance|showcase/.test(event)&&(/Arts|Council/.test(npc.clique)))return {...routine,room:npc.clique==='Velvet Bloom Arts'?'literature':'homeroom',activity:'Preparing the featured school event'};
  if(/sports|relay|athletic|championship/.test(event)&&npc.stats.fitness>=7)return {...routine,room:'gym',activity:'Training for the featured competition'};
  if(/election|leadership|council/.test(event)&&npc.stats.charisma>=7)return {...routine,room:'homeroom',activity:'Leadership campaign work'};
  return routine;
}
function campusAdjustedStudentRoutine(npc,slotId){
  const base=CAMPUS_STUDENT_ROUTINES[npc.id]?.[slotId]||campusStudentBaseRoutine(npc,NPCS.findIndex(item=>item.id===npc.id),slotId);
  let routine=campusCampaignRoom(npc,{...base},slotId);
  if(!campusRoomOpen(routine.room)){
    routine={...routine,room:npc.stats.intellect>=8?'library':'hallway',activity:`Weather relocation • ${routine.activity}`};
  }
  if(game.dayFlags?.incident&&slotId==='free'){
    routine={...routine,room:'hallway',activity:'Helping restore normal campus routines'};
  }
  return routine;
}
function campusTeacherRoutine(teacher,slotId){
  const raw=CAMPUS_TEACHER_ROUTINES[teacher.id]?.[slotId]||[teacher.room||'hallway',teacher.subject||'Faculty duty'];
  let [room,activity]=raw;
  if(!campusRoomOpen(room)){room='hallway';activity=`Weather duty • ${activity}`;}
  return {room,point:Math.max(0,TEACHERS.findIndex(item=>item.id===teacher.id))*2,activity};
}
function validateCampusRoutines(){
  const errors=[];
  for(const npc of NPCS){
    for(const slotId of CAMPUS_PERIOD_IDS){
      const routine=CAMPUS_STUDENT_ROUTINES[npc.id]?.[slotId];
      if(!routine)errors.push(`${npc.id}:${slotId}:missing`);
      else if(!ROOMS[routine.room])errors.push(`${npc.id}:${slotId}:invalid room ${routine.room}`);
    }
  }
  for(const teacher of TEACHERS){
    for(const slotId of CAMPUS_PERIOD_IDS){
      const routine=CAMPUS_TEACHER_ROUTINES[teacher.id]?.[slotId];
      if(!routine)errors.push(`${teacher.id}:${slotId}:missing`);
      else if(!ROOMS[routine[0]])errors.push(`${teacher.id}:${slotId}:invalid room ${routine[0]}`);
    }
  }
  return {valid:errors.length===0,errors,studentPeriods:NPCS.length*CAMPUS_PERIOD_IDS.length,teacherPeriods:TEACHERS.length*CAMPUS_PERIOD_IDS.length};
}

function campusPoint(roomId,index,actorId=''){
  const points=CAMPUS_ROOM_POINTS[roomId]||CAMPUS_ROOM_POINTS.hallway;
  const point=points[Math.abs(index)%points.length];
  const jitter=(actorId.split('').reduce((sum,ch)=>sum+ch.charCodeAt(0),0)%7)-3;
  return {x:point[0]+jitter,y:point[1]+((index%3)-1)*3};
}
function campusRoomForActor(actor){
  const actual=getRoomAt(actor.x,actor.y);
  return actual&&actual!=='outside'?actual:(actor.campus?.room||'hallway');
}
function campusPath(actor,targetRoom,target){
  const path=[];
  const currentRoom=campusRoomForActor(actor);
  const currentDoor=CAMPUS_ROOM_DOORS[currentRoom];
  const targetDoor=CAMPUS_ROOM_DOORS[targetRoom];
  const lane=318+(Math.abs(actor.id.split('').reduce((sum,ch)=>sum+ch.charCodeAt(0),0))%3)*16;
  if(currentRoom===targetRoom){
    path.push({...target});
    return path;
  }
  if(currentRoom!=='hallway'&&currentDoor){
    path.push({...currentDoor.inside});
    path.push({...currentDoor.hall});
  }
  if(targetRoom!=='hallway'&&targetDoor){
    path.push({x:targetDoor.hall.x,y:lane});
    path.push({...targetDoor.hall});
    path.push({...targetDoor.inside});
  }
  path.push({...target});
  return path;
}
function ensureCampusSimulation(){
  game.campus ||= {key:null,signature:null,initialized:false,transitions:0,lastCrowd:'Calm',roomGate:null};
  game.dayFlags ||= {};
  game.dayFlags.services ||= [];
  game.dayFlags.weatherGate ??= false;
  for(const actor of [...game.npcs,...game.teachers])actor.campus ||= {room:getRoomAt(actor.x,actor.y),activity:'Arriving',state:'settled',path:[],waitUntil:0};
  return game.campus;
}
function campusPeriodDescriptor(){
  const slot=currentSlot();
  const next=nextSlot();
  if(slot&&slot.optional&&next&&next.start-game.time<=4)return {key:`transition:${next.id}`,slotId:next.id,transition:true,slot:next};
  if(slot)return {key:slot.id,slotId:slot.id,transition:false,slot};
  if(next)return {key:`transition:${next.id}`,slotId:next.id,transition:true,slot:next};
  return {key:'departure',slotId:'arrival',transition:true,slot:null};
}
function campusSignature(descriptor){
  return `${descriptor.key}|${dailyBrief()?.weather||''}|${campaignMonth()?.chapter||0}|${game.dayFlags?.incident?'incident':'normal'}`;
}
function campusAssignActor(actor,routine,index,{instant=false,transition=false}={}){
  const target=campusPoint(routine.room,routine.point??index,actor.id);
  actor.campus ||= {};
  const path=instant?[]:campusPath(actor,routine.room,target);
  actor.campus.room=routine.room;
  actor.campus.activity=transition?`In transit • ${routine.activity}`:routine.activity;
  actor.campus.finalActivity=routine.activity;
  actor.campus.state=instant?'settled':'moving';
  actor.campus.target={...target};
  actor.campus.path=path;
  actor.campus.waitUntil=performance.now()+(transition?(index%5)*95:(index%3)*55);
  actor.campus.startedAt=performance.now();
  if(instant){actor.x=target.x;actor.y=target.y;actor.direction=0;actor.anim=3;}
}
function campusApplyRoutines(descriptor,{instant=false}={}){
  ensureCampusSimulation();
  game.npcs.forEach((npc,index)=>campusAssignActor(npc,campusAdjustedStudentRoutine(npc,descriptor.slotId),index,{instant,transition:descriptor.transition}));
  game.teachers.forEach((teacher,index)=>campusAssignActor(teacher,campusTeacherRoutine(teacher,descriptor.slotId),index+game.npcs.length,{instant,transition:descriptor.transition}));
  game.campus.key=descriptor.key;
  game.campus.signature=campusSignature(descriptor);
  game.campus.initialized=true;
  if(!instant)game.campus.transitions++;
}
function relocateNPCs(slotId){
  const descriptor={key:slotId,slotId,transition:false,slot:SCHEDULE.find(slot=>slot.id===slotId)||null};
  const instant=!game.campus?.initialized||game.mode==='title'||game.mode==='creator';
  campusApplyRoutines(descriptor,{instant});
}
function campusMoveActor(actor,dt){
  const state=actor.campus;
  if(!state||state.state!=='moving'||performance.now()<state.waitUntil)return;
  const next=state.path?.[0];
  if(!next){
    state.state='settled';
    state.activity=state.finalActivity||state.activity;
    actor.anim=3;
    return;
  }
  const dx=next.x-actor.x,dy=next.y-actor.y,distance=Math.hypot(dx,dy);
  if(!Number.isFinite(distance)){
    actor.x=state.target.x;actor.y=state.target.y;state.path=[];state.state='settled';return;
  }
  const speed=actor.id.startsWith('teacher_')||actor.id==='coach_kondo'?64:58+(actor.id.length%4)*3;
  if(distance<=Math.max(2,speed*dt)){
    actor.x=next.x;actor.y=next.y;state.path.shift();
  }else{
    actor.x+=dx/distance*speed*dt;actor.y+=dy/distance*speed*dt;
  }
  if(Math.abs(dx)>Math.abs(dy))actor.direction=dx<0?1:2;else actor.direction=dy<0?3:0;
  actor.anim=game.settings?.reducedMotion?1:(Math.floor(performance.now()/165)%3);
}
function campusCrowd(){
  const actors=[...game.npcs,...game.teachers];
  const hallway=actors.filter(actor=>getRoomAt(actor.x,actor.y)==='hallway'||actor.campus?.state==='moving').length;
  const label=hallway>=10?'Peak hallway traffic':hallway>=6?'Busy between bells':hallway>=3?'Steady campus flow':'Calm campus';
  game.campus.lastCrowd=label;
  return {count:hallway,label};
}
function updateCampusSimulation(dt){
  ensureCampusSimulation();
  const descriptor=campusPeriodDescriptor();
  const signature=campusSignature(descriptor);
  if(game.campus.signature!==signature)campusApplyRoutines(descriptor,{instant:false});
  if(game.mode!=='play'||game.dialogue||game.overlay||game.paused)return;
  for(const actor of [...game.npcs,...game.teachers])campusMoveActor(actor,dt);
  campusCrowd();
}

const campusOriginalUpdate=update;
update=function(dt){
  const previous={x:game.player.x,y:game.player.y,room:game.currentRoom};
  campusOriginalUpdate(dt);
  updateCampusSimulation(dt);
  const room=getRoomAt(game.player.x,game.player.y);
  if(room==='courtyard'&&!campusRoomOpen('courtyard')){
    game.player.x=previous.x;game.player.y=previous.y;game.currentRoom=previous.room;
    if(!game.dayFlags.weatherGate){game.dayFlags.weatherGate=true;notify('The courtyard is closed because of today’s weather.',COLORS.sky);}
  }
};

function campusActorColor(actor){
  if(actor.id.startsWith('teacher_')||actor.id==='coach_kondo')return COLORS.rose;
  if(actor.campus?.state==='moving')return COLORS.gold;
  const room=actor.campus?.room;
  return room==='gym'?COLORS.rose:room==='library'?COLORS.sky:room==='courtyard'?COLORS.mint:COLORS.paper;
}
function drawWorldCharacters(){
  const actors=[...game.npcs.map(n=>({...n,type:'npc',source:n})),...game.teachers.map(t=>({...t,type:'teacher',source:t})),{...game.player,id:game.player.gender==='boy'?'player_boy':'player_girl',type:'player',source:game.player}];
  actors.sort((a,b)=>a.y-b.y);
  for(const a of actors){
    const source=a.source||a;
    const sx=Math.round(a.x-game.camera.x),sy=Math.round(a.y-game.camera.y);if(sx<-60||sx>VIEW_W+60||sy<-80||sy>H+50)continue;
    if(CHARACTER_INDEX[a.id]===undefined)continue;
    const moving=a.type!=='player'&&source.campus?.state==='moving';
    const row=a.type==='player'?game.player.direction:(source.direction??0);
    let col;
    if(a.type==='player')col=game.player.anim;
    else if(moving)col=source.anim??1;
    else{
      col=Math.floor((performance.now()+a.x*7)/1100)%2?3:4;
      if(a.type==='npc'&&sameLadder(a)&&(game.player.rivalHeat[a.id]||0)>=12)col=5;
      if(a.type==='npc'&&(game.player.relationships[a.id]||0)>=15)col=6;
      if(a.type==='npc'&&(game.player.friendshipMoments||[]).some(id=>id.startsWith(a.id)))col=Math.floor(performance.now()/1400)%2?7:8;
    }
    ctx.fillStyle='rgba(20,20,30,.28)';ctx.beginPath();ctx.ellipse(sx,sy-2,18,7,0,0,Math.PI*2);ctx.fill();
    drawCharacter(a.id,col,row,sx-31,sy-86,62,86);
    if(a.type!=='player'){
      ctx.fillStyle=campusActorColor(source);ctx.beginPath();ctx.arc(sx+23,sy-79,4,0,Math.PI*2);ctx.fill();
      if(Math.hypot(a.x-game.player.x,a.y-game.player.y)<78){
        label(a.name,sx-62,sy-84,124,20,a.type==='teacher'?COLORS.rose:COLORS.sky);
        const activity=String(source.campus?.activity||'Campus routine').replace('In transit • ','→ ').slice(0,22);
        label(activity,sx-70,sy-61,140,18,campusActorColor(source));
      }
    }
  }
}

function campusServiceAvailable(service){
  const slot=currentSlot()?.id||campusPeriodDescriptor().slotId;
  return service.slots.includes(slot);
}
function campusNearestService(){
  return CAMPUS_SERVICES.map(service=>({...service,distance:Math.hypot(service.x-game.player.x,service.y-game.player.y)}))
    .filter(service=>service.distance<service.radius&&campusServiceAvailable(service))
    .sort((a,b)=>a.distance-b.distance)[0]||null;
}
function campusServiceUsed(id){ensureCampusSimulation();return game.dayFlags.services.includes(id);}
function markCampusService(id){if(!campusServiceUsed(id))game.dayFlags.services.push(id);}
function triggerCampusService(service){
  const used=campusServiceUsed(service.id);
  if(service.id==='noticeboard'){
    openDialogue({speaker:service.name,text:`${dailyBrief().notice}\n\nCurrent period: ${campusPeriodDescriptor().slot?.title||'Passing time'}.\nCampus flow: ${campusCrowd().label}.\nFeatured chapter: ${campaignMonth().title}.`,choices:[
      {text:'Open Campus Pulse.',action:()=>setTimeout(openLivingCampusOverlay,40)},
      {text:'Study the full notice.',effects:{intellect:used?0:1,score:used?0:2},action:()=>markCampusService(service.id),result:'You note the room changes, support hours and club announcements.'},
      {text:'Step away.'}
    ]});return;
  }
  if(service.id==='nurse'){
    openDialogue({speaker:service.name,text:`The nurse checks your energy and stress levels.\n\nEnergy ${Math.round(game.player.energy)} • Stress ${Math.round(game.player.stress)}.`,choices:[
      {text:used?'Ask for general advice.':'Rest for ten minutes.',effects:used?{stress:-1}:{energy:18,stress:-9,reliability:1},action:()=>{markCampusService(service.id);if(!used)advanceTime(10);},result:used?'“Water, food, sleep, and asking for help before a problem becomes dramatic.”':'A quiet rest and a glass of water leave you steadier.'},
      {text:'Return to class.'}
    ]});return;
  }
  if(service.id==='counselor'){
    openDialogue({speaker:service.name,text:'The counselor keeps the conversation private and practical. “What would make today feel more manageable?”',choices:[
      {text:used?'Check in briefly.':'Talk through the pressure.',effects:used?{stress:-1}:{stress:-12,kindness:1,courage:1},action:()=>{markCampusService(service.id);if(!used)advanceTime(10);},result:'You leave with one concrete next step instead of ten vague worries.'},
      {text:'Ask about friendships.',effects:{charisma:1},result:'“Listen for what people need, not only for what you plan to say next.”'},
      {text:'Thank them.'}
    ]});return;
  }
  if(service.id==='office'){
    const canReview=!used&&game.player.demerits>0;
    openDialogue({speaker:service.name,text:`Attendance record: ${game.player.tardies} tardies, ${game.player.absences} absences and ${game.player.demerits} demerits.\n\nThe office can review one conduct item when you take responsibility and complete the paperwork.`,choices:[
      {text:canReview?'Request a conduct review.':used?'Review already completed today.':'Ask how to protect a clean record.',effects:canReview?{reliability:1,score:-2}:{reliability:1},action:()=>{if(canReview){game.player.demerits=Math.max(0,game.player.demerits-1);game.player.teacherTrust++;markCampusService(service.id);advanceTime(12);}},result:canReview?'You complete the reflection form. One demerit is cleared, but the lesson remains on record.':'“Arrive early enough to help someone else. It changes the whole morning.”'},
      {text:'Check lost property.',effects:{kindness:1,score:1},result:'You help match a labelled notebook to its owner.'},
      {text:'Leave the office.'}
    ]});
  }
}
const campusOriginalInteract=interact;
interact=function(){
  if(game.dialogue||game.overlay||game.mode!=='play')return;
  const service=campusNearestService();
  if(service){triggerCampusService(service);return;}
  campusOriginalInteract();
};
const campusOriginalNpcTalk=triggerNpcTalk;
triggerNpcTalk=function(npc){
  const state=npc.campus||{};
  const roomName=ROOMS[state.room]?.name||'the school';
  const weather=dailyBrief()?.weather||'Clear';
  const contextual={...npc,greetings:(npc.greetings||[]).map(greeting=>`${greeting}\n\nRight now: ${state.activity||'following the school schedule'} in ${roomName}. Weather: ${weather}.`)};
  campusOriginalNpcTalk(contextual);
};
const campusOriginalTeacherTalk=teacherSmallTalk;
teacherSmallTalk=function(teacher){
  const state=teacher.campus||{};
  openDialogue({speaker:teacher.name,portrait:teacher.portrait,text:`${teacher.subject} • ${teacher.temperament}\n\nCurrent duty: ${state.activity||'Faculty support'} in ${ROOMS[state.room]?.name||'the school'}.`,choices:[
    {text:'Ask about the campus today.',effects:{reliability:1,score:2},result:`“The school is busiest ${campusCrowd().label.toLowerCase()}. Watch the bell, the weather notices, and the people who look left behind.”`},
    {text:'Ask for study advice.',effects:{intellect:1},result:'“Small preparation before every class is more reliable than one heroic night.”'},
    {text:'Thank them.'}
  ]});
};

function drawCampusServices(){
  for(const service of CAMPUS_SERVICES){
    if(!campusServiceAvailable(service))continue;
    const sx=service.x-game.camera.x,sy=service.y-game.camera.y;
    if(sx<0||sx>VIEW_W||sy<0||sy>H)continue;
    ctx.fillStyle='rgba(13,20,34,.78)';ctx.beginPath();ctx.arc(sx,sy,12,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=service.color;ctx.lineWidth=2;ctx.stroke();
    centeredAt(service.icon,sx,sy+4,12,service.color,'bold 12px Trebuchet MS');
    if(Math.hypot(service.x-game.player.x,service.y-game.player.y)<service.radius)label(`E • ${service.name}`,sx-72,sy-42,144,20,service.color);
  }
  if(!campusRoomOpen('courtyard')){
    const door=CAMPUS_ROOM_DOORS.courtyard.hall,sx=door.x-game.camera.x,sy=door.y-game.camera.y;
    label('COURTYARD CLOSED',sx-68,sy+16,136,20,COLORS.sky);
  }
}
const campusOriginalWorldMarkers=drawWorldMarkers;
drawWorldMarkers=function(){campusOriginalWorldMarkers();drawCampusServices();};

function openLivingCampusOverlay(){ensureCampusSimulation();game.overlay={type:'livingCampus',title:'Living Campus Pulse'};}
function campusStatusLine(actor){
  const state=actor.campus||{},room=ROOMS[state.room]?.name||'School grounds';
  return {name:actor.name,room,activity:String(state.activity||'Campus routine').replace('In transit • ','→ '),moving:state.state==='moving',color:campusActorColor(actor)};
}
function drawLivingCampusOverlay(o){
  overlayBase(o.title);
  const descriptor=campusPeriodDescriptor(),crowd=campusCrowd();
  centered(`${descriptor.transition?'PASSING PERIOD TO':'CURRENT'} ${descriptor.slot?.title||'Departure'} • ${dailyBrief().weather} • ${crowd.label}`,96,14,COLORS.gold,`bold 14px ${UI_FONT}`);
  const actors=[...game.npcs,...game.teachers].map(campusStatusLine);
  actors.forEach((actor,index)=>{
    const col=index<7?0:1,row=index%7,x=74+col*414,y=122+row*43;
    ctx.fillStyle=index%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.055)';ctx.fillRect(x,y,398,36);
    ctx.fillStyle=actor.color;ctx.beginPath();ctx.arc(x+12,y+18,5,0,Math.PI*2);ctx.fill();
    text(actor.name,x+25,y+15,12,COLORS.paper,true);
    text(actor.room,x+25,y+30,10,COLORS.sky,true);
    wrapped(actor.activity,x+190,y+15,195,10,actor.moving?COLORS.gold:COLORS.cream,2);
  });
  const openServices=CAMPUS_SERVICES.filter(campusServiceAvailable).map(service=>service.name.replace('Campus ','')).join(' • ');
  text(`OPEN SUPPORT: ${openServices}`,86,438,11,COLORS.mint,true);
  text(campusRoomOpen('courtyard')?'Courtyard open':'Courtyard closed by weather notice',86,457,11,campusRoomOpen('courtyard')?COLORS.cream:COLORS.sky,true);
  addButton(350,474,260,32,'CLOSE • C / ESC',()=>game.overlay=null);
}
const campusOriginalDrawOverlay=drawOverlay;
drawOverlay=function(){
  if(game.overlay?.type==='livingCampus'){
    ctx.fillStyle='rgba(9,11,18,.88)';ctx.fillRect(0,0,W,H);drawLivingCampusOverlay(game.overlay);return;
  }
  campusOriginalDrawOverlay();
};
const campusOriginalHud=drawHudPanel;
drawHudPanel=function(){
  campusOriginalHud();
  ctx.fillStyle=COLORS.panel;ctx.fillRect(736,505,208,35);
  addButton(736,508,94,24,'CAMPUS • C',openLivingCampusOverlay,true,false,COLORS.navy);
  const crowd=campusCrowd();wrapped(crowd.label,839,516,98,9,COLORS.cream,2);
};
const campusOriginalTitle=drawTitle;
drawTitle=function(){
  campusOriginalTitle();
  ctx.fillStyle='rgba(28,29,43,.86)';ctx.fillRect(244,498,472,27);
  centered('Living Campus v1.2 • Believable schedules, movement and support services',516,11,COLORS.sky,`bold 11px ${UI_FONT}`);
};

window.addEventListener('keydown',event=>{
  if(event.key?.toLowerCase()!=='c'||game.mode!=='play'||game.dialogue)return;
  event.preventDefault();event.stopImmediatePropagation();
  if(game.overlay?.type==='livingCampus')game.overlay=null;
  else if(!game.overlay)openLivingCampusOverlay();
},true);

const campusValidation=validateCampusRoutines();
if(!campusValidation.valid)console.error('Living Campus routine validation failed',campusValidation.errors);
ensureCampusSimulation();
campusApplyRoutines(campusPeriodDescriptor(),{instant:true});
