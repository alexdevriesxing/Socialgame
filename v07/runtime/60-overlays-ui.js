function overlayBase(title){panel(50,30,860,480,COLORS.ink,COLORS.gold,4);centered(title.toUpperCase(),64,26,COLORS.gold,'bold 26px Trebuchet MS');}
function drawRankingsOverlay(o){
  overlayBase(o.title);
  drawRankList(getRanking('girl'),85,118,'GIRLS LADDER',COLORS.pink);
  drawRankList(getRanking('boy'),505,118,'BOYS LADDER',COLORS.sky);
  wrapped(RANKING_RULES.map(r=>`• ${r}`).join('\n'),88,388,750,13,COLORS.cream,7);
  addButton(245,465,145,32,'RIVALS',openRivalBoard);
  addButton(408,465,145,32,'YEARBOOK',openYearbook);
  addButton(571,465,145,32,'CLOSE',()=>game.overlay=null);
}
function drawRankList(list,x,y,title,color){
  text(title,x,y-22,18,color,true);
  list.forEach((r,i)=>{
    const yy=y+i*42;ctx.fillStyle=r.player?'rgba(229,184,75,.2)':'rgba(255,255,255,.04)';ctx.fillRect(x,yy,370,34);
    text(`#${r.position}`,x+10,yy+23,15,r.player?COLORS.gold:COLORS.paper,true);
    text(r.name,x+58,yy+22,14,r.player?COLORS.gold:COLORS.white,true);
    text(String(r.score),x+306,yy+22,14,COLORS.cream,true);
  });
}
function drawScheduleOverlay(o){
  overlayBase(o.title);const slot=currentSlot();
  text('The bell is binding. Required classes allow a short grace period.',86,102,14,COLORS.cream);
  SCHEDULE.filter(s=>s.id!=='arrival').forEach((s,i)=>{
    const y=126+i*29,target=roomForSlot(s);const active=slot?.id===s.id;
    ctx.fillStyle=active?'rgba(229,184,75,.2)':i%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.06)';ctx.fillRect(82,y,796,25);
    text(`${formatTime(s.start)}–${formatTime(s.end)}`,94,y+18,12,active?COLORS.gold:COLORS.paper,true);
    text(s.title,232,y+18,13,active?COLORS.gold:COLORS.white,true);
    text(ROOMS[target]?.name||CLUBS[game.player.club].name,492,y+18,12,COLORS.sky,true);
    text(s.optional?'OPEN':'REQUIRED',758,y+18,11,s.optional?COLORS.mint:COLORS.rose,true);
  });
  addButton(245,465,145,32,'ACTIVITIES',openCampusPlanner);
  addButton(408,465,145,32,'YEARBOOK',openYearbook);
  addButton(571,465,145,32,'CLOSE',()=>game.overlay=null);
}

function drawClubOverlay(o){
  overlayBase(o.title);const club=clubConfig(),thresholds=clubThresholds();
  centered(`${currentClubRank()} • ${game.player.clubXP} XP • Prestige ${game.player.clubPrestige}`,102,16,club.color,'bold 16px Trebuchet MS');
  panel(86,128,380,274,COLORS.deep,club.color,3);
  text('CLUB PATH',108,158,17,club.color,true);
  club.ranks.forEach((rank,i)=>{
    const y=190+i*45,unlocked=i<=game.player.clubRankIndex;
    text(`${unlocked?'✓':'○'} ${rank}`,112,y,15,unlocked?COLORS.gold:COLORS.cream,unlocked);
    text(`${thresholds[i]} XP`,350,y,12,COLORS.sky,true);
  });
  panel(494,128,380,274,COLORS.deep,COLORS.sky,3);
  text('STRATEGY',516,158,17,COLORS.sky,true);
  wrapped(club.perk,516,190,330,14,COLORS.paper,4);
  text(`Rival: ${club.rival}`,516,260,13,COLORS.rose,true);
  text(`Monthly attendance: ${game.player.clubAttendance}`,516,292,13,COLORS.cream,true);
  text(`Competition wins: ${game.player.clubWins}`,516,320,13,COLORS.gold,true);
  text(`Best challenge: ${game.player.challengeBest[game.player.club]||0}%`,516,344,13,COLORS.mint,true);
  wrapped(`Next major event: ${club.competitions[Math.min(3,game.year-1)]}`,516,370,330,12,COLORS.paper,2);
  addButton(230,448,240,34,game.dayFlags.challenge?'CHALLENGE COMPLETE':'PRACTICE CHALLENGE',()=>startClubChallenge('Open practice'),!game.dayFlags.challenge,false,club.color);
  addButton(490,448,240,34,'CLOSE',()=>game.overlay=null);
}

