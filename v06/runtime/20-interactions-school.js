function triggerNpcTalk(npc){
  const already=game.dayFlags.talked.includes(npc.id);
  const rel=game.player.relationships[npc.id]||0;
  const route=nextRouteScene(npc);
  if(route){if(!already){game.dayFlags.talked.push(npc.id);progressMission('talk',1);}triggerRouteScene(npc,route);return;}
  let greeting=npc.greetings[(game.day+Math.floor(rel/2))%npc.greetings.length];
  if(rel>=4) greeting += `\n\nBond: ${relationshipTier(rel)} (${rel}) • Route ${completedRouteCount(npc.id)}/3.`;
  const choices=[
    {text:`Ask about ${npc.clique}.`,relationship:[npc.id,1],effects:{intellect:1,score:already?1:4},result:`${npc.name}: “${cliqueAdvice(npc.clique)}”`},
    {text:'Offer help with today’s challenge.',relationship:[npc.id,2],effects:{kindness:1,score:already?2:6,help:already?0:1},result:`${npc.name} accepts. It is a small task, but it turns into an easy conversation.`},
    {text:'Share a light joke.',relationship:[npc.id,1],effects:{charisma:1,score:already?1:5},result:`The joke lands. ${npc.name} laughs more openly than expected.`},
    {text:'Say goodbye.',effects:{score:0},result:'You part on good terms before the next bell.'}
  ];
  if(!already){game.dayFlags.talked.push(npc.id);progressMission('talk',1);}
  openDialogue({speaker:npc.name,portrait:npc.portrait,text:`${greeting}\n\n${npc.bio}`,choices});
}
function cliqueAdvice(clique){
  const map={
    'Crest Council':'Influence lasts longer when people understand how decisions were made.',
    'Skybound Athletics':'Talent gets attention. Consistency earns teammates.',
    'Velvet Bloom Arts':'A memorable style is honest before it is fashionable.',
    'Byte Brigade':'Test assumptions, document failures, and bring spare batteries.',
    'Hallway Legends':'Never make someone else the price of your joke.'
  };return map[clique]||'Every group has rules nobody writes down. Watch how people treat newcomers.';
}

function triggerHotspot(h){
  if(!game.dayFlags.hotspots.includes(h.id)){game.dayFlags.hotspots.push(h.id);progressMission('hotspot',1);}
  const extra={
    board:'Press R anytime to inspect the live boys’ and girls’ ladders.',
    fountain:'You make a quiet wish: “Let me become someone people choose to follow.”',
    counter:'Buying curry bread restores 12 energy and advances ten minutes.',
    hoop:'A careful practice shot improves fitness. The dramatic shot is optional.',
    shelves:'A yearbook note reads: “Prom crowns are decided in one night. Respect is built over four years.”'
  }[h.id];
  const choices=[];
  if(h.id==='counter')choices.push({text:'Buy curry bread.',effects:{energy:12,score:1},action:()=>advanceTime(10),result:'Warm, crispy, and only slightly more dramatic than advertised.'});
  if(h.id==='hoop')choices.push({text:'Practice ten shots.',effects:{fitness:1,energy:-5,score:3},action:()=>advanceTime(10),result:'Six clean baskets. Mina notices your follow-through.'});
  if(h.id==='fountain')choices.push({text:'Leave a folded wish.',effects:{courage:1,score:2},result:'The paper joins dozens of private ambitions under the stone rim.'});
  if(h.id==='shelves')choices.push({text:'Study past champions.',effects:{intellect:1,score:2},action:()=>advanceTime(10),result:'The most respected graduates were not always ranked first every month.'});
  choices.push({text:'Step away.'});
  openDialogue({speaker:h.name,text:`${h.text}\n\n${extra}`,choices});
}

