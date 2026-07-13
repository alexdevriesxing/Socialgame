window.SakuraCrest=window.SakuraCrest||{};
Object.assign(window.SakuraCrest,(()=>{
  const DAILY_WEATHER_ICONS={clear:'☀',cloudy:'☁',rain:'☂',wind:'≈',snow:'❄'};
  function seeded(seed){let x=Math.sin(seed*12.9898+78.233)*43758.5453;return x-Math.floor(x)}
  function ensureLivingState(){
    state.routeScenes=state.routeScenes||{}; state.challengeBest=state.challengeBest||{}; state.challengeAttempts=state.challengeAttempts||{};
    state.monthlyChallengeScores=state.monthlyChallengeScores||{}; state.dayFlags=state.dayFlags||{};
    state.dailyBrief=state.dailyBrief||makeDailyBrief(state.year,state.month,state.day);
  }
  function bondTier(value){return value>=15?'Confidant':value>=9?'Close Friend':value>=4?'Friend':value>=1?'Acquaintance':'New Face'}
  function nextRouteScene(npcId){
    ensureLivingState(); const bond=state.relationships[npcId]||0; const seen=state.routeScenes[npcId]||0;
    return (FRIENDSHIP_ROUTES[npcId]||[]).find(s=>s.chapter===seen+1&&bond>=s.bond)||null;
  }
  function presentRouteScene(npc){
    const scene=nextRouteScene(npc.id); if(!scene)return false;
    startDialogue(scene.title,scene.lines.map((line,index)=>({speaker:index%2?npc.name:state.name,text:line,portrait:index%2?npc.id:null})),scene.choices.map(choice=>({
      text:choice.text, action:()=>{
        state.routeScenes[npc.id]=scene.chapter; state.relationships[npc.id]=(state.relationships[npc.id]||0)+choice.bond;
        applyEffects(choice.effects||{}); addAccomplishment(`${npc.name}: ${scene.title}`); saveSilently();
        startDialogue(scene.title,[{speaker:npc.name,text:choice.result,portrait:npc.id}]);
      }
    })));
    return true;
  }
  function makeDailyBrief(year,month,day){
    const key=year*10000+month*100+day; const season=seasonForMonth(month);
    const weatherPools={spring:['clear','cloudy','rain','wind'],summer:['clear','clear','cloudy','rain'],autumn:['clear','cloudy','wind','rain'],winter:['cloudy','clear','snow','wind']};
    const weather=weatherPools[season][Math.floor(seeded(key)*weatherPools[season].length)];
    const notice=DAILY_NOTICES[Math.floor(seeded(key+11)*DAILY_NOTICES.length)];
    const pressure=DAILY_PRESSURES[Math.floor(seeded(key+29)*DAILY_PRESSURES.length)];
    const featured=NPCS[Math.floor(seeded(key+47)*NPCS.length)];
    return {weather,icon:DAILY_WEATHER_ICONS[weather],weatherText:WEATHER_TEXT[weather],notice,pressure,featured:featured.id,featuredName:featured.name,modifier:Math.round((seeded(key+71)-.5)*4)};
  }
  function showMorningBrief(){
    ensureLivingState(); if(state.dayFlags.brief)return;
    state.dayFlags.brief=true; const b=state.dailyBrief;
    startDialogue('Morning Broadcast',[
      {speaker:'Campus Radio',text:`${b.icon} ${b.weatherText}`},
      {speaker:'Campus Radio',text:b.notice},
      {speaker:'Social Pulse',text:b.pressure},
      {speaker:'Today’s Face',text:`Keep an eye out for ${b.featuredName}. A thoughtful conversation may matter more than a flashy stunt.`}
    ],[{text:'Step into the day',action:()=>{if(b.modifier)state.score=Math.max(0,state.score+b.modifier);saveSilently()}}]);
  }
  function openFriendshipJournal(){ensureLivingState(); state.overlay='friends'; state.scene='overlay'}
  function drawFriendshipJournal(){
    panel(64,44,832,452,20); text('FRIENDSHIP JOURNAL',100,82,28,COLORS.gold,true);
    text('JOURNEYS ARE UNLOCKED THROUGH GENUINE CONVERSATIONS',100,109,12,COLORS.muted,true);
    const sorted=[...NPCS].sort((a,b)=>(state.relationships[b.id]||0)-(state.relationships[a.id]||0));
    sorted.forEach((npc,i)=>{const col=i<5?0:1,row=i%5,x=100+col*402,y=145+row*60,bond=state.relationships[npc.id]||0,seen=state.routeScenes[npc.id]||0,next=(FRIENDSHIP_ROUTES[npc.id]||[])[seen];
      drawPortrait(npc.id,x,y-4,46,46);text(npc.name,x+58,y+12,16,COLORS.paper,true);text(`${bondTier(bond)} • Bond ${bond}`,x+58,y+33,12,COLORS.cream);
      text(next?`Next: ${next.title} (${next.bond})`:'Route complete',x+220,y+29,10,next&&bond>=next.bond?COLORS.gold:COLORS.muted);
    });
    text('Press J or Escape to close',352,474,13,COLORS.muted,true);
  }
  function startClubChallenge(){
    ensureLivingState(); const club=CLUBS.find(c=>c.id===state.club); if(!club){toast('Join a club first.');return}
    if(state.dayFlags.challenge){toast('You already practiced today.');return}
    const def=CLUB_CHALLENGES[club.id]; state.challenge={club:club.id,title:def.title,description:def.description,round:0,total:def.rounds,score:0,needle:.08,direction:1,target:.25+.5*seeded(state.year*1000+state.month*50+state.day),width:.16,active:true,feedback:'Press E / Space in the gold zone'};
    state.scene='challenge'; state.dayFlags.challenge=true; state.challengeAttempts[club.id]=(state.challengeAttempts[club.id]||0)+1;
  }
  function updateChallenge(dt){if(!state.challenge?.active)return;const c=state.challenge;c.needle+=c.direction*dt*.58;if(c.needle>=.96){c.needle=.96;c.direction=-1}else if(c.needle<=.04){c.needle=.04;c.direction=1}}
  function challengeHit(){
    const c=state.challenge;if(!c?.active)return;const distance=Math.abs(c.needle-c.target);let points=0,label='Miss';
    if(distance<c.width*.22){points=100;label='Perfect!'}else if(distance<c.width*.5){points=75;label='Great!'}else if(distance<c.width){points=45;label='Good'}
    c.score+=points;c.feedback=`${label} +${points}`;c.round++;
    if(c.round>=c.total){finishChallenge();return}
    c.target=.2+.6*seeded(state.year*3000+state.month*200+state.day*10+c.round);c.width=Math.max(.09,.16-c.round*.015);
  }
  function finishChallenge(){
    const c=state.challenge,club=CLUBS.find(x=>x.id===c.club),def=CLUB_CHALLENGES[c.club],max=c.total*100,ratio=c.score/max,grade=ratio>=.88?'S':ratio>=.7?'A':ratio>=.5?'B':'C';
    c.active=false;c.grade=grade;state.challengeBest[c.club]=Math.max(state.challengeBest[c.club]||0,c.score);state.monthlyChallengeScores[c.club]=Math.max(state.monthlyChallengeScores[c.club]||0,c.score);
    const reward=ratio>=.88?{score:12,clubXp:16}:ratio>=.7?{score:8,clubXp:12}:ratio>=.5?{score:5,clubXp:8}:{score:2,clubXp:4};
    applyEffects({...reward,[def.stat]:Math.max(1,Math.round(ratio*3))});progressMission('club',1);saveSilently();
    c.feedback=`Grade ${grade} • ${c.score}/${max}`;
  }
  function drawChallenge(){
    const c=state.challenge;fillGradient(0,0,W,H,'#17213c','#44365f');drawSeasonMotif();panel(95,70,770,400,24);
    text('CLUB CHALLENGE',W/2,111,15,COLORS.gold,true,'center');text(c.title,W/2,150,32,COLORS.paper,true,'center');wrapped(c.description,185,178,590,15,COLORS.cream,2);
    const x=165,y=260,w=630,h=42;roundRect(x,y,w,h,18,'#0d1427','#6581a3',2);roundRect(x+c.target*w-c.width*w/2,y+4,c.width*w,h-8,14,COLORS.gold);
    ctx.fillStyle=COLORS.paper;ctx.beginPath();ctx.moveTo(x+c.needle*w,y-16);ctx.lineTo(x+c.needle*w-10,y+2);ctx.lineTo(x+c.needle*w+10,y+2);ctx.closePath();ctx.fill();
    text(c.feedback,W/2,337,21,c.active?COLORS.paper:COLORS.gold,true,'center');text(`Round ${Math.min(c.round+1,c.total)} / ${c.total}`,W/2,372,14,COLORS.muted,true,'center');
    if(c.active)text('PRESS E OR SPACE',W/2,420,19,COLORS.gold,true,'center');else text('PRESS E OR SPACE TO RETURN',W/2,420,17,COLORS.cream,true,'center');
  }
  function drawAmbientWeather(){
    ensureLivingState();const b=state.dailyBrief,t=performance.now()/1000;ctx.save();
    if(b.weather==='rain'){ctx.strokeStyle='rgba(175,210,255,.48)';ctx.lineWidth=2;for(let i=0;i<38;i++){const x=(i*83+t*180)%W,y=(i*47+t*270)%H;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x-8,y+18);ctx.stroke()}}
    else if(b.weather==='snow'){ctx.fillStyle='rgba(255,255,255,.8)';for(let i=0;i<34;i++){const x=(i*97+Math.sin(t+i)*28)%W,y=(i*61+t*28)%H;ctx.beginPath();ctx.arc(x,y,2+(i%3),0,Math.PI*2);ctx.fill()}}
    else if(seasonForMonth(state.month)==='spring'){ctx.fillStyle='rgba(255,190,214,.65)';for(let i=0;i<18;i++){const x=(i*131+t*24)%W,y=(i*79+t*17)%H;ctx.fillRect(x,y,5,3)}}
    else if(seasonForMonth(state.month)==='autumn'){ctx.fillStyle='rgba(224,139,57,.58)';for(let i=0;i<16;i++){const x=(i*149+t*35)%W,y=(i*67+t*22)%H;ctx.fillRect(x,y,6,4)}}ctx.restore();
  }
  return {ensureLivingState,bondTier,nextRouteScene,presentRouteScene,makeDailyBrief,showMorningBrief,openFriendshipJournal,drawFriendshipJournal,startClubChallenge,updateChallenge,challengeHit,finishChallenge,drawChallenge,drawAmbientWeather};
})());