function drawHelpOverlay(o){
  overlayBase(o.title);
  const lines=[
    'MOVE — WASD, arrow keys, or the on-screen direction pad.',
    'INTERACT — E or Space near students, teachers and highlighted locations.',
    'TIME — The school clock advances continuously. Dialogue pauses it.',
    'CLASSES — Reach the correct room before the grace period ends.',
    'DISCIPLINE — Repeated lateness causes demerits, detention and rank penalties.',
    'SOCIAL STATUS — Established, Ordinary and Outsider act as Easy, Normal and Hard.',
    'CLUBS — Attend, earn XP, rise through four ranks and win seasonal competitions.',
    'SOCIAL LIFE — Friends, club prestige, courage and kindness all affect standing.',
    'FRIEND ROUTES — Press J to track 30 bespoke bond chapters across ten students.',
    'PHONE — Press P for 20 authored message conversations unlocked by friendship.',
    'MEMORIES — Press K to replay unlocked friendship chapters in the gallery.',
    'SHOWCASES — Each month ends with a timing, sequence or balance event challenge.',
    'RIVALS — Press V to track respectful competition on your own ranking ladder.',
    'ACTIVITIES — Press A during Free Period for focused after-school sessions.',
    'YEARBOOK — Press Y to review achievements and long-term completion.',
    'RANKINGS — Boys and girls have separate monthly ladders.',
    'LONG GOAL — Complete 4 years × 12 months and earn the Prom crown.'
  ];
  lines.forEach((l,i)=>wrapped(l,95,82+i*22,770,11,i%2?COLORS.cream:COLORS.paper,2));
  addButton(365,465,230,32,'CLOSE',()=>game.overlay=null);
}
function drawDayEnd(o){
  overlayBase(o.title);centered('THE FINAL BELL',103,18,COLORS.sky,'bold 18px Trebuchet MS');
  o.lines.forEach((l,i)=>text(l,225,160+i*40,17,i===0?COLORS.gold:COLORS.paper,i===0));
  if(game.player.detention>0)text('Detention consumed extra energy and raised stress.',225,365,14,COLORS.rose,true);
  const record=showcaseRecord();if(record&&game.day>=20)text(`Monthly showcase: Grade ${record.grade} • ${record.score}%`,225,389,14,COLORS.gold,true);
  addButton(330,430,300,42,game.day>=20?'FINALIZE MONTH':'START NEXT DAY',nextDay);
}
function drawMonthEnd(o){
  overlayBase(o.title);const p=o.playerRank;
  centered(`${o.campaign?.title||MONTHLY_SPECIALS[(game.month-1)%12].event}`,99,16,COLORS.sky,`bold 16px ${UI_FONT}`);
  panel(100,130,300,235,COLORS.deep,COLORS.pink,3);text('GIRLS — FINAL',120,158,17,COLORS.pink,true);
  o.girls.slice(0,6).forEach((r,i)=>text(`${r.position}. ${r.name}`,120,190+i*28,14,r.player?COLORS.gold:COLORS.paper,r.player));
  panel(560,130,300,235,COLORS.deep,COLORS.sky,3);text('BOYS — FINAL',580,158,17,COLORS.sky,true);
  o.boys.slice(0,6).forEach((r,i)=>text(`${r.position}. ${r.name}`,580,190+i*28,14,r.player?COLORS.gold:COLORS.paper,r.player));
  centered(`You finished #${p.position} with ${p.score} points.`,398,19,COLORS.gold,'bold 19px Trebuchet MS');
  const showcase=showcaseRecord();
  centered(`Chapter ${o.campaign?.chapter||((game.year-1)*12+game.month)} of 48 complete • ${o.campaign?.event||''}`,418,14,COLORS.cream,`bold 14px ${UI_FONT}`);
  centered(showcase?`Showcase ${showcase.grade} • ${showcase.score}% • Rival chapters ${game.player.rivalScenes.length}/10 • Badges ${game.player.achievements.length}/24`:'Showcase record unavailable',440,13,COLORS.gold,`bold 13px ${UI_FONT}`);
  addButton(330,464,300,36,game.year===4&&game.month===12?'GO TO PROM':'CONTINUE TO NEXT MONTH',continueMonth);
}

