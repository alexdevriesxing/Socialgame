const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = true;
const creator = document.getElementById('creator');
const nameInput = document.getElementById('nameInput');
const confirmName = document.getElementById('confirmName');
const loading = document.getElementById('loading');

const W = canvas.width;
const SPRITE_FRAME_W = 48;
const SPRITE_FRAME_H = 64;
const PORTRAIT_CELL = 128;
const UI_FONT = '"Trebuchet MS", Arial, sans-serif';
const CHARACTER_IDS = ['player_boy','player_girl',...NPCS.map(n=>n.id),...TEACHERS.map(t=>t.id)];
const CHARACTER_INDEX = Object.fromEntries(CHARACTER_IDS.map((id,index)=>[id,index]));
const CHARACTER_SHEET_W = SPRITE_FRAME_W*9;
const CHARACTER_SHEET_H = SPRITE_FRAME_H*4;
const H = canvas.height;
const VIEW_W = 720;
const PANEL_X = 720;
const PANEL_W = 240;
const COLORS = {
  ink:'#1c1d2b', deep:'#2b2d42', navy:'#324a66', blue:'#4d76a8', sky:'#87c9d8',
  cream:'#f4e9d8', paper:'#fff6e7', pink:'#e88ea4', rose:'#c75b7a', red:'#b8424b',
  gold:'#e5b84b', orange:'#d47a43', green:'#4d8b68', mint:'#83b98b', white:'#f8f7f4',
  shadow:'rgba(9,11,18,.75)', panel:'rgba(28,29,43,.95)'
};

const imageNames = ['keyart','school_maps','portraits','event_atlas','rival_atlas','memory_atlas','character_atlas'];
const images = {};
const artSources = createArtSources();

function loadImage(name) {
  return new Promise((resolve,reject)=>{
    const img = new Image();
    img.onload=()=>{images[name]=img;resolve();};
    img.onerror=reject;
    img.src=artSources[name];
  });
}

function drawCharacter(name, frameColumn, directionRow, x, y, width=64, height=86) {
  const img=images.character_atlas;
  const index=CHARACTER_INDEX[name];
  if(!img||index===undefined)return;
  const sheetX=(index%4)*CHARACTER_SHEET_W;
  const sheetY=Math.floor(index/4)*CHARACTER_SHEET_H;
  ctx.drawImage(img,sheetX+frameColumn*SPRITE_FRAME_W,sheetY+directionRow*SPRITE_FRAME_H,SPRITE_FRAME_W,SPRITE_FRAME_H,x,y,width,height);
}

class SchoolAudio {
  constructor(){ this.enabled=true; this.ctx=null; this.musicTimer=null; this.step=0; }
  ensure(){
    if(!this.enabled) return;
    if(!this.ctx) this.ctx = new (window.AudioContext||window.webkitAudioContext)();
    if(this.ctx.state==='suspended') this.ctx.resume();
  }
  tone(freq=440,dur=.08,type='square',gain=.025){
    if(!this.enabled) return;
    this.ensure();
    const o=this.ctx.createOscillator(),g=this.ctx.createGain();
    o.type=type;o.frequency.value=freq;g.gain.value=gain;
    o.connect(g);g.connect(this.ctx.destination);
    const t=this.ctx.currentTime; g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.start(t);o.stop(t+dur);
  }
  click(){this.tone(620,.045,'square',.02);}
  good(){this.tone(660,.07);setTimeout(()=>this.tone(880,.09),70);}
  message(){this.tone(988,.06,'sine',.02);setTimeout(()=>this.tone(1319,.08,'sine',.018),80);}
  sparkle(){[784,988,1319].forEach((f,i)=>setTimeout(()=>this.tone(f,.12,'sine',.018),i*70));}
  bad(){this.tone(180,.15,'sawtooth',.025);}
  bell(){[784,988,1175].forEach((f,i)=>setTimeout(()=>this.tone(f,.2,'sine',.035),i*120));}
  startMusic(){
    if(this.musicTimer||!this.enabled)return;
    this.ensure();
    const themes={
      spring:[262,330,392,523,392,330,294,349,440,587,440,349],
      summer:[294,370,440,587,494,440,370,330,392,494,659,494],
      autumn:[220,277,330,440,370,330,277,247,294,370,494,370],
      winter:[196,247,294,392,330,294,247,220,262,330,440,330],
      title:[262,330,392,523,659,523,440,392]
    };
    this.musicTimer=setInterval(()=>{
      if(game.mode==='title'||game.mode==='creator'||game.mode==='play'||game.mode==='prom'){
        const key=game.mode==='title'||game.mode==='creator'?'title':seasonKey();
        const seq=themes[key]||themes.spring,f=seq[this.step%seq.length];
        this.tone(f,.16,'triangle',.0075);
        if(this.step%4===0)this.tone(f/2,.24,'sine',.004);
        this.step++;
      }
    },360);
  }
  toggle(){this.enabled=!this.enabled;if(!this.enabled&&this.musicTimer){clearInterval(this.musicTimer);this.musicTimer=null;}else this.startMusic();}
}
const audio = new SchoolAudio();

