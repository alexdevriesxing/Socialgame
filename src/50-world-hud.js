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
    drawCharacter(a.id,col,row,sx-31,sy-86,62,86);
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
  addButton(736,424,98,28,'RANKINGS',()=>game.overlay={type:'rankings',title:'Live Social Rankings'});
  addButton(846,424,98,28,'SCHEDULE',()=>game.overlay={type:'schedule',title:'Class Schedule'});
  addButton(736,458,98,28,'CLUB',()=>game.overlay={type:'club',title:clubConfig().name});
  addButton(846,458,98,28,'SAVE',saveGame);
  addButton(736,492,208,28,audio.enabled?'SOUND ON':'SOUND OFF',()=>audio.toggle());
  text(`${ROOMS[game.currentRoom]?.name||'School Grounds'}`,738,528,11,COLORS.cream,true);
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
  if(d.scene!==null&&d.scene!==undefined&&images.event_atlas){
    const ex=(d.scene%4)*400,ey=Math.floor(d.scene/4)*400;
    panel(590,62,318,250,'rgba(18,25,42,.92)',COLORS.sky,3);
    ctx.save();ctx.beginPath();ctx.rect(600,72,298,230);ctx.clip();ctx.drawImage(images.event_atlas,ex,ey,200,200,600,72,298,230);ctx.restore();
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
}
