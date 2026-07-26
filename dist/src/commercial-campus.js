// Commercial Art Pass v1.5 — fully illustrated academy map and character staging.
function artLine(x1,y1,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
function artRect(x,y,w,h,fill,stroke=null,width=1,r=0){if(r){uiRoundedPath(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}else{ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}}}
function artEllipse(x,y,rx,ry,fill,stroke=null,width=1){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fillStyle=fill;ctx.fill();if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.stroke();}}
function artWoodFloor(x,y,w,h,base='#b98558'){
  artRect(x,y,w,h,base);for(let yy=y;yy<y+h;yy+=34){artLine(x,yy,x+w,yy,'rgba(70,42,30,.18)',1);for(let xx=x+(Math.floor((yy-y)/34)%2)*55;xx<x+w;xx+=110)artLine(xx,yy,xx,Math.min(y+h,yy+34),'rgba(70,42,30,.16)',1);}
  const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'rgba(255,255,255,.15)');g.addColorStop(.55,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(70,34,20,.15)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
}
function artTileFloor(x,y,w,h,base='#d9d5c9',line='#aab2b7',size=38){artRect(x,y,w,h,base);ctx.strokeStyle=line;ctx.lineWidth=1;ctx.globalAlpha=.35;for(let xx=x;xx<=x+w;xx+=size)artLine(xx,y,xx,y+h,line,1);for(let yy=y;yy<=y+h;yy+=size)artLine(x,yy,x+w,yy,line,1);ctx.globalAlpha=1;}
function artWall(x,y,w,h,color='#f2eadf'){artRect(x,y,w,h,color);const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,'rgba(255,255,255,.36)');g.addColorStop(.75,'rgba(255,255,255,0)');g.addColorStop(1,'rgba(82,61,49,.08)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);}
function artWindow(x,y,w,h,season){
  const sky={spring:['#a8ddf2','#f2b5c8'],summer:['#7fc8ed','#b7e9ff'],autumn:['#b6d9e9','#e3b06e'],winter:['#b9d3e5','#e8f0f4']}[season]||['#a8ddf2','#f2b5c8'];
  artRect(x,y,w,h,'#dfe7ec','#50677e',5,7);artRect(x+5,y+5,w-10,h-10,uiGradient(x,y,w,h,sky[0],sky[1]));artLine(x+w/2,y+5,x+w/2,y+h-5,'rgba(76,98,120,.65)',3);artLine(x+5,y+h*.56,x+w-5,y+h*.56,'rgba(76,98,120,.65)',3);ctx.fillStyle='rgba(255,255,255,.4)';ctx.fillRect(x+12,y+10,w*.22,4);
}
function artDesk(x,y,scale=1){
  ctx.save();ctx.translate(x,y);ctx.shadowColor='rgba(31,22,18,.28)';ctx.shadowBlur=5;ctx.shadowOffsetY=4;artRect(-25*scale,-12*scale,50*scale,25*scale,'#a9673f','#5f3928',2,5);ctx.shadowBlur=0;artRect(-20*scale,13*scale,5*scale,23*scale,'#425263');artRect(15*scale,13*scale,5*scale,23*scale,'#425263');ctx.fillStyle='rgba(255,255,255,.18)';uiRoundedPath(-20*scale,-8*scale,35*scale,4*scale,2);ctx.fill();ctx.restore();
}
function artChair(x,y,scale=1){ctx.save();ctx.translate(x,y);artRect(-16*scale,-10*scale,32*scale,21*scale,'#bd7b4f','#6d432c',2,5);artRect(-12*scale,11*scale,4*scale,19*scale,'#485667');artRect(8*scale,11*scale,4*scale,19*scale,'#485667');ctx.restore();}
function artPlant(x,y,scale=1){ctx.save();ctx.translate(x,y);artRect(-12*scale,15*scale,24*scale,20*scale,'#a8623c','#6e3e29',2,4);['#4f9a6c','#69ad75','#3f825c'].forEach((c,i)=>{ctx.fillStyle=c;ctx.beginPath();ctx.ellipse((i-1)*7*scale,(5-i*5)*scale,8*scale,18*scale,(i-1)*.45,0,Math.PI*2);ctx.fill();});ctx.restore();}
function artTree(x,y,scale=1,season='spring'){
  ctx.save();ctx.translate(x,y);ctx.shadowColor='rgba(14,28,30,.28)';ctx.shadowBlur=12;ctx.shadowOffsetY=8;ctx.fillStyle='#78503b';uiRoundedPath(-8*scale,8*scale,16*scale,65*scale,6*scale);ctx.fill();ctx.shadowBlur=0;
  const colors={spring:['#f5aac2','#e98ba9','#ffd5df'],summer:['#5ea86f','#3f8c5c','#83bd79'],autumn:['#e7a34f','#c96e42','#e9c35d'],winter:['#d5e3e8','#bfcdd4','#eef4f5']}[season];
  [[-25,-7,30],[5,-19,34],[32,1,29],[-4,14,36]].forEach((p,i)=>artEllipse(p[0]*scale,p[1]*scale,p[2]*scale,p[2]*.82*scale,colors[i%colors.length],'rgba(64,59,70,.12)',1));ctx.restore();
}
function artRoomFrame(room,accent='#6b829c'){
  ctx.save();ctx.shadowColor='rgba(15,23,42,.25)';ctx.shadowBlur=14;ctx.shadowOffsetY=7;uiRoundedPath(room.x,room.y,room.w,room.h,16);ctx.fillStyle='#f3eee5';ctx.fill();ctx.restore();uiRoundedPath(room.x+.5,room.y+.5,room.w-1,room.h-1,16);ctx.strokeStyle='#31465e';ctx.lineWidth=6;ctx.stroke();uiRoundedPath(room.x+7.5,room.y+7.5,room.w-15,room.h-15,11);ctx.strokeStyle=accent;ctx.lineWidth=1.5;ctx.stroke();
}
function artRoomPlaque(name,x,y,w=170){ctx.save();ctx.shadowColor='rgba(0,0,0,.32)';ctx.shadowBlur=6;artRect(x,y,w,27,'#24344c','#d5b45f',1.5,7);ctx.restore();centeredAt(name,x+w/2,y+18,11,'#fff6e5',`bold 11px ${UI_FONT}`);}
function artClassroom(id,room,season){
  artRoomFrame(room,id==='homeroom'?'#d59ab0':id==='math'?'#7bb9ca':'#a794c8');artWall(room.x+8,room.y+8,room.w-16,82,'#f0e9de');artWoodFloor(room.x+8,room.y+90,room.w-16,room.h-98,id==='literature'?'#a97858':'#b88358');
  artWindow(room.x+24,room.y+18,78,55,season);artWindow(room.x+112,room.y+18,78,55,season);artWindow(room.x+200,room.y+18,78,55,season);
  artRect(room.x+room.w-118,room.y+18,94,55,id==='literature'?'#4d3e55':'#315b55','#d5bc75',3,4);ctx.fillStyle='rgba(255,255,255,.7)';ctx.font=`bold 10px ${UI_FONT}`;ctx.fillText(id==='math'?'x² + y²':id==='literature'?'STORIES':'WELCOME',room.x+room.w-106,room.y+48);
  const positions=[[65,128],[140,128],[215,128],[290,128],[65,194],[140,194],[215,194],[290,194]];positions.forEach(([dx,dy])=>{artDesk(room.x+dx,room.y+dy,.78);artChair(room.x+dx,room.y+dy+30,.72);});
  artRect(room.x+16,room.y+93,18,86,'#d3c1ab','#7c6655',1,4);artPlant(room.x+room.w-42,room.y+room.h-55,.8);artRoomPlaque(room.name,room.x+room.w/2-82,room.y+room.h-36,164);
}
function artLibrary(room,season){
  artRoomFrame(room,'#79a5a7');artWall(room.x+8,room.y+8,room.w-16,room.h-16,'#e9e4d8');artWoodFloor(room.x+8,room.y+room.h-64,room.w-16,56,'#9d7457');artWindow(room.x+21,room.y+18,83,55,season);
  for(let shelf=0;shelf<3;shelf++){const yy=room.y+86+shelf*47;artRect(room.x+17,yy,92,39,'#664934','#3a2c25',2,4);for(let i=0;i<8;i++){const colors=['#ba655b','#527f9d','#d09b4a','#729265','#8c6fa2'];artRect(room.x+22+i*10,yy+7,7,27-(i%3)*3,colors[(i+shelf)%colors.length]);}}
  artRect(room.x+18,room.y+room.h-55,88,25,'#3d5c6d','#d5bc75',2,5);artRoomPlaque('LIBRARY',room.x+12,room.y+room.h-35,101);
}
function artHallway(room,season){
  artRoomFrame(room,'#d5b45f');artWall(room.x+8,room.y+8,room.w-16,42,'#f2eee6');artTileFloor(room.x+8,room.y+50,room.w-16,room.h-58,'#d9d2c7','#a19b92',46);
  for(let i=0;i<8;i++){const x=room.x+35+i*146;artRect(x,room.y+18,112,25,'#d8e8ed','#4b687c',2,5);ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x+8,room.y+22,34,4);}
  for(let i=0;i<8;i++){const x=room.x+50+i*145;artRect(x,room.y+60,74,43,i%2?'#6d819a':'#637993','#35465b',2,4);for(let d=0;d<3;d++)artLine(x+18+d*18,room.y+65,x+18+d*18,room.y+96,'rgba(255,255,255,.14)',1);}
  artRect(room.x+525,room.y+53,170,50,'rgba(36,50,72,.9)','#d5b45f',2,6);centeredAt('SAKURA CREST',room.x+610,room.y+76,13,'#efc75e',`bold 13px ${UI_FONT}`);centeredAt('Character • Community • Courage',room.x+610,room.y+92,8,'#e9dfc9',`8px ${UI_FONT}`);
  artPlant(room.x+20,room.y+67,.55);artPlant(room.x+room.w-22,room.y+67,.55);artRoomPlaque('MAIN HALL',room.x+room.w/2-75,room.y+room.h-33,150);
}
function artCourtyard(room,season){
  artRoomFrame(room,'#77a982');artRect(room.x+8,room.y+8,room.w-16,room.h-16,'#72ad75');
  const grass=ctx.createLinearGradient(room.x,room.y,room.x+room.w,room.y+room.h);grass.addColorStop(0,'rgba(255,255,255,.14)');grass.addColorStop(.45,'rgba(255,255,255,0)');grass.addColorStop(1,'rgba(23,80,50,.16)');ctx.fillStyle=grass;ctx.fillRect(room.x+8,room.y+8,room.w-16,room.h-16);
  artRect(room.x+145,room.y+8,80,room.h-16,'#d7cbbb');artRect(room.x+8,room.y+145,room.w-16,76,'#d7cbbb');
  artEllipse(room.x+185,room.y+183,67,67,'#547990','#31556f',5);artEllipse(room.x+185,room.y+183,52,52,'#81c9dc','#d8f2f8',4);artEllipse(room.x+185,room.y+183,22,22,'#e7eef0','#597389',4);ctx.fillStyle='rgba(255,255,255,.65)';artEllipse(room.x+168,room.y+164,8,4,'rgba(255,255,255,.7)');
  artTree(room.x+62,room.y+80,.72,season);artTree(room.x+310,room.y+82,.72,season);artTree(room.x+65,room.y+275,.62,season);artTree(room.x+307,room.y+276,.62,season);
  [[58,172],[285,171],[58,245],[285,245]].forEach(([dx,dy])=>{artRect(room.x+dx,room.y+dy,55,15,'#8e6546','#513a2b',2,5);artRect(room.x+dx+7,room.y+dy+15,5,15,'#454f59');artRect(room.x+dx+42,room.y+dy+15,5,15,'#454f59');});
  artRoomPlaque('SAKURA COURTYARD',room.x+94,room.y+room.h-38,182);
}
function artCafeteria(room,season){
  artRoomFrame(room,'#d59b69');artTileFloor(room.x+8,room.y+8,room.w-16,room.h-16,'#eee2d0','#c6b5a1',40);artRect(room.x+18,room.y+18,room.w-36,58,'#6e4935','#3d2e28',3,8);
  for(let i=0;i<5;i++){artRect(room.x+32+i*61,room.y+31,45,31,['#b96555','#d49a4e','#5f8e72','#6f82a6','#9b6f9b'][i],'rgba(255,255,255,.2)',1,4);}
  text('TODAY • CURRY • SOUP • RICE',room.x+57,room.y+67,10,'#fff4d8',true);
  [[75,125],[190,125],[300,125],[75,225],[190,225],[300,225]].forEach(([dx,dy])=>{artRect(room.x+dx-42,room.y+dy-16,84,32,'#b47a50','#68452e',2,8);artChair(room.x+dx-55,room.y+dy+20,.55);artChair(room.x+dx+55,room.y+dy+20,.55);});
  artPlant(room.x+28,room.y+room.h-58,.75);artRoomPlaque('CREST CAFETERIA',room.x+88,room.y+room.h-38,180);
}
function artGym(room){
  artRoomFrame(room,'#c9635c');artWoodFloor(room.x+8,room.y+8,room.w-16,room.h-16,'#bf8752');
  ctx.strokeStyle='rgba(255,255,255,.76)';ctx.lineWidth=4;ctx.strokeRect(room.x+42,room.y+50,room.w-84,room.h-100);ctx.beginPath();ctx.arc(room.x+room.w/2,room.y+room.h/2,66,0,Math.PI*2);ctx.stroke();artLine(room.x+room.w/2,room.y+50,room.x+room.w/2,room.y+room.h-50,'rgba(255,255,255,.76)',4);
  artRect(room.x+18,room.y+42,60,190,'#46566b','#283648',2,5);for(let i=0;i<5;i++)artRect(room.x+24,room.y+51+i*35,48,25,i%2?'#596d86':'#52647a');
  artRect(room.x+room.w-63,room.y+88,8,78,'#35475a');artRect(room.x+room.w-92,room.y+86,66,9,'#e8e9e5','#b8424b',3,2);artEllipse(room.x+room.w-59,room.y+99,22,7,'rgba(255,255,255,0)','#b8424b',3);
  artRect(room.x+145,room.y+18,160,31,'#27384f','#d5b45f',2,6);centeredAt('SKYBOUND ATHLETICS',room.x+225,room.y+39,12,'#efc75e',`bold 12px ${UI_FONT}`);artRoomPlaque('GYMNASIUM',room.x+room.w/2-75,room.y+room.h-38,150);
}
function commercialDrawCampusMap(){
  const season=seasonKey();artRect(0,0,1280,800,'#d8e4e9');
  const outside=ctx.createLinearGradient(0,0,0,800);outside.addColorStop(0,'#cfe8f1');outside.addColorStop(1,'#91b4b4');ctx.fillStyle=outside;ctx.fillRect(0,0,1280,800);
  for(let i=0;i<35;i++){const x=(i*179)%1280,y=(i*97)%800;artEllipse(x,y,36+(i%5)*7,18+(i%3)*5,'rgba(255,255,255,.08)');}
  artClassroom('homeroom',ROOMS.homeroom,season);artClassroom('math',ROOMS.math,season);artClassroom('literature',ROOMS.literature,season);artLibrary(ROOMS.library,season);artHallway(ROOMS.hallway,season);artCourtyard(ROOMS.courtyard,season);artCafeteria(ROOMS.cafeteria,season);artGym(ROOMS.gym);
}