const keys = new Set();
let pointer = {x:0,y:0,down:false};
let buttons=[];
let lastTime=performance.now();

const defaultPlayer = () => ({
  name:'Akira', gender:'boy', club:'council', socialStatus:'ordinary', x:220, y:350, direction:0, anim:1,
  stats:{charisma:3,intellect:3,fitness:3,talent:3,kindness:3,courage:3,reliability:3},
  energy:100, stress:0, score:0, demerits:0, tardies:0, absences:0, detention:0, teacherTrust:0,
  relationships:Object.fromEntries(NPCS.map(n=>[n.id,0])), accomplishments:[], invitations:[],
  clubXP:0, clubRankIndex:0, clubPrestige:0, clubWins:0, clubAttendance:0,
  routeScenes:[], rivalScenes:[], rivalRespect:Object.fromEntries(NPCS.map(n=>[n.id,0])), rivalHeat:Object.fromEntries(NPCS.map(n=>[n.id,0])),
  campusActivityLog:[], campusMastery:Object.fromEntries(CAMPUS_ACTIVITIES.map(a=>[a.id,0])), campusBest:Object.fromEntries(CAMPUS_ACTIVITIES.map(a=>[a.id,0])), achievements:[], achievementDates:{}, onTimeClasses:0,
  friendshipMoments:[], incidentHistory:[], legacyTags:{}, graduationLegacy:null,
  examScores:[], examBest:0, weekendOutings:[], legacyArchive:[], newGamePlus:0, ngPlusPerk:null,
  electionHistory:[], leadershipWins:0, campaignBest:0, campaignPlatform:null,
  challengeBest:{athletics:0,arts:0,tech:0,council:0}, challengeAttempts:0, monthlyChallengeScores:[],
  phoneInbox:[], messageReplies:[], showcaseScores:[], showcaseWins:0, eventPrestige:0,
  inventory:['Student Handbook','Lunch Card'], monthlyScores:[]
});

const game = {
  mode:'title', previousMode:'title', player:defaultPlayer(), creatorGender:'boy', creatorClub:'council', creatorStatus:'ordinary',
  camera:{x:0,y:0}, year:1, month:1, day:1, time:470, timeAccumulator:0,
  scheduleStatus:{}, dayFlags:{talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false,message:false,showcase:false,activity:false,incident:false},
  missions:[], notifications:[], dialogue:null, overlay:null, currentRoom:'hallway', lastSlot:null, dailyBrief:null,
  npcs:JSON.parse(JSON.stringify(NPCS)), teachers:JSON.parse(JSON.stringify(TEACHERS)),
  paused:false, showControls:true, finished:false, settings:{reducedMotion:false,highContrast:false,largeText:false,gamepad:true}
};


function resetGame(){
  game.player=defaultPlayer();game.year=1;game.month=1;game.day=1;game.time=470;
  game.scheduleStatus={};game.dayFlags={talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false,message:false,showcase:false,activity:false,incident:false};game.dailyBrief=null;
  game.npcs=JSON.parse(JSON.stringify(NPCS));game.teachers=JSON.parse(JSON.stringify(TEACHERS));
  game.finished=false;assignMissions();relocateNPCs('arrival');
}

