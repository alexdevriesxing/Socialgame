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
    'YEARBOOK — Press Y to review achievements, illustrated moments and legacy progress.',
    'MOMENTS — Complete a full friendship route and reach Bond 15 to unlock its illustrated epilogue.',
    'INCIDENTS — Breaks, lunch and Free Period can produce contextual situations shaped by weather and month.',
    'MASTERY — Free Period activities now use timing, sequence, balance or focus minigames.',
    'RANKINGS — Boys and girls have separate monthly ladders.',
    'EXAMS — Midterms and finals appear twice per year and influence academic standing.',
    'WEEKENDS — Plan one friend outing after each monthly ranking final.',
    'LEADERSHIP — Press L to review annual campaigns; Month 9 ends with a student election.',
    'NEW GAME+ — After Prom, carry achievements and memories into a new school life.',
    'OPTIONS — Press O for motion, contrast, text-size and gamepad settings.',
    'LONG GOAL — Complete 4 years × 12 months and earn the Prom crown.'
  ];
  lines.forEach((l,i)=>wrapped(l,95,78+i*19,770,10,i%2?COLORS.cream:COLORS.paper,2));
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
  const election=electionRecord();
  centered(showcase?`Showcase ${showcase.grade} • ${showcase.score}% • ${election?`Election ${election.result}`:`Leadership wins ${game.player.leadershipWins||0}/4`} • Badges ${game.player.achievements.length}/${ACHIEVEMENTS.length}`:'Showcase record unavailable',440,13,COLORS.gold,`bold 13px ${UI_FONT}`);
  addButton(184,464,280,36,weekendRecord()?'WEEKEND COMPLETE':'PLAN WEEKEND',()=>openWeekendPlanner(o),!weekendRecord(),false,COLORS.pink);
  addButton(496,464,280,36,game.year===4&&game.month===12?'GO TO PROM':'CONTINUE TO NEXT MONTH',continueMonth);
}

