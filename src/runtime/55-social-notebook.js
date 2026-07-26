function drawSocialOverlay(o){
  ensureSocialMemoryState();
  overlayBase(o.title);
  const summary=socialMemorySummary();
  text(`Trusted ${summary.trusted} • Strained ${summary.strained} • Open promises ${summary.openPromises} • Kept ${summary.keptPromises}`,88,98,12,COLORS.cream,true);

  panel(78,116,292,312,COLORS.deep,COLORS.sky,3);
  text('STUDENTS',96,143,16,COLORS.sky,true);
  const selectedIndex=clamp(o.selectedNpc||0,0,NPCS.length-1);
  o.selectedNpc=selectedIndex;
  NPCS.forEach((npc,i)=>{
    const profile=socialProfile(npc.id);
    const y=157+i*25;
    const selected=i===selectedIndex;
    const color=profile.strain>=3?COLORS.rose:profile.standing>=8?COLORS.mint:COLORS.paper;
    addButton(92,y,262,22,`${npc.name} • ${relationshipStage(npc.id)}`,()=>{o.selectedNpc=i;},true,selected,selected?COLORS.gold:COLORS.navy);
    if(!selected)text(String(profile.standing),326,y+15,10,color,true);
  });

  const npc=NPCS[selectedIndex];
  const profile=socialProfile(npc.id);
  const memories=game.player.relationshipMemories[npc.id]||[];
  const promises=openPromisesFor(npc.id);
  panel(390,116,492,312,COLORS.deep,profile.strain>=3?COLORS.rose:COLORS.gold,3);

  if(npc.portrait!==null&&npc.portrait!==undefined){
    const sx=(npc.portrait%4)*64,sy=Math.floor(npc.portrait/4)*64;
    ctx.drawImage(images.portraits,sx,sy,64,64,412,138,96,96);
  }
  text(npc.name.toUpperCase(),526,150,20,COLORS.gold,true);
  text(`${npc.clique} • ${relationshipStage(npc.id)}`,526,176,13,COLORS.sky,true);
  wrapped(npc.bio,526,199,330,12,COLORS.cream,3);

  const metrics=[
    ['FRIENDSHIP',profile.friendship,COLORS.pink],
    ['TRUST',profile.trust,COLORS.mint],
    ['RESPECT',profile.respect,COLORS.sky],
    ['STRAIN',profile.strain,COLORS.rose],
    ['STANDING',profile.standing,COLORS.gold]
  ];
  metrics.forEach(([labelText,value,color],i)=>{
    const x=412+(i%3)*148,y=252+Math.floor(i/3)*42;
    text(labelText,x,y,10,COLORS.cream,true);
    text(String(value),x,y+24,20,color,true);
  });

  text('OPEN PROMISES',412,344,12,COLORS.gold,true);
  if(promises.length){
    promises.slice(0,2).forEach((p,i)=>wrapped(`• ${p.summary} — ${promiseDate(p)}`,412,364+i*31,440,11,COLORS.paper,2));
  }else text('No outstanding commitments.',412,365,11,COLORS.cream);

  text('RECENT MEMORIES',96,449,13,COLORS.sky,true);
  if(memories.length){
    memories.slice(0,3).forEach((m,i)=>{
      const color=m.type==='hurt'||m.type==='promise-broken'?COLORS.rose:m.type==='promise-kept'||m.type==='support'?COLORS.mint:COLORS.paper;
      wrapped(`Y${m.year} M${m.month} D${m.day} • ${m.summary}`,96,470+i*20,690,11,color,1);
    });
  }else text('Your story with this student has only just begun.',96,471,11,COLORS.cream);

  addButton(794,458,88,34,'CLOSE',()=>game.overlay=null);
}