function gameSnapshot(){
  return {player:game.player,year:game.year,month:game.month,day:game.day,time:game.time,
    scheduleStatus:game.scheduleStatus,dayFlags:game.dayFlags,missions:game.missions,npcs:game.npcs,
    finished:game.finished,dailyBrief:game.dailyBrief,promResult:game.promResult||null,promCompanion:game.promCompanion||null,settings:game.settings};
}
function saveGame(){
  writeSave(localStorage,gameSnapshot());
  notify('Game saved',COLORS.mint);
}
function loadGame(){
  try{
    const d=readSave(localStorage); if(!d)return false;
    Object.assign(game,d);game.mode='play';game.dialogue=null;game.overlay=null;
    game.player.socialStatus ||= 'ordinary'; game.player.teacherTrust ??= 0; game.player.invitations ||= [];
    game.player.clubXP ??= 0; game.player.clubRankIndex ??= 0; game.player.clubPrestige ??= 0;
    game.player.clubWins ??= 0; game.player.clubAttendance ??= 0;
    game.player.routeScenes ||= []; game.player.challengeBest ||= {athletics:0,arts:0,tech:0,council:0};
    game.player.challengeAttempts ??= 0; game.player.monthlyChallengeScores ||= [];
    game.player.phoneInbox ||= []; game.player.messageReplies ||= []; game.player.showcaseScores ||= [];
    game.player.showcaseWins ??= 0; game.player.eventPrestige ??= 0; ensureV10State();
    game.dayFlags ||= {talked:[],hotspots:[],help:0,club:0,ontime:0,event:false,brief:false,challenge:false};
    game.dayFlags.brief ??= false; game.dayFlags.challenge ??= false; game.dayFlags.message ??= false; game.dayFlags.showcase ??= false; game.dayFlags.activity ??= false; game.dayFlags.incident ??= false; game.dailyBrief ||= createDailyBrief(game.year,game.month,game.day,game.player.club);
    relocateNPCs(currentSlot()?.id||'arrival');return true;
  }catch(e){console.warn(e);return false;}
}

function assignMissions(){
  const base=(game.day-1)%DAILY_MISSIONS.length;
  game.missions=[0,1,2].map(i=>({...DAILY_MISSIONS[(base+i)%DAILY_MISSIONS.length],progress:0,done:false}));
}
function progressMission(type, amount=1){
  game.dayFlags[type]=(game.dayFlags[type]||0)+amount;
  for(const m of game.missions){
    if(m.type===type&&!m.done){m.progress=Math.min(m.goal,m.progress+amount);if(m.progress>=m.goal){m.done=true;game.player.score+=m.reward;notify(`Mission complete: ${m.title} +${m.reward}`,COLORS.gold);audio.good();}}
  }
}

function notify(text,color=COLORS.paper){
  game.notifications.push({text,color,life:4});
  if(game.notifications.length>5)game.notifications.shift();
}

function formatTime(min){const h=Math.floor(min/60),m=Math.floor(min%60);return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;}
function currentSlot(){return SCHEDULE.find(s=>game.time>=s.start&&game.time<s.end)||null;}
function nextSlot(){return SCHEDULE.find(s=>s.start>game.time)||null;}
function roomForSlot(slot){return slot?.room==='club'?CLUBS[game.player.club].room:slot?.room;}
function pointInRoom(x,y,roomId){const r=ROOMS[roomId];return !!r&&x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h;}
function getRoomAt(x,y){for(const [id,r] of Object.entries(ROOMS))if(pointInRoom(x,y,id))return id;return 'outside';}

function campaignMonth(){return CAMPAIGN_MONTHS.find(c=>c.year===game.year&&c.month===game.month)||CAMPAIGN_MONTHS[0];}
function seasonKey(){const m=game.month;return m<=3?'spring':m<=6?'summer':m<=9?'autumn':'winter';}
function showMonthIntro(){
  const c=campaignMonth();
  openDialogue({speaker:`Chapter ${c.chapter} • ${c.title}`,scene:c.scene,text:`${c.intro}\n\nMonthly objective: ${c.objective}\n\nFeatured event: ${c.event}`,choices:[{text:'Begin the month.',effects:{stress:-2},result:c.finale,action:()=>setTimeout(showMorningBrief,100)}]});
}