function commercialActorBadge(actor,sx,sy){
  const rel=actor.id&&game.player.relationships?.[actor.id]||0,heat=actor.id&&game.player.rivalHeat?.[actor.id]||0;
  if(rel>=12){ctx.fillStyle=COMMERCIAL_UI.rose;ctx.beginPath();ctx.moveTo(sx,sy-94);ctx.bezierCurveTo(sx-10,sy-105,sx-19,sy-88,sx,sy-76);ctx.bezierCurveTo(sx+19,sy-88,sx+10,sy-105,sx,sy-94);ctx.fill();}
  else if(heat>=10){ctx.strokeStyle=COMMERCIAL_UI.gold;ctx.lineWidth=2;ctx.beginPath();ctx.arc(sx,sy-84,8,0,Math.PI*2);ctx.stroke();artLine(sx-5,sy-89,sx+5,sy-79,COMMERCIAL_UI.gold,2);}
}

drawWorldCharacters=function(){
  const labelActor=visualNearestLabelActor();const actors=[...game.npcs.map(n=>({...n,type:'npc',source:n})),...game.teachers.map(t=>({...t,type:'teacher',source:t})),{...game.player,id:game.player.gender==='boy'?'player_boy':'player_girl',type:'player',source:game.player}];actors.sort((a,b)=>a.y-b.y);
  for(const actor of actors){
    const source=actor.source||actor,sx=Math.round(actor.x-game.camera.x),sy=Math.round(actor.y-game.camera.y);if(sx<-70||sx>VIEW_W+70||sy<-100||sy>H+55||CHARACTER_INDEX[actor.id]===undefined)continue;
    const moving=actor.type!=='player'&&source.campus?.state==='moving',row=actor.type==='player'?game.player.direction:(source.direction??0);let column=actor.type==='player'?game.player.anim:moving?(source.anim??1):Math.floor((performance.now()+actor.x*7)/1100)%2?3:4;
    if(actor.type==='npc'&&sameLadder(actor)&&(game.player.rivalHeat[actor.id]||0)>=12)column=5;if(actor.type==='npc'&&(game.player.relationships[actor.id]||0)>=15)column=6;if(actor.type==='npc'&&(game.player.friendshipMoments||[]).some(id=>id.startsWith(actor.id)))column=Math.floor(performance.now()/1400)%2?7:8;
    ctx.save();ctx.shadowColor='rgba(8,16,25,.38)';ctx.shadowBlur=9;artEllipse(sx,sy-1,21,8,'rgba(20,30,40,.32)');ctx.restore();
    if(actor.type==='player'){ctx.strokeStyle=COMMERCIAL_UI.gold;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(sx,sy-1,24,10,0,0,Math.PI*2);ctx.stroke();}
    drawCharacter(actor.id,column,row,sx-33,sy-91,66,91);if(actor.type!=='player')commercialActorBadge(actor,sx,sy);
    if(actor.type!=='player'){ctx.fillStyle=campusActorColor(source);ctx.beginPath();ctx.arc(sx+25,sy-82,4.5,0,Math.PI*2);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.7)';ctx.lineWidth=1;ctx.stroke();
      if(labelActor?.id===actor.id){const activity=String(source.campus?.activity||'Campus routine').replace('In transit • ','→ '),short=activity.length>27?`${activity.slice(0,26)}…`:activity;label(actor.name,sx-72,sy-95,144,22,actor.type==='teacher'?COMMERCIAL_UI.rose:COMMERCIAL_UI.sky);label(short,sx-86,sy-69,172,20,campusActorColor(source));}
    }
  }
};

drawPlay=function(){
  ctx.save();ctx.beginPath();ctx.rect(0,0,VIEW_W,H);ctx.clip();ctx.save();ctx.translate(-game.camera.x,-game.camera.y);commercialDrawCampusMap();ctx.restore();drawWorldMarkers();drawWorldCharacters();drawAmbientWeather();drawMobileControls();ctx.restore();drawHudPanel();
};

function validateCommercialCampus(){
  const issues=[];if(Object.keys(ROOMS).length!==8)issues.push('Commercial campus renderer expects eight canonical rooms.');if(typeof commercialDrawCampusMap!=='function')issues.push('Campus illustration renderer is missing.');
  return {valid:issues.length===0,issues,illustratedRooms:8,materials:['wood','tile','grass','glass'],seasonalCourtyard:true,placeholderMap:false};
}