function drawProm(){
  ctx.drawImage(images.keyart,0,0,W,H);ctx.fillStyle='rgba(18,17,34,.55)';ctx.fillRect(0,0,W,H);
  for(let i=0;i<90;i++){
    const x=(i*97+performance.now()/25)%W,y=(i*53+Math.sin(i)*80)%H;ctx.fillStyle=[COLORS.gold,COLORS.pink,COLORS.sky,COLORS.mint][i%4];ctx.fillRect(x,y,4,8);
  }
  const legacy=game.player.graduationLegacy||determineGraduationLegacy(/crowned Prom/.test(game.promResult||''));
  panel(100,58,760,438,COLORS.panel,legacy.color||COLORS.gold,5);
  centered('SAKURA CREST PROM',110,32,COLORS.gold,'bold 32px Trebuchet MS');
  centered(game.promResult||'Four years become one final night.',170,19,COLORS.paper,'bold 19px Trebuchet MS');
  centered(`LEGACY • ${legacy.name}`,218,22,legacy.color||COLORS.gold,'bold 22px Trebuchet MS');
  centered(legacy.subtitle,245,14,COLORS.sky,`bold 14px ${UI_FONT}`);
  centered(`Monthly results ${game.player.monthlyScores.length} • Moments ${game.player.friendshipMoments.length}/10 • Messages ${game.player.messageReplies.length}/20`,282,13,COLORS.paper,`bold 13px ${UI_FONT}`);
  centered(`Showcase wins ${game.player.showcaseWins} • Elections ${game.player.leadershipWins||0}/4 • Incidents ${game.player.incidentHistory.length} • Badges ${game.player.achievements.length}/${ACHIEVEMENTS.length}`,306,13,COLORS.gold,`bold 13px ${UI_FONT}`);
  wrapped(`${legacy.description} Every friendship, rivalry, activity, message, showcase, apology and ordinary day became part of the record. ${game.promCompanion||'Your closest friends'} stands beside you as the final song begins.`,170,342,620,15,COLORS.cream,5);
  addButton(126,449,220,36,'VIEW LEGACY',()=>game.overlay={type:'legacy',title:'Graduation Legacy'});
  addButton(370,449,220,36,'NEW GAME+',openNewGamePlus);
  addButton(614,449,220,36,'RETURN TO TITLE',()=>{game.mode='title';game.overlay=null;});
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
function uiTextSize(size){return game.settings?.largeText?Math.round(size*1.12):size;}
function text(t,x,y,size=14,color=COLORS.paper,bold=false){size=uiTextSize(size);ctx.font=`${bold?'bold ':''}${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textBaseline='alphabetic';ctx.fillText(String(t),x,y);}
function centered(t,y,size=14,color=COLORS.paper,font=null){size=uiTextSize(size);ctx.font=font||`${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(String(t),W/2,y);ctx.textAlign='left';}
function centeredAt(t,x,y,size=14,color=COLORS.paper,font=null){size=uiTextSize(size);ctx.font=font||`${size}px Trebuchet MS`;ctx.fillStyle=color;ctx.textAlign='center';ctx.fillText(String(t),x,y);ctx.textAlign='left';}
function wrapped(t,x,y,maxW,size=14,color=COLORS.paper,maxLines=6){
  size=uiTextSize(size);ctx.font=`${size}px Trebuchet MS`;ctx.fillStyle=color;const paras=String(t).split('\n');let lineY=y,used=0;
  for(const para of paras){
    const words=para.split(' ');let line='';
    for(const word of words){const test=line?`${line} ${word}`:word;if(ctx.measureText(test).width>maxW&&line){ctx.fillText(line,x,lineY);lineY+=size+4;used++;line=word;if(used>=maxLines)return;}else line=test;}
    if(line&&used<maxLines){ctx.fillText(line,x,lineY);lineY+=size+4;used++;}
    if(!para&&used<maxLines){lineY+=size+4;used++;}
    if(used>=maxLines)return;
  }
}
function lighten(hex){return hex;}


function canvasPoint(e){const r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)*W/r.width,y:(e.clientY-r.top)*H/r.height};}
canvas.addEventListener('pointermove',e=>{pointer=canvasPoint(e);});
canvas.addEventListener('pointerdown',e=>{
  pointer={...canvasPoint(e),down:true};audio.ensure();
  for(let i=buttons.length-1;i>=0;i--){const b=buttons[i];if(b.enabled&&pointer.x>=b.x&&pointer.x<=b.x+b.w&&pointer.y>=b.y&&pointer.y<=b.y+b.h){audio.click();if(b.holdKey)keys.add(b.holdKey);else b.onClick();break;}}
});
canvas.addEventListener('pointerup',()=>{pointer.down=false;['arrowup','arrowdown','arrowleft','arrowright'].forEach(k=>keys.delete(k));});
canvas.addEventListener('pointerleave',()=>{pointer.down=false;['arrowup','arrowdown','arrowleft','arrowright'].forEach(k=>keys.delete(k));});
window.addEventListener('keydown',e=>{
  const k=e.key.toLowerCase();keys.add(k);
  if(['arrowup','arrowdown','arrowleft','arrowright',' ','e','q','r','j','p','k','a','v','y','o','l'].includes(k))e.preventDefault();
  if(game.dialogue){
    if(k===' '||k==='e'||k==='enter'){
      if(game.dialogue.reveal<game.dialogue.text.length)game.dialogue.reveal=game.dialogue.text.length;
      else closeDialogue(game.dialogue.selected||0);
    } else if(['1','2','3','4'].includes(k)&&game.dialogue.reveal>=game.dialogue.text.length)closeDialogue(Number(k)-1);
    else if(k==='arrowdown')game.dialogue.selected=(game.dialogue.selected+1)%Math.max(1,game.dialogue.choices.length);
    else if(k==='arrowup')game.dialogue.selected=(game.dialogue.selected-1+Math.max(1,game.dialogue.choices.length))%Math.max(1,game.dialogue.choices.length);
    return;
  }
  if(game.overlay?.type==='election'){
    if(game.overlay.phase==='platform'&&['1','2','3','4'].includes(k))chooseCampaignPlatform(CAMPAIGN_PLATFORMS[Number(k)-1].id);
    else if(game.overlay.phase==='question'&&['1','2','3'].includes(k))electionAnswer(Number(k)-1);
    else if(game.overlay.phase==='feedback'&&(k===' '||k==='e'||k==='enter'))nextElectionQuestion();
    else if(game.overlay.phase==='result'&&(k===' '||k==='e'||k==='enter')){game.overlay=null;setTimeout(endDay,40);}
    return;
  }
  if(game.overlay?.type==='exam'){
    if(game.overlay.phase==='prep'&&['1','2','3'].includes(k))chooseExamPrep(['notes','practice','rest'][Number(k)-1]);
    else if(game.overlay.phase==='question'&&['1','2','3','4'].includes(k))examAnswer(Number(k)-1);
    else if(game.overlay.phase==='feedback'&&(k===' '||k==='e'||k==='enter'))nextExamQuestion();
    else if(game.overlay.phase==='result'&&(k===' '||k==='e'||k==='enter')){game.overlay=null;setTimeout(endDay,40);}
    return;
  }
  if(game.overlay?.type==='challenge'){if(k===' '||k==='e'||k==='enter')challengeHit();else if(k==='escape'&&game.overlay.phase==='result')game.overlay=null;return;}
  if(game.overlay?.type==='activityMastery'){
    const o=game.overlay;
    if(o.phase==='result'){if(k===' '||k==='e'||k==='enter'||k==='escape')game.overlay=null;return;}
    if(o.mechanic==='sequence'&&['1','2','3','4'].includes(k))campusMasteryAction(Number(k)-1);
    else if((o.mechanic==='timing'||o.mechanic==='focus')&&(k===' '||k==='e'||k==='enter'))campusMasteryAction();
    else if(o.mechanic==='balance'&&k==='arrowleft')setCampusBalanceControl(-1);
    else if(o.mechanic==='balance'&&k==='arrowright')setCampusBalanceControl(1);
    return;
  }
  if(game.overlay?.type==='showcase'){
    if(game.overlay.phase==='result'){if(k===' '||k==='e'||k==='enter'){game.overlay=null;setTimeout(endDay,40);}else if(k==='escape')game.overlay=null;}
    else if(game.overlay.mechanic==='sequence'&&['1','2','3','4'].includes(k))showcaseAction(Number(k)-1);
    else if(game.overlay.mechanic==='timing'&&(k===' '||k==='e'||k==='enter'))showcaseAction();
    return;
  }
  if(game.overlay){if(k==='escape'||k==='q'||k==='r'||k==='j'||k==='p'||k==='k'||k==='a'||k==='v'||k==='y'||k==='o'||k==='l')game.overlay=null;return;}
  if(game.mode==='play'){
    if(k==='e'||k===' ')interact();
    if(k==='r')game.overlay={type:'rankings',title:'Live Social Rankings'};
    if(k==='q')game.overlay={type:'schedule',title:'Class Schedule'};
    if(k==='j')game.overlay={type:'relationships',title:'Friendships'};
    if(k==='p')openPhone();
    if(k==='k')game.overlay={type:'memories',title:'Memory Gallery',page:0};
    if(k==='a')openCampusPlanner();
    if(k==='v')openRivalBoard();
    if(k==='y')openYearbook();
    if(k==='o')openAccessibility();
    if(k==='l')openLeadershipJournal();
    if(k==='m')audio.toggle();
    if(k==='escape'){game.paused=!game.paused;notify(game.paused?'Paused':'Resumed',COLORS.sky);}
  }
});
window.addEventListener('keyup',e=>{const k=e.key.toLowerCase();keys.delete(k);if(game.overlay?.type==='activityMastery'&&game.overlay.mechanic==='balance'&&(k==='arrowleft'||k==='arrowright'))setCampusBalanceControl(0);});