function statusConfig(){return SOCIAL_STATUS_LEVELS[game.player.socialStatus]||SOCIAL_STATUS_LEVELS.ordinary;}
function clubConfig(){return CLUBS[game.player.club]||CLUBS.council;}
function clubThresholds(){
  const modifier=statusConfig().clubThresholdModifier||0;
  return [0,Math.max(20,45+modifier),Math.max(85,125+modifier),Math.max(185,245+modifier)];
}
function currentClubRank(){return clubConfig().ranks[game.player.clubRankIndex]||clubConfig().ranks[0];}
function awardClubXP(amount,reason='Club contribution'){
  const before=game.player.clubRankIndex;
  game.player.clubXP=Math.max(0,game.player.clubXP+amount);
  const thresholds=clubThresholds();
  let rank=0;for(let i=1;i<thresholds.length;i++)if(game.player.clubXP>=thresholds[i])rank=i;
  game.player.clubRankIndex=Math.max(game.player.clubRankIndex,rank);
  game.player.clubPrestige+=Math.max(1,Math.round(amount/4));
  if(reason)game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:reason});
  if(game.player.clubRankIndex>before){
    game.player.score+=18+game.player.clubRankIndex*6;
    notify(`${clubConfig().name}: promoted to ${currentClubRank()}!`,COLORS.gold);audio.good();
  }
}
function initializeSocialStatus(){
  const status=statusConfig();
  game.player.score=status.startScore;
  game.player.teacherTrust=status.teacherTrust;
  for(const id of Object.keys(game.player.relationships))game.player.relationships[id]=status.relationshipBase;
  if(game.player.socialStatus==='established'){
    game.player.invitations.push('Welcome Committee Breakfast');
    game.player.stats.charisma+=1;game.player.stats.reliability+=1;
  }else if(game.player.socialStatus==='outsider'){
    game.player.stats.courage+=1;game.player.stress=8;
  }
}
function statusScore(value){
  const cfg=statusConfig();
  return Math.round(value*(value>=0?cfg.positiveScoreMultiplier:cfg.negativeScoreMultiplier));
}

function applyEffects(effects={}, source=''){ 
  for(const [k,v] of Object.entries(effects)){
    if(k==='score') game.player.score+=statusScore(v);
    else if(k==='stress') game.player.stress=clamp(game.player.stress+v,0,100);
    else if(k==='energy') game.player.energy=clamp(game.player.energy+v,0,100);
    else if(k==='demerits') game.player.demerits=Math.max(0,game.player.demerits+v);
    else if(k==='help') progressMission('help',v);
    else if(game.player.stats[k]!==undefined) game.player.stats[k]=clamp(game.player.stats[k]+v,0,20);
  }
  if(source) game.player.accomplishments.push({day:game.day,month:game.month,year:game.year,text:source});
  checkAchievements();
}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
function choiceLabel(i){return ['1','2','3','4'][i]||'?';}

function openDialogue({speaker='Narrator',portrait=null,scene=null,atlas='event_atlas',text,choices=[],onClose=null}){
  game.dialogue={speaker,portrait,scene,atlas,text,choices,onClose,reveal:0,selected:0,opened:performance.now()};
  audio.click();
}
function closeDialogue(choiceIndex=0){
  const d=game.dialogue;if(!d)return;
  const choice=d.choices?.[choiceIndex];
  if(choice){
    if(choice.effects)applyEffects(choice.effects,choice.achievement||'');
    if(choice.relationship){
      const [id,delta]=choice.relationship;game.player.relationships[id]=clamp((game.player.relationships[id]||0)+delta,-10,20);
    }
    const action=choice.action;
    const result=choice.result;
    const after=d.onClose; game.dialogue=null;
    if(result) setTimeout(()=>openDialogue({speaker:choice.resultSpeaker||d.speaker,portrait:d.portrait,scene:d.scene,atlas:d.atlas,text:result,choices:[{text:'Continue',action:()=>{if(action)action();if(after)after();}}]}),30);
    else {if(action)action();if(after)after();}
  }else{const after=d.onClose;game.dialogue=null;if(after)after();}
}


