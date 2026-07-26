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
    const row=a.type==='player'?game.player.direction:0,col=a.type==='player'?game.player.anim:1;
    ctx.fillStyle='rgba(20,20,30,.28)';ctx.beginPath();ctx.ellipse(sx,sy-2,18,7,0,0,Math.PI*2);ctx.fill();
    drawCharacter(a.id,col,row,sx-24,sy-64,48,64);
    if(a.type!=='player'&&Math.hypot(a.x-game.player.x,a.y-game.player.y)<72)label(a.name,sx-58,sy-82,116,20,a.type==='teacher'?COLORS.rose:COLORS.sky);
  }
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
  text(`DAY ${game.day}/20 • ${statusConfig().badge}`,738,42,11,COLORS.paper,true);
  text(`${currentClubRank()} • ${game.player.clubXP} XP`,738,57,10,clubConfig().color,true);
  panel(736,66,208,54,COLORS.deep,COLORS.sky,2);
  text(formatTime(game.time),748,95,24,COLORS.white,true);
  const slot=currentSlot(),next=nextSlot();
  wrapped(slot?.title||'School day complete',812,77,122,12,COLORS.sky,2);
  if(next)wrapped(`Next ${formatTime(next.start)} ${next.title}`,812,99,122,10,COLORS.cream,2);
  const rank=getPlayerRank(game.player.gender);
  panel(736,128,208,64,COLORS.deep,COLORS.gold,2);
  text(`${game.player.gender==='boy'?'BOYS':'GIRLS'} RANK`,748,149,12,COLORS.cream,true);
  text(`#${rank.position}`,748,181,30,COLORS.gold,true);
  text(`${rank.score} pts`,818,177,16,COLORS.paper,true);
  drawBar(742,205,194,12,game.player.energy,100,COLORS.mint,'ENERGY');
  drawBar(742,229,194,12,game.player.stress,100,COLORS.rose,'STRESS');
  text('TODAY',738,266,14,COLORS.sky,true);
  game.missions.forEach((m,i)=>{
    const y=282+i*48;ctx.fillStyle=m.done?'rgba(77,139,104,.28)':'rgba(255,255,255,.04)';ctx.fillRect(736,y,208,42);
    text(m.done?'✓':'•',744,y+19,15,m.done?COLORS.mint:COLORS.gold,true);
    wrapped(m.title,762,y+13,164,12,COLORS.paper,1);text(`${m.progress}/${m.goal}`,880,y+34,10,COLORS.cream,true);
  });
  addButton(736,420,98,28,'RANKINGS',()=>game.overlay={type:'rankings',title:'Live Social Rankings'});
  addButton(846,420,98,28,'SCHEDULE',()=>game.overlay={type:'schedule',title:'Class Schedule'});
  addButton(736,454,98,28,'CLUB',()=>game.overlay={type:'club',title:clubConfig().name});
  addButton(846,454,98,28,'SAVE',saveGame);
  addButton(736,488,208,28,audio.enabled?'SOUND ON':'SOUND OFF',()=>audio.toggle());
  text(`${ROOMS[game.currentRoom]?.name||'School Grounds'}`,738,522,11,COLORS.cream,true);
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
    const sx=(d.portrait%4)*64,sy=Math.floor(d.portrait/4)*64;
    ctx.drawImage(images.portraits,sx,sy,64,64,48,370,112,112);
  }
  const tx=d.portrait!==null&&d.portrait!==undefined?178:52;
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
}