function interact(){
  if(game.dialogue||game.overlay||game.mode!=='play')return;
  let nearest=null,dist=999;
  for(const npc of game.npcs){const dd=Math.hypot(npc.x-game.player.x,npc.y-game.player.y);if(dd<dist){dist=dd;nearest=npc;}}
  if(nearest&&dist<72){triggerNpcTalk(nearest);return;}
  for(const t of game.teachers){const dd=Math.hypot(t.x-game.player.x,t.y-game.player.y);if(dd<64){teacherSmallTalk(t);return;}}
  for(const h of HOTSPOTS){const dd=Math.hypot(h.x-game.player.x,npc.y-game.player.y);if(dd<h.radius){triggerHotspot(h);return;}}
  notify('Nothing nearby to interact with.',COLORS.sky);
}
function teacherSmallTalk(t){
  const texts={
    teacher_hayashi:'“A high rank without reliability is a very tall chair with one short leg.”',
    teacher_mori:'“The bell is an equation with one correct answer: arrive before it.”',
    teacher_arai:'“Every hallway contains a story. Please avoid becoming the cautionary subplot.”',
    coach_kondo:'“Hydrate, warm up, and never confuse enthusiasm with safe technique.”'
  };
  openDialogue({speaker:t.name,portrait:t.portrait,text:`${texts[t.id]}\n\n${t.subject} • ${t.temperament}`,choices:[{text:'Ask for advice.',effects:{reliability:1,score:2},result:'“Do one useful thing before anyone asks. Then do not announce it.”'},{text:'Thank them.'}]});
}

function relocateNPCs(slotId){
  const slot=SCHEDULE.find(s=>s.id===slotId)||SCHEDULE[0];
  const room=roomForSlot(slot)||'hallway';
  const spots={
    homeroom:[[95,115],[170,115],[245,115],[320,115],[95,180],[170,180],[245,180],[320,180],[130,225],[280,225]],
    math:[[455,115],[530,115],[605,115],[680,115],[455,180],[530,180],[605,180],[680,180],[500,225],[650,225]],
    literature:[[820,115],[895,115],[970,115],[1045,115],[820,180],[895,180],[970,180],[1045,180],[860,225],[1010,225]],
    hallway:[[120,330],[220,335],[330,325],[440,345],[530,330],[740,340],[850,325],[960,345],[1080,330],[1180,340]],
    gym:[[870,500],[950,510],[1030,500],[1120,520],[900,610],[990,630],[1080,620],[1170,610],[930,700],[1120,700]],
    cafeteria:[[475,500],[560,500],[660,500],[730,530],[490,590],[590,590],[700,600],[500,680],[620,680],[730,690]],
    courtyard:[[80,500],[180,500],[300,500],[350,560],[90,650],[180,680],[300,660],[350,720],[240,550],[270,720]],
    library:[[1160,80],[1200,100],[1170,140],[1210,170],[1160,210],[1210,220],[1180,250],[1150,180],[1230,80],[1220,240]]
  };
  const arr=spots[room]||spots.hallway;
  game.npcs.forEach((n,i)=>{n.x=arr[i%arr.length][0];n.y=arr[i%arr.length][1];});
}