function relationshipTier(value){
  if(value>=15)return 'Confidant';
  if(value>=9)return 'Close Friend';
  if(value>=4)return 'Friend';
  if(value>=1)return 'Acquaintance';
  if(value<0)return 'Strained';
  return 'New Face';
}
function completedRouteCount(npcId){return game.player.routeScenes.filter(id=>id.startsWith(`${npcId}-`)).length;}
function nextRouteScene(npc){
  const rel=game.player.relationships[npc.id]||0;
  return (RELATIONSHIP_ROUTES[npc.id]||[]).find(route=>rel>=route.threshold&&!game.player.routeScenes.includes(route.id))||null;
}
function triggerRouteScene(npc,route){
  const choices=route.choices.map(routeChoice=>({
    text:routeChoice.text,
    effects:routeChoice.effects,
    relationship:[npc.id,routeChoice.bond||2],
    achievement:`Friendship route: ${npc.name} — ${route.title}`,
    result:routeChoice.result,
    action:()=>{
      if(!game.player.routeScenes.includes(route.id))game.player.routeScenes.push(route.id);
      game.player.score+=statusScore(6+completedRouteCount(npc.id)*2);
      notify(`${npc.name} route advanced: ${route.title}`,COLORS.gold);
      audio.good();
    }
  }));
  openDialogue({speaker:`${npc.name} • ${route.title}`,portrait:npc.portrait,scene:route.scene,text:route.text,choices});
}
function dailyBrief(){
  const id=`${game.year}-${game.month}-${game.day}`;
  if(!game.dailyBrief||game.dailyBrief.id!==id)game.dailyBrief=createDailyBrief(game.year,game.month,game.day,game.player.club);
  return game.dailyBrief;
}
function showMorningBrief(){
  const brief=dailyBrief();
  if(game.dayFlags.brief)return;
  game.dayFlags.brief=true;
  const featured=NPCS[brief.featuredIndex%NPCS.length];
  const effects={score:2,energy:3};
  if(game.day%5===0)effects[brief.bonusStat]=1;
  openDialogue({
    speaker:`Morning Broadcast • ${brief.weather}`,
    scene:(game.month+game.day)%8,
    text:`${brief.weatherText}\n\nCampus notice: ${brief.notice}\n\nToday’s social pressure: ${brief.pressure}\n\nStudent spotlight: ${featured.name} of ${featured.clique}.`,
    choices:[{text:'Start the school day.',effects,result:`You note the announcement and step into the day with a clearer plan.${game.day%5===0?` ${brief.bonusStat} improves from the weekly momentum bonus.`:''}`}]
  });
}
function startClubChallenge(source='Club practice'){
  if(game.dayFlags.challenge&&source!=='Monthly showcase'){
    notify('Today’s scored club challenge is already complete.',COLORS.sky);return;
  }
  const cfg=CLUB_CHALLENGES[game.player.club];
  const stat=game.player.stats[cfg.stat]||0;
  game.overlay={
    type:'challenge',title:cfg.title,source,cfg,phase:'active',round:0,hits:[],elapsed:0,
    targetCenter:challengeTarget(0),targetWidth:clamp(.12+stat*.004,.12,.2),position:.05,flash:0
  };
}
function challengeTarget(round){
  const seed=game.year*37+game.month*29+game.day*17+round*23+game.player.club.length*11;
  return .25+(seed%51)/100;
}
function updateChallenge(dt){
  const o=game.overlay;if(o?.type!=='challenge'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,(o.flash||0)-dt);
  const speed=2.35+o.round*.42+game.year*.12;
  o.position=.5+.47*Math.sin(o.elapsed*speed+o.round*.85);
}
function challengeHit(){
  const o=game.overlay;if(o?.type!=='challenge'||o.phase!=='active')return;
  const distance=Math.abs(o.position-o.targetCenter);
  const inside=distance<=o.targetWidth/2;
  const accuracy=Math.round(clamp(100-distance*175+(inside?12:0),0,100));
  o.hits.push(accuracy);o.flash=.28;audio.tone(inside?840:260,.1,inside?'sine':'sawtooth',.03);
  if(o.hits.length>=3){finishClubChallenge();return;}
  o.round++;o.targetCenter=challengeTarget(o.round);o.elapsed=.2+o.round*.17;
}
function finishClubChallenge(){
  const o=game.overlay,cfg=o.cfg;
  const average=Math.round(o.hits.reduce((sum,value)=>sum+value,0)/o.hits.length);
  let grade='Practice Complete',xp=5,score=2,statGain=0,color=COLORS.sky;
  if(average>=88){grade='Summit Performance';xp=28;score=20;statGain=2;color=COLORS.gold;}
  else if(average>=72){grade='Excellent';xp=20;score=13;statGain=1;color=COLORS.mint;}
  else if(average>=52){grade='Solid';xp=13;score=8;statGain=1;color=COLORS.sky;}
  else {game.player.stress=clamp(game.player.stress+2,0,100);}
  awardClubXP(xp,`${cfg.title}: ${grade}`);
  applyEffects({score,[cfg.stat]:statGain});
  game.player.challengeAttempts++;
  game.player.challengeBest[game.player.club]=Math.max(game.player.challengeBest[game.player.club]||0,average);
  game.player.monthlyChallengeScores.push({year:game.year,month:game.month,day:game.day,club:game.player.club,score:average});
  game.dayFlags.challenge=true;progressMission('club',1);
  o.phase='result';o.average=average;o.grade=grade;o.resultColor=color;
}
function drawChallengeOverlay(o){
  overlayBase(`${o.title} • ${o.source}`);
  const cfg=o.cfg;
  centered(cfg.instruction,103,15,COLORS.cream,`bold 15px ${UI_FONT}`);
  panel(105,142,750,195,COLORS.deep,cfg.color,4);
  if(o.phase==='active'){
    const x=155,y=228,w=650,h=42;
    text(`ROUND ${o.hits.length+1}/3 • ${cfg.labels[o.round]}`,155,190,18,cfg.color,true);
    ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);
    const targetX=x+o.targetCenter*w,targetW=o.targetWidth*w;
    ctx.fillStyle='rgba(229,184,75,.38)';ctx.fillRect(targetX-targetW/2,y,targetW,h);
    ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);
    const markerX=x+o.position*w;
    ctx.fillStyle=o.flash>0?COLORS.white:cfg.color;ctx.fillRect(markerX-5,y-15,10,h+30);
    text('Too early',x,y+72,12,COLORS.cream,true);text('Perfect timing',x+w/2-42,y+72,12,COLORS.gold,true);text('Too late',x+w-48,y+72,12,COLORS.cream,true);
    o.hits.forEach((hit,i)=>text(`${i+1}: ${hit}%`,225+i*170,318,14,hit>=72?COLORS.mint:COLORS.paper,true));
    addButton(330,380,300,56,'HIT • E / SPACE',challengeHit,true,false,cfg.color);
  }else{
    centered(o.grade,192,30,o.resultColor,'bold 30px Trebuchet MS');
    centered(`${o.average}% average accuracy`,236,20,COLORS.paper,'bold 20px Trebuchet MS');
    wrapped(`Best ${clubConfig().name} score: ${game.player.challengeBest[game.player.club]}%. Strong challenge results improve monthly competition outcomes and club prestige.`,220,278,520,15,COLORS.cream,4);
    addButton(330,390,300,44,'RETURN TO SCHOOL',()=>game.overlay=null);
  }
}
function drawRelationshipsOverlay(o){
  overlayBase(o.title);
  text('FRIENDSHIP ROUTES',86,103,17,COLORS.sky,true);
  text(`${game.player.routeScenes.length}/30 route chapters completed`,650,103,13,COLORS.gold,true);
  NPCS.forEach((npc,index)=>{
    const col=index%2,row=Math.floor(index/2),x=82+col*414,y=125+row*62;
    const value=game.player.relationships[npc.id]||0,tier=relationshipTier(value),done=completedRouteCount(npc.id);
    ctx.fillStyle=index%2?'rgba(255,255,255,.035)':'rgba(255,255,255,.055)';ctx.fillRect(x,y,390,52);
    const sx=(npc.portrait%4)*PORTRAIT_CELL,sy=Math.floor(npc.portrait/4)*PORTRAIT_CELL;
    ctx.drawImage(images.portraits,sx,sy,PORTRAIT_CELL,PORTRAIT_CELL,x+4,y+4,44,44);
    text(npc.name,x+58,y+20,14,COLORS.paper,true);
    text(`${tier} • Bond ${value}`,x+58,y+40,12,value>=9?COLORS.gold:COLORS.sky,true);
    text(`${done}/3`,x+340,y+31,15,done===3?COLORS.mint:COLORS.cream,true);
  });
  addButton(110,466,135,32,'PHONE',openPhone);
  addButton(255,466,135,32,'ROUTE LOG',()=>game.overlay={type:'memories',title:'Memory Gallery',page:0});
  addButton(400,466,135,32,'MOMENTS',openMomentGallery);
  addButton(545,466,135,32,'YEARBOOK',openYearbook);
  addButton(690,466,135,32,'CLOSE',()=>game.overlay=null);
}
