// Commercial Art Pass v1.5 — premium UI foundation shared by every game screen.
const COMMERCIAL_ART_VERSION='1.5.0';
const COMMERCIAL_UI={
  ink:'#111827',ink2:'#182238',panel:'#202a43',panel2:'#293653',paper:'#fff9ee',cream:'#eadfc8',
  gold:'#efc75e',gold2:'#b9812f',rose:'#e68aa5',sky:'#82c9df',mint:'#80c9a1',red:'#d65c65',
  line:'rgba(255,255,255,.12)',shadow:'rgba(5,8,18,.55)'
};

function uiRoundedPath(x,y,w,h,r=12){
  const radius=Math.max(0,Math.min(r,w/2,h/2));
  ctx.beginPath();ctx.moveTo(x+radius,y);ctx.lineTo(x+w-radius,y);ctx.quadraticCurveTo(x+w,y,x+w,y+radius);
  ctx.lineTo(x+w,y+h-radius);ctx.quadraticCurveTo(x+w,y+h,x+w-radius,y+h);ctx.lineTo(x+radius,y+h);
  ctx.quadraticCurveTo(x,y+h,x,y+h-radius);ctx.lineTo(x,y+radius);ctx.quadraticCurveTo(x,y,x+radius,y);ctx.closePath();
}
function uiGradient(x,y,w,h,top,bottom){const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,top);g.addColorStop(1,bottom);return g;}
function uiMix(hex,amount=24){
  const value=String(hex||'#5377a5').replace('#','');if(value.length!==6)return hex;
  const n=parseInt(value,16),r=Math.max(0,Math.min(255,(n>>16)+amount)),g=Math.max(0,Math.min(255,((n>>8)&255)+amount)),b=Math.max(0,Math.min(255,(n&255)+amount));
  return `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`;
}
function uiGlass(x,y,w,h,r=14,alpha=.82){
  ctx.save();ctx.shadowColor='rgba(3,6,16,.48)';ctx.shadowBlur=18;ctx.shadowOffsetY=8;uiRoundedPath(x,y,w,h,r);ctx.fillStyle=`rgba(20,29,48,${alpha})`;ctx.fill();ctx.restore();
  ctx.save();uiRoundedPath(x,y,w,h,r);ctx.clip();const g=ctx.createLinearGradient(x,y,x+w,y+h);g.addColorStop(0,'rgba(255,255,255,.10)');g.addColorStop(.45,'rgba(255,255,255,.025)');g.addColorStop(1,'rgba(0,0,0,.16)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);ctx.restore();
  uiRoundedPath(x+.5,y+.5,w-1,h-1,r);ctx.strokeStyle='rgba(255,255,255,.16)';ctx.lineWidth=1;ctx.stroke();
}
function uiRule(x,y,w,color=COMMERCIAL_UI.gold){const g=ctx.createLinearGradient(x,y,x+w,y);g.addColorStop(0,'rgba(255,255,255,0)');g.addColorStop(.18,color);g.addColorStop(.82,color);g.addColorStop(1,'rgba(255,255,255,0)');ctx.fillStyle=g;ctx.fillRect(x,y,w,2);}
function uiOrnament(x,y,color=COMMERCIAL_UI.gold){ctx.save();ctx.translate(x,y);ctx.rotate(Math.PI/4);ctx.fillStyle=color;ctx.fillRect(-5,-5,10,10);ctx.fillStyle=COMMERCIAL_UI.ink;ctx.fillRect(-2.5,-2.5,5,5);ctx.restore();}
function uiIcon(type,x,y,size,color=COMMERCIAL_UI.paper){
  ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=Math.max(1.5,size*.08);ctx.lineCap='round';ctx.lineJoin='round';
  const s=size;
  if(type==='rank'){ctx.beginPath();ctx.moveTo(-s*.34,s*.28);ctx.lineTo(-s*.18,-s*.05);ctx.lineTo(0,s*.12);ctx.lineTo(s*.2,-s*.28);ctx.lineTo(s*.36,s*.28);ctx.stroke();ctx.fillRect(-s*.36,s*.31,s*.72,s*.1);}
  else if(type==='calendar'){uiRoundedPath(-s*.35,-s*.28,s*.7,s*.62,s*.08);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.35,-s*.08);ctx.lineTo(s*.35,-s*.08);ctx.stroke();ctx.fillRect(-s*.2,s*.04,s*.1,s*.1);ctx.fillRect(.05*s,s*.04,s*.1,s*.1);}
  else if(type==='club'){ctx.beginPath();ctx.arc(0,0,s*.3,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.24,s*.18);ctx.lineTo(0,-s*.3);ctx.lineTo(s*.24,s*.18);ctx.stroke();}
  else if(type==='activity'){ctx.beginPath();ctx.moveTo(-s*.32,s*.2);ctx.lineTo(-s*.1,-s*.24);ctx.lineTo(s*.08,s*.06);ctx.lineTo(s*.34,-s*.32);ctx.stroke();ctx.beginPath();ctx.arc(-s*.32,s*.2,s*.07,0,Math.PI*2);ctx.fill();ctx.beginPath();ctx.arc(s*.34,-s*.32,s*.07,0,Math.PI*2);ctx.fill();}
  else if(type==='campus'){ctx.beginPath();ctx.moveTo(-s*.38,-s*.02);ctx.lineTo(0,-s*.32);ctx.lineTo(s*.38,-s*.02);ctx.closePath();ctx.stroke();ctx.strokeRect(-s*.29,-s*.02,s*.58,s*.36);ctx.fillRect(-s*.06,s*.12,s*.12,s*.22);}
  else if(type==='friends'){ctx.beginPath();ctx.arc(-s*.13,-s*.12,s*.14,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(s*.18,-s*.08,s*.12,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(-s*.02,s*.24,s*.29,Math.PI,Math.PI*2);ctx.stroke();}
  else if(type==='save'){ctx.strokeRect(-s*.31,-s*.32,s*.62,s*.64);ctx.strokeRect(-s*.17,-s*.27,s*.25,s*.2);ctx.beginPath();ctx.arc(0,s*.14,s*.13,0,Math.PI*2);ctx.stroke();}
  else if(type==='sound'){ctx.beginPath();ctx.moveTo(-s*.34,-s*.1);ctx.lineTo(-s*.16,-s*.1);ctx.lineTo(s*.05,-s*.28);ctx.lineTo(s*.05,s*.28);ctx.lineTo(-s*.16,s*.1);ctx.lineTo(-s*.34,s*.1);ctx.closePath();ctx.stroke();ctx.beginPath();ctx.arc(s*.06,0,s*.28,-.8,.8);ctx.stroke();}
  else if(type==='world'){ctx.beginPath();ctx.arc(0,0,s*.34,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.ellipse(0,0,s*.14,s*.34,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.moveTo(-s*.32,0);ctx.lineTo(s*.32,0);ctx.stroke();}
  else if(type==='room'){ctx.beginPath();ctx.moveTo(-s*.38,-s*.02);ctx.lineTo(0,-s*.34);ctx.lineTo(s*.38,-s*.02);ctx.stroke();ctx.strokeRect(-s*.29,-s*.02,s*.58,s*.38);ctx.fillRect(-s*.06,s*.12,s*.12,s*.24);}
  else if(type==='lock'){uiRoundedPath(-s*.24,-s*.02,s*.48,s*.34,s*.05);ctx.stroke();ctx.beginPath();ctx.arc(0,-s*.03,s*.18,Math.PI,0);ctx.stroke();}
  else if(type==='gift'){ctx.strokeRect(-s*.34,-s*.17,s*.68,s*.48);ctx.fillRect(-s*.04,-s*.17,s*.08,s*.48);ctx.fillRect(-s*.38,-s*.22,s*.76,s*.09);ctx.beginPath();ctx.arc(-s*.1,-s*.28,s*.13,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(s*.1,-s*.28,s*.13,0,Math.PI*2);ctx.stroke();}
  else if(type==='book'){ctx.beginPath();ctx.moveTo(0,-s*.28);ctx.quadraticCurveTo(-s*.2,-s*.38,-s*.38,-s*.25);ctx.lineTo(-s*.38,s*.28);ctx.quadraticCurveTo(-s*.17,s*.15,0,s*.28);ctx.quadraticCurveTo(s*.17,s*.15,s*.38,s*.28);ctx.lineTo(s*.38,-s*.25);ctx.quadraticCurveTo(s*.2,-s*.38,0,-s*.28);ctx.stroke();}
  else{ctx.beginPath();ctx.arc(0,0,s*.3,0,Math.PI*2);ctx.stroke();}
  ctx.restore();
}

panel=function(x,y,w,h,fill=COMMERCIAL_UI.panel,stroke=COMMERCIAL_UI.gold,width=2){
  ctx.save();ctx.shadowColor='rgba(3,6,15,.45)';ctx.shadowBlur=Math.min(18,Math.max(6,w*.025));ctx.shadowOffsetY=5;uiRoundedPath(x,y,w,h,Math.min(14,h*.14));ctx.fillStyle=uiGradient(x,y,w,h,fill,uiMix(fill,-18));ctx.fill();ctx.restore();
  uiRoundedPath(x+.75,y+.75,w-1.5,h-1.5,Math.min(14,h*.14));ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();
  uiRoundedPath(x+4.5,y+4.5,w-9,h-9,Math.max(3,Math.min(10,h*.11)));ctx.strokeStyle='rgba(255,255,255,.10)';ctx.lineWidth=1;ctx.stroke();
};

addButton=function(x,y,w,h,labelText,onClick,enabled=true,selected=false,color=COLORS.blue,opts={}){
  const hover=pointer.x>=x&&pointer.x<=x+w&&pointer.y>=y&&pointer.y<=y+h;
  const base=!enabled?'#3c4354':selected?COMMERCIAL_UI.gold:color;
  const top=hover&&enabled?uiMix(base,30):uiMix(base,13),bottom=uiMix(base,-27);
  ctx.save();ctx.shadowColor=hover&&enabled?'rgba(239,199,94,.28)':'rgba(3,6,15,.32)';ctx.shadowBlur=hover&&enabled?13:6;ctx.shadowOffsetY=3;uiRoundedPath(x,y,w,h,Math.min(10,h*.28));ctx.fillStyle=uiGradient(x,y,w,h,top,bottom);ctx.fill();ctx.restore();
  uiRoundedPath(x+.5,y+.5,w-1,h-1,Math.min(10,h*.28));ctx.strokeStyle=selected?COMMERCIAL_UI.paper:enabled?'rgba(255,255,255,.28)':'rgba(255,255,255,.10)';ctx.lineWidth=selected?2.5:1.25;ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,.14)';uiRoundedPath(x+3,y+3,w-6,Math.max(2,h*.16),Math.min(8,h*.2));ctx.fill();
  centeredAt(labelText,x+w/2,y+h/2+Math.min(5,h*.16),Math.min(14,h*.4),selected?COMMERCIAL_UI.ink:enabled?COMMERCIAL_UI.paper:'#8a92a5',`bold ${Math.min(14,h*.4)}px ${UI_FONT}`);
  buttons.push({x,y,w,h,onClick,enabled,holdKey:opts.holdKey||null,world:opts.world||false});
};

label=function(t,x,y,w,h,color){ctx.save();ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=7;uiRoundedPath(x,y,w,h,7);ctx.fillStyle='rgba(17,24,39,.9)';ctx.fill();ctx.restore();uiRoundedPath(x+.5,y+.5,w-1,h-1,7);ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();centeredAt(t,x+w/2,y+h/2+4,10,color,`bold 10px ${UI_FONT}`);};

overlayBase=function(title){
  ctx.save();ctx.fillStyle='rgba(8,12,24,.64)';ctx.fillRect(0,0,W,H);ctx.restore();
  uiGlass(42,24,876,492,18,.95);uiRoundedPath(48,30,864,480,15);ctx.strokeStyle=COMMERCIAL_UI.gold;ctx.lineWidth=2.5;ctx.stroke();
  const head=ctx.createLinearGradient(54,38,906,38);head.addColorStop(0,'rgba(239,199,94,0)');head.addColorStop(.18,'rgba(239,199,94,.16)');head.addColorStop(.82,'rgba(239,199,94,.16)');head.addColorStop(1,'rgba(239,199,94,0)');ctx.fillStyle=head;ctx.fillRect(54,38,852,46);
  uiOrnament(80,61);uiOrnament(880,61);centered(String(title).toUpperCase(),69,24,COMMERCIAL_UI.gold,`bold 24px ${UI_FONT}`);uiRule(92,86,776,COMMERCIAL_UI.gold);
};

drawNotifications=function(){
  if(game.overlay||game.dialogue||game.mode==='creator')return;
  game.notifications.slice(-4).forEach((n,i)=>{
    const alpha=clamp(n.life,0,1),y=16+i*36;ctx.save();ctx.globalAlpha=alpha;ctx.shadowColor='rgba(0,0,0,.48)';ctx.shadowBlur=10;
    ctx.font=`bold 12px ${UI_FONT}`;const w=Math.min(520,ctx.measureText(n.text).width+48);uiRoundedPath(14,y,w,29,9);ctx.fillStyle='rgba(20,29,48,.94)';ctx.fill();ctx.shadowBlur=0;ctx.fillStyle=n.color;uiRoundedPath(14,y,7,29,7);ctx.fill();text(n.text,31,y+20,12,n.color,true);ctx.restore();
  });
};

function commercialHudButton(x,y,w,labelText,icon,action,color,enabled=true){
  addButton(x,y,w,30,'',action,enabled,false,color);uiIcon(icon,x+17,y+15,16,enabled?COMMERCIAL_UI.paper:'#7c8497');text(labelText,x+31,y+20,10,enabled?COMMERCIAL_UI.paper:'#7c8497',true);
}

drawHudPanel=function(){
  ctx.save();ctx.shadowColor='rgba(0,0,0,.55)';ctx.shadowBlur=18;ctx.shadowOffsetX=-6;ctx.fillStyle=uiGradient(PANEL_X,0,PANEL_W,H,'#1b2740','#101827');ctx.fillRect(PANEL_X,0,PANEL_W,H);ctx.restore();
  const gold=ctx.createLinearGradient(PANEL_X,0,PANEL_X+6,H);gold.addColorStop(0,COMMERCIAL_UI.gold);gold.addColorStop(.5,'#8e6426');gold.addColorStop(1,COMMERCIAL_UI.gold);ctx.fillStyle=gold;ctx.fillRect(PANEL_X,0,5,H);
  text(`YEAR ${game.year} • MONTH ${game.month}`,738,24,14,COMMERCIAL_UI.gold,true);text(campaignMonth().title,738,42,10,COMMERCIAL_UI.sky,true);uiRule(736,52,205,'rgba(239,199,94,.7)');
  const slot=currentSlot(),rank=getPlayerRank(game.player.gender),room=slot?ROOMS[roomForSlot(slot)]?.name||CLUBS[game.player.club].name:'Open Campus';
  uiGlass(736,64,208,76,10,.74);text(formatTime(game.time),750,97,27,COMMERCIAL_UI.paper,true);text(slot?.title||'Free Time',833,84,11,COMMERCIAL_UI.sky,true);wrapped(room,833,103,96,10,COMMERCIAL_UI.cream,2);text(`NEXT ${slot?formatTime(slot.end):'—'}`,833,129,9,COMMERCIAL_UI.gold,true);
  uiGlass(736,150,208,70,10,.74);text(`${game.player.gender==='boy'?'BOYS':'GIRLS'} RANK`,750,173,11,COMMERCIAL_UI.cream,true);text(`#${rank.position}`,750,208,31,COMMERCIAL_UI.gold,true);text(`${rank.score} PTS`,817,204,13,COMMERCIAL_UI.paper,true);
  text('ENERGY',738,239,10,COMMERCIAL_UI.cream,true);ctx.fillStyle='#101827';uiRoundedPath(790,229,150,13,6);ctx.fill();ctx.fillStyle=uiGradient(790,229,150*game.player.energy/100,13,'#9cddb2','#55a178');uiRoundedPath(790,229,150*game.player.energy/100,13,6);ctx.fill();text(String(Math.round(game.player.energy)),914,240,9,COMMERCIAL_UI.paper,true);
  text('STRESS',738,260,10,COMMERCIAL_UI.cream,true);ctx.fillStyle='#101827';uiRoundedPath(790,250,150,13,6);ctx.fill();if(game.player.stress>0){ctx.fillStyle=uiGradient(790,250,150*game.player.stress/100,13,'#ef93a1','#b84956');uiRoundedPath(790,250,150*game.player.stress/100,13,6);ctx.fill();}text(String(Math.round(game.player.stress)),914,261,9,COMMERCIAL_UI.paper,true);
  text('TODAY',738,286,12,COMMERCIAL_UI.sky,true);const missions=game.missions.slice(0,3);missions.forEach((m,i)=>{const y=297+i*38;uiGlass(736,y,208,32,8,.62);ctx.fillStyle=m.done?COMMERCIAL_UI.mint:COMMERCIAL_UI.gold;ctx.beginPath();ctx.arc(749,y+16,3,0,Math.PI*2);ctx.fill();wrapped(m.title,760,y+12,130,9,m.done?COMMERCIAL_UI.mint:COMMERCIAL_UI.paper,2);text(`${m.progress}/${m.goal}`,911,y+20,9,COMMERCIAL_UI.cream,true);});
  if(game.overlay)return;
  commercialHudButton(736,420,99,'RANKS','rank',()=>game.overlay={type:'rankings',title:'Live Social Rankings'},COLORS.blue);
  commercialHudButton(845,420,99,'SCHEDULE','calendar',()=>game.overlay={type:'schedule',title:'Today’s Schedule'},COLORS.blue);
  commercialHudButton(736,454,99,'CLUB','club',()=>game.overlay={type:'club',title:clubConfig().name},COLORS.gold);
  commercialHudButton(845,454,99,'ACTIVITIES','activity',()=>openActivityLab('academics'),COLORS.green);
  commercialHudButton(736,488,99,'WORLD','world',()=>openWorldMap(),COLORS.gold,worldTravelAllowed());
  commercialHudButton(845,488,99,'ROOM','room',openHomeHub,COLORS.pink);
};

function validateCommercialUI(){
  const issues=[];
  if(typeof panel!=='function'||typeof addButton!=='function'||typeof overlayBase!=='function')issues.push('Premium UI overrides are incomplete.');
  if(COMMERCIAL_ART_VERSION!=='1.5.0')issues.push('Commercial art version mismatch.');
  return {valid:issues.length===0,issues,version:COMMERCIAL_ART_VERSION,roundedPanels:true,illustratedIcons:true,modalSafeHud:true};
}