function triggerClass(slot,late=false){
  const key=`${game.year}-${game.month}-${game.day}-${slot.id}`;
  if(game.scheduleStatus[key]?.attended)return;
  game.scheduleStatus[key]={attended:true,late};
  if(!late){game.dayFlags.ontime++;progressMission('ontime',1);game.player.stats.reliability=clamp(game.player.stats.reliability+1,0,20);game.player.score+=4;}
  const pool=slot.id==='club'?CLUB_PROMPTS[game.player.club]:CLASS_PROMPTS[slot.id];
  const prompt=pool?.[(game.day+game.month)%pool.length];
  if(!prompt){advanceTime(Math.min(10,slot.end-game.time));return;}
  openDialogue({speaker:slot.teacher||CLUBS[game.player.club].name,portrait:teacherPortraitFor(slot),text:`${late?'After the lateness issue is settled, class begins.\n\n':''}${prompt.text}`,
    choices:prompt.choices.map(c=>({...c,action:()=>{
      if(slot.id==='club'){
        progressMission('club',1);game.player.clubAttendance++;
        awardClubXP(12+Math.max(0,game.player.stats[clubConfig().stat]-5),`${clubConfig().name} practice contribution`);
      }
      advanceTime(slot.id==='closing'?5:12);
      if(slot.id==='club'&&game.day%5===0&&!game.dayFlags.challenge)setTimeout(()=>startClubChallenge('Scheduled club trial'),120);
    }}))});
}
function teacherPortraitFor(slot){
  if(slot.id==='homeroom'||slot.id==='social'||slot.id==='closing')return 12;
  if(slot.id==='math')return 13;if(slot.id==='literature')return 14;if(slot.id==='pe')return 15;
  const clubLeads={athletics:3,arts:4,tech:5,council:2};return clubLeads[game.player.club];
}

function discipline(slot){
  game.player.tardies++;
  const count=game.player.tardies;
  const teacher=slot.teacher||'Club Captain';
  const portrait=teacherPortraitFor(slot);
  const intro=count===1
    ? `The bell rang ${Math.max(1,game.time-slot.start)} minutes ago. ${teacher} stops before continuing the lesson.\n\n“This is your first tardy. Explain, then take your seat.”`
    : `This is tardy number ${count}. ${teacher} closes the attendance book with a very final click.\n\n“Your schedule is a promise to everyone waiting for you.”`;
  const choices=[
    {text:'Apologize honestly.',effects:{reliability:1,score:-5,stress:2},result:'Your apology is accepted. The warning remains, but the teacher appreciates the honesty.',action:()=>afterDiscipline(slot,count)},
    {text:'Explain the real reason calmly.',effects:{charisma:1,score:-4,stress:1},result:'The explanation is heard, but lateness still has consequences.',action:()=>afterDiscipline(slot,count)},
    {text:'Argue that rankings matter more.',effects:{courage:1,demerits:1,score:-10,stress:3},result:'“Character matters when nobody is applauding,” the teacher replies. A demerit is recorded.',action:()=>afterDiscipline(slot,count)}
  ];
  openDialogue({speaker:teacher,portrait,text:intro,choices});audio.bad();
}
function afterDiscipline(slot,count){
  if(count>=2){game.player.detention++;game.player.demerits++;notify('Detention assigned after school',COLORS.red);}
  triggerClass(slot,true);
}

function checkSchedule(){
  const slot=currentSlot();
  if(slot?.id!==game.lastSlot){
    game.lastSlot=slot?.id||null;if(slot){relocateNPCs(slot.id);audio.bell();notify(`${slot.title} • ${ROOMS[roomForSlot(slot)]?.name||CLUBS[game.player.club].name}`,COLORS.gold);}
  }
  if(!slot||slot.optional)return;
  const key=`${game.year}-${game.month}-${game.day}-${slot.id}`;
  const status=game.scheduleStatus[key]||{};
  const target=roomForSlot(slot);
  const inside=pointInRoom(game.player.x,game.player.y,target);
  if(status.attended||status.missed)return;
  if(inside&&game.time<=slot.start+(slot.grace||5)){triggerClass(slot,false);return;}
  if(inside&&game.time>slot.start+(slot.grace||5)&&game.time<slot.end-5){discipline(slot);return;}
  if(game.time>=slot.end-1){
    game.scheduleStatus[key]={missed:true};game.player.absences++;game.player.demerits++;game.player.score-=14;game.player.stats.reliability=Math.max(0,game.player.stats.reliability-1);
    notify(`Missed ${slot.title}: absence recorded`,COLORS.red);audio.bad();
  }else if(game.time===slot.start+(slot.grace||5)) notify(`Late for ${slot.title}! Go to ${ROOMS[target]?.name}.`,COLORS.red);
}