confirmName.addEventListener('click',()=>{
  const n=nameInput.value.trim().replace(/[^A-Za-z0-9 '\-]/g,'').slice(0,12)||'Akira';
  game.player.name=n;game.player.gender=game.creatorGender;game.player.club=game.creatorClub;game.player.socialStatus=game.creatorStatus;
  if(game.player.gender==='girl'){game.player.stats.kindness++;game.player.stats.talent++;}
  else{game.player.stats.courage++;game.player.stats.fitness++;}
  game.player.stats[CLUBS[game.player.club].stat]+=2;initializeSocialStatus();
  creator.classList.add('hidden');game.mode='play';assignMissions();relocateNPCs('arrival');audio.startMusic();
  openDialogue({speaker:'Ms. Hayashi',portrait:12,text:`Welcome to ${SCHOOL_NAME}, ${game.player.name}.\n\nYour schedule matters. Reach each room before the grace period ends, build real friendships, contribute to ${clubConfig().name}, and remember: the monthly rankings measure conduct as well as popularity.

Starting status: ${statusConfig().name} (${statusConfig().difficulty}). ${statusConfig().description}`,choices:[{text:'I am ready.',effects:{reliability:1,score:4},result:'The first bell is ten minutes away. Class 1-A is through the blue-marked door.',action:()=>setTimeout(showMonthIntro,120)}]});
});

function loop(now){const dt=Math.min(.05,(now-lastTime)/1000);lastTime=now;update(dt);draw();requestAnimationFrame(loop);}

Promise.all(imageNames.map(loadImage)).then(()=>{
  loading.classList.add('hidden');assignMissions();relocateNPCs('arrival');requestAnimationFrame(loop);
}).catch(err=>{loading.textContent='Asset loading failed. Refresh the page.';console.error(err);});