function drawProm(){
  ctx.drawImage(images.keyart,0,0,W,H);ctx.fillStyle='rgba(18,17,34,.55)';ctx.fillRect(0,0,W,H);
  for(let i=0;i<90;i++){
    const x=(i*97+performance.now()/25)%W,y=(i*53+Math.sin(i)*80)%H;ctx.fillStyle=[COLORS.gold,COLORS.pink,COLORS.sky,COLORS.mint][i%4];ctx.fillRect(x,y,4,8);
  }
  panel(120,76,720,414,COLORS.panel,COLORS.gold,5);
  centered('SAKURA CREST PROM',132,34,COLORS.gold,'bold 34px Trebuchet MS');
  centered(game.promResult||'Four years become one final night.',207,21,COLORS.paper,'bold 21px Trebuchet MS');
  centered(`Monthly results: ${game.player.monthlyScores.length} • Memories: ${game.player.routeScenes.length}/30 • Messages: ${game.player.messageReplies.length}/20`,270,14,COLORS.sky,'bold 14px Trebuchet MS');
  centered(`Showcase wins: ${game.player.showcaseWins} • Rival chapters: ${game.player.rivalScenes.length}/10 • Badges: ${game.player.achievements.length}/24`,294,14,COLORS.gold,'bold 14px Trebuchet MS');
  wrapped(`The crown is only one ending. Every friendship, rivalry, activity, message, showcase, apology, brave choice and ordinary day became part of your school legend. ${game.promCompanion||'Your closest friends'} stands beside you as the final song begins.`,190,330,580,16,COLORS.cream,5);
  addButton(330,442,300,38,'RETURN TO TITLE',()=>{game.mode='title';game.overlay=null;});
}

function drawNotifications(){
  game.notifications.forEach((n,i)=>{
    const alpha=clamp(n.life,0,1);ctx.globalAlpha=alpha;const y=18+i*28;
    ctx.font='bold 13px Trebuchet MS';const w=Math.min(600,ctx.measureText(n.text).width+26);
    panel(12,y,w,22,'rgba(28,29,43,.9)',n.color,2);text(n.text,22,y+16,12,n.color,true);ctx.globalAlpha=1;
  });
}

function addButton(x,y,w,h,labelText,onClick,enabled=true,selected=false,color=COLORS.blue,opts={}){
  const hover=pointer.x>=x&&pointer.x<=x+w&&pointer.y>=y&&pointer.y<=y+h;
  ctx.fillStyle=!enabled?'#454858':selected?COLORS.gold:hover?lighten(color):color;
  ctx.fillRect(x,y,w,h);ctx.strokeStyle=selected?COLORS.paper:COLORS.ink;ctx.lineWidth=selected?3:2;ctx.strokeRect(x+.5,y+.5,w-1,h-1);
  centeredAt(labelText,x+w/2,y+h/2+5,Math.min(15,h*.42),selected?COLORS.ink:COLORS.paper,`bold ${Math.min(15,h*.42)}px Trebuchet MS`);
  buttons.push({x,y,w,h,onClick,enabled,holdKey:opts.holdKey||null,world:opts.world||false});
}
function panel(x,y,w,h,fill,stroke,width=2){ctx.fillStyle=fill;ctx.fillRect(x,y,w,h);ctx.strokeStyle=stroke;ctx.lineWidth=width;ctx.strokeRect(x+.5,y+.5,w-1,h-1);ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;ctx.strokeRect(x+4.5,y+4.5,w-9,h-9);}
function label(t,x,y,w,h,color){ctx.fillStyle=COLORS.shadow;ctx.fillRect(x,y,w,h);ctx.strokeStyle=color;ctx.strokeRect(x+.5,y+.5,w-1,h-1);centeredAt(t,x+w/2,y+h/2+4,10,color,'bold 10px Trebuchet MS');}
function text(t,x,y,size=14,color=COLORS.paper,bold=false){ctx.font=`${bold?'bold ':''}${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textBaseline='alphabetic';ctx.fillText(String(t),x,y);}
function centered(t,y,size=14,color=COLORS.paper,font=null){ctx.font=font||`${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(String(t),W/2,y);ctx.textAlign='left';}
function centeredAt(t,x,y,size=14,color=COLORS.paper,font=null){ctx.font=font||`${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(String(t),x,y);ctx.textAlign='left';}
function wrapped(t,x,y,maxW,size=14,color=COLORS.paper,maxLines=6){
  ctx.font=`${size}px Trebuchet MS`;ctx.fillStyle=color;const paras=String(t).split('\n');let lineY=y,used=0;
  for(const para of paras){
    const words=para.split(' ');let line='';
    for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxW&&line){ctx.fillText(line,x,lineY);lineY+=size+4;used++;line=word;if(used>=maxLines)return;}else line=test;}
    if(line&&used<maxLines){ctx.fillText(line,x,lineY);lineY+=size+4;used++;}
    if(!para&&used<maxLines){lineY+=size+4;used++;}
    if(used>=maxLines)return;
  }
}
function lighten(hex){return hex;}
