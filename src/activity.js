// Active School v1.3 — replayable classroom and club activities with accessible assists.
const ACTIVE_MECHANICS = ['timing','sequence','balance','decision'];
const ACTIVE_SYMBOLS = ['A','B','C','D'];
const ACTIVE_SUBJECTS = {
  math:{id:'math',name:'Mathematics',stat:'intellect',color:'#5e8cc2',mechanic:'decision',icon:'∑',summary:'Solve short logic and number-pattern challenges.',questions:[
    {prompt:'Which number continues 3, 6, 12, 24?',choices:['30','36','48'],correct:2},
    {prompt:'A club has 28 members split into 4 equal teams. Members per team?',choices:['6','7','8'],correct:1},
    {prompt:'Which fraction equals 0.75?',choices:['1/2','3/4','4/5'],correct:1},
    {prompt:'If x + 9 = 17, what is x?',choices:['6','8','26'],correct:1}
  ]},
  literature:{id:'literature',name:'Literature',stat:'talent',color:'#c875a0',mechanic:'sequence',icon:'文',summary:'Recall the shape of a scene and its emotional beats.',sequenceLabels:['HOOK','VOICE','TURN','THEME']},
  science:{id:'science',name:'Science',stat:'intellect',color:'#59a98f',mechanic:'timing',icon:'⚗',summary:'Capture observations inside the stable measurement window.',timingLabels:['CALIBRATE','OBSERVE','MEASURE','VERIFY']},
  history:{id:'history',name:'History',stat:'intellect',color:'#b98b55',mechanic:'sequence',icon:'⌛',summary:'Place evidence and consequences into a reliable timeline.',sequenceLabels:['SOURCE','CONTEXT','EVENT','LEGACY']},
  languages:{id:'languages',name:'Languages',stat:'charisma',color:'#8f79c6',mechanic:'decision',icon:'語',summary:'Choose clear, respectful responses in everyday situations.',questions:[
    {prompt:'A classmate introduces themselves. Best reply?',choices:['Ignore them','Greet them and repeat their name','Correct their accent'],correct:1},
    {prompt:'You do not understand a phrase. Best response?',choices:['Ask for clarification','Pretend you understood','Change the subject'],correct:0},
    {prompt:'A formal email should begin with…',choices:['A respectful greeting','A meme','No greeting'],correct:0},
    {prompt:'Good listening means…',choices:['Planning your reply only','Interrupting quickly','Checking what the speaker meant'],correct:2}
  ]},
  pe:{id:'pe',name:'Physical Education',stat:'fitness',color:'#d75b50',mechanic:'balance',icon:'⚑',summary:'Hold form through a controlled movement circuit.',balanceLabel:'FORM ZONE'},
  art:{id:'art',name:'Visual Art',stat:'talent',color:'#e88ea4',mechanic:'balance',icon:'✦',summary:'Balance contrast, focus and negative space.',balanceLabel:'COMPOSITION'},
  music:{id:'music',name:'Music',stat:'talent',color:'#d5a84f',mechanic:'timing',icon:'♫',summary:'Land four cues in tempo without rushing.',timingLabels:['COUNT-IN','VERSE','CHORUS','FINALE']},
  computer:{id:'computer',name:'Computer Studies',stat:'intellect',color:'#55a5b8',mechanic:'decision',icon:'</>',summary:'Debug small systems by choosing the safest fix.',questions:[
    {prompt:'A button does nothing. Check first?',choices:['Event handler','Screen brightness','Font color'],correct:0},
    {prompt:'A list has duplicates. Best first step?',choices:['Delete random rows','Inspect the data source','Hide the list'],correct:1},
    {prompt:'A password appears in source code. Do what?',choices:['Commit it','Move it to a secret store','Rename the variable'],correct:1},
    {prompt:'A change breaks the build. Best response?',choices:['Ignore tests','Revert and isolate the cause','Delete the repository'],correct:1}
  ]}
};
const ACTIVE_CLASS_SLOT_MAP = {math:'math',literature:'literature',pe:'pe',social:'history'};
const ACTIVE_CLUBS = {
  athletics:[
    {id:'athletics-start',name:'Explosive Start',mechanic:'timing',color:'#d75b50',summary:'React to the starter without jumping early.',labels:['SET','DRIVE','STRIDE','FINISH']},
    {id:'athletics-tactics',name:'Match Tactics',mechanic:'decision',color:'#d75b50',summary:'Read the field and choose the disciplined team option.',questions:[
      {prompt:'A teammate is double-covered. Best play?',choices:['Force the pass','Reset and switch sides','Stop moving'],correct:1},
      {prompt:'Your team leads late. Best priority?',choices:['Showboat','Protect shape and possession','Argue with officials'],correct:1},
      {prompt:'A teammate misses. Captain response?',choices:['Blame them','Give one clear adjustment','Ignore them'],correct:1},
      {prompt:'Opponent presses high. Best response?',choices:['Use width and quick support','All crowd the ball','Kick blindly'],correct:0}
    ]},
    {id:'athletics-relay',name:'Relay Exchange',mechanic:'sequence',color:'#d75b50',summary:'Memorize the exchange calls and execute them in order.',labels:['CALL','MARK','HAND','RUN']},
    {id:'athletics-captain',name:'Captaincy Drill',mechanic:'balance',color:'#d75b50',summary:'Keep effort, safety and morale in balance.',balanceLabel:'TEAM RHYTHM'}
  ],
  arts:[
    {id:'arts-composition',name:'Composition Board',mechanic:'balance',color:'#c875a0',summary:'Hold the focal point inside a balanced frame.',balanceLabel:'VISUAL BALANCE'},
    {id:'arts-rehearsal',name:'Rehearsal Cues',mechanic:'sequence',color:'#c875a0',summary:'Remember entrances, lighting and scene changes.',labels:['LIGHT','ENTER','TURN','BOW']},
    {id:'arts-performance',name:'Live Performance',mechanic:'timing',color:'#c875a0',summary:'Hit the dramatic beats without rushing the scene.',labels:['BREATH','LINE','PAUSE','FINALE']},
    {id:'arts-exhibition',name:'Exhibition Curation',mechanic:'decision',color:'#c875a0',summary:'Build a fair, coherent student exhibition.',questions:[
      {prompt:'Two strong works use the same space. Best solution?',choices:['Remove one secretly','Discuss layout with both artists','Choose your friend'],correct:1},
      {prompt:'A new artist is nervous. Best support?',choices:['Hide their work','Offer a clear placement and label','Rewrite their statement'],correct:1},
      {prompt:'The room feels visually crowded. What helps?',choices:['Add more signs','Create breathing space','Use every wall'],correct:1},
      {prompt:'A label contains an error. Best response?',choices:['Correct it before opening','Ignore it','Blame the artist publicly'],correct:0}
    ]}
  ],
  tech:[
    {id:'tech-coding',name:'Logic Sprint',mechanic:'decision',color:'#55a5b8',summary:'Choose the cleanest solution under a short deadline.',questions:[
      {prompt:'The same calculation appears four times. Best improvement?',choices:['Copy it again','Extract a reusable function','Rename the file'],correct:1},
      {prompt:'A loop never ends. Inspect first?',choices:['Exit condition','Button color','Image size'],correct:0},
      {prompt:'Tests fail after one change. Best move?',choices:['Check the changed behavior','Delete tests','Add random delays'],correct:0},
      {prompt:'A teammate cannot understand your code. Improve…',choices:['Naming and comments','Screen resolution','Keyboard volume'],correct:0}
    ]},
    {id:'tech-robotics',name:'Robot Calibration',mechanic:'timing',color:'#55a5b8',summary:'Stop each motor inside its safe calibration band.',labels:['SENSOR','MOTOR','GRIP','PATH']},
    {id:'tech-debug',name:'Debug Trace',mechanic:'sequence',color:'#55a5b8',summary:'Replay the failure path in the correct order.',labels:['INPUT','STATE','ERROR','FIX']},
    {id:'tech-innovation',name:'Innovation Budget',mechanic:'balance',color:'#55a5b8',summary:'Balance ambition, reliability and available parts.',balanceLabel:'PROJECT SCOPE'}
  ],
  council:[
    {id:'council-debate',name:'Debate Floor',mechanic:'timing',color:'#e3b64d',summary:'Speak when the floor is open and leave room for others.',labels:['LISTEN','FRAME','EVIDENCE','CLOSE']},
    {id:'council-budget',name:'Budget Hearing',mechanic:'balance',color:'#e3b64d',summary:'Keep impact, fairness and reserves in balance.',balanceLabel:'FAIR BUDGET'},
    {id:'council-petition',name:'Petition Review',mechanic:'sequence',color:'#e3b64d',summary:'Check need, evidence, support and implementation.',labels:['NEED','EVIDENCE','SUPPORT','PLAN']},
    {id:'council-mediation',name:'Peer Mediation',mechanic:'decision',color:'#e3b64d',summary:'De-escalate conflict without choosing favorites.',questions:[
      {prompt:'Two students interrupt each other. First step?',choices:['Pick a winner','Set equal speaking turns','End the meeting'],correct:1},
      {prompt:'One student feels unheard. Best response?',choices:['Summarize their concern','Tell them to calm down','Change topic'],correct:0},
      {prompt:'Facts are disputed. Best move?',choices:['Guess','Separate facts from interpretations','Vote immediately'],correct:1},
      {prompt:'A solution is agreed. Finish by…',choices:['Documenting the next steps','Leaving it vague','Announcing blame'],correct:0}
    ]}
  ]
};
const ACTIVE_SEASONAL_EVENTS = {
  spring:{athletics:'Spring Relay Cup',arts:'Sakura Stage Festival',tech:'Spring Robotics Trial',council:'Welcome Assembly Forum'},
  summer:{athletics:'Crest Summer Games',arts:'Open-Air Arts Night',tech:'Innovation Fair',council:'Student Budget Summit'},
  autumn:{athletics:'Autumn Championship',arts:'Cultural Festival Showcase',tech:'Regional Logic Cup',council:'School Election Debate'},
  winter:{athletics:'Winter Team Challenge',arts:'Year-End Gala',tech:'National Student Tech Cup',council:'Legacy Summit'}
};
const ACTIVE_VISUAL_LAYOUT = {
  titleHeader:{x:54,y:34,w:852,h:112},
  titleMenu:{x:566,y:174,w:330,h:304},
  titleStory:{x:64,y:174,w:470,h:304},
  hud:{x:720,y:0,w:240,h:540},
  hudButtons:{x:736,y:402,w:208,h:104}
};
window.SAKURA_VISUAL_LAYOUT = ACTIVE_VISUAL_LAYOUT;

function activeRectOverlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;}
function validateActiveVisualLayout(){
  const issues=[];
  if(activeRectOverlap(ACTIVE_VISUAL_LAYOUT.titleHeader,ACTIVE_VISUAL_LAYOUT.titleMenu))issues.push('Title header overlaps menu card.');
  if(activeRectOverlap(ACTIVE_VISUAL_LAYOUT.titleHeader,ACTIVE_VISUAL_LAYOUT.titleStory))issues.push('Title header overlaps story card.');
  if(activeRectOverlap(ACTIVE_VISUAL_LAYOUT.titleMenu,ACTIVE_VISUAL_LAYOUT.titleStory))issues.push('Title menu overlaps story card.');
  for(const [name,rect] of Object.entries(ACTIVE_VISUAL_LAYOUT)){
    if(rect.x<0||rect.y<0||rect.x+rect.w>W||rect.y+rect.h>H)issues.push(`${name} escapes the 960×540 canvas.`);
  }
  return {valid:issues.length===0,issues};
}
function activeClubCatalog(clubId=game.player.club){return ACTIVE_CLUBS[clubId]||ACTIVE_CLUBS.council;}
function activeAllClubActivities(){return Object.values(ACTIVE_CLUBS).flat();}
function activeSeasonalName(clubId=game.player.club){return ACTIVE_SEASONAL_EVENTS[seasonKey()]?.[clubId]||'Seasonal School Competition';}
function activeSeasonalKey(clubId=game.player.club){return `${game.year}-${seasonKey()}-${clubId}`;}
function validateActiveSchoolContent(){
  const issues=[];
  const subjects=Object.values(ACTIVE_SUBJECTS);
  if(subjects.length!==9)issues.push(`Expected 9 subjects, found ${subjects.length}.`);
  for(const [clubId,activities] of Object.entries(ACTIVE_CLUBS)){
    if(activities.length<4)issues.push(`${clubId} has fewer than four activities.`);
    const mechanics=new Set(activities.map(activity=>activity.mechanic));
    for(const mechanic of ACTIVE_MECHANICS)if(!mechanics.has(mechanic))issues.push(`${clubId} is missing ${mechanic}.`);
  }
  const ids=[...subjects.map(item=>item.id),...activeAllClubActivities().map(item=>item.id)];
  if(new Set(ids).size!==ids.length)issues.push('Activity IDs are not unique.');
  return {valid:issues.length===0,issues,subjects:subjects.length,clubActivities:activeAllClubActivities().length,seasonalEvents:Object.values(ACTIVE_SEASONAL_EVENTS).reduce((sum,row)=>sum+Object.keys(row).length,0)};
}
function ensureActiveSchoolState(){
  game.player.subjectMastery ||= Object.fromEntries(Object.keys(ACTIVE_SUBJECTS).map(id=>[id,0]));
  game.player.clubActivityMastery ||= Object.fromEntries(activeAllClubActivities().map(item=>[item.id,0]));
  game.player.activityBest ||= Object.fromEntries([...Object.keys(ACTIVE_SUBJECTS),...activeAllClubActivities().map(item=>item.id)].map(id=>[id,0]));
  game.player.activityHistory ||= [];
  game.player.seasonalCompetitionWins ||= [];
  game.player.activityAssist ??= true;
  game.dayFlags ||= {};
  game.dayFlags.activeLessons ||= [];
  return game.player;
}
function activeConfigById(id){return ACTIVE_SUBJECTS[id]||activeAllClubActivities().find(item=>item.id===id)||null;}
function openActivityLab(page='academics'){ensureActiveSchoolState();game.overlay={type:'activityLab',title:'Active Learning Lab',page};}
function activeActivityAllowed(practice=false){
  if(practice)return true;
  const slot=currentSlot();
  return !slot||slot.optional||slot.id==='club'||Boolean(ACTIVE_CLASS_SLOT_MAP[slot.id]);
}
function activeSeed(config){return game.year*100003+game.month*1013+game.day*97+game.time*7+config.id.split('').reduce((sum,ch)=>sum+ch.charCodeAt(0),0);}
function activeSequence(seed,length=4){return Array.from({length},(_,index)=>ACTIVE_SYMBOLS[Math.abs(seed+index*19+index*index*11)%ACTIVE_SYMBOLS.length]);}
function startActiveSchoolActivity(id,{practice=false,classroom=false,competition=false}={}){
  ensureActiveSchoolState();
  const config=activeConfigById(id);if(!config)return false;
  if(!activeActivityAllowed(practice||classroom)){notify('Active sessions are available during class, breaks, lunch, club and Free Period.',COLORS.sky);return false;}
  const isClub=activeAllClubActivities().some(item=>item.id===id);
  const assist=Boolean(game.player.activityAssist);
  const seed=activeSeed(config);
  const overlay={type:'activeGame',title:competition?activeSeasonalName():config.name,config,id,isClub,practice,classroom,competition,assist,phase:'intro',mechanic:config.mechanic,round:0,total:4,scoreParts:[],elapsed:0,flash:0,feedback:'',seed};
  if(config.mechanic==='timing')Object.assign(overlay,{position:.04,targetCenter:.24+(seed%49)/100,targetWidth:assist?.28:.18});
  if(config.mechanic==='sequence')Object.assign(overlay,{sequence:activeSequence(seed,4),input:[],preview:assist?3.8:2.7,mistakes:0});
  if(config.mechanic==='balance')Object.assign(overlay,{position:.5,velocity:0,targetCenter:.5,targetWidth:assist?.42:.28,duration:assist?6:8,insideTime:0,control:0});
  if(config.mechanic==='decision')Object.assign(overlay,{questions:config.questions||[],selected:null,correct:0});
  game.overlay=overlay;audio.bell();return true;
}
function activeBegin(){const o=game.overlay;if(o?.type!=='activeGame')return;o.phase='active';o.elapsed=0;audio.good();}
function activeToggleAssist(){
  ensureActiveSchoolState();game.player.activityAssist=!game.player.activityAssist;
  const o=game.overlay;if(o?.type==='activeGame'){o.assist=game.player.activityAssist;if(o.mechanic==='timing')o.targetWidth=o.assist?.28:.18;if(o.mechanic==='sequence'&&o.phase==='intro')o.preview=o.assist?3.8:2.7;if(o.mechanic==='balance'){o.targetWidth=o.assist?.42:.28;o.duration=o.assist?6:8;}}
  saveSilently();
}
function activeTimingTarget(o){return .2+((o.seed+o.round*31)%61)/100;}
function updateActiveSchool(dt){
  const o=game.overlay;if(o?.type!=='activeGame'||o.phase!=='active')return;
  o.elapsed+=dt;o.flash=Math.max(0,o.flash-dt);
  if(o.mechanic==='timing')o.position=.5+.47*Math.sin(o.elapsed*(2.15+o.round*.34+game.year*.08)+o.round*.8);
  if(o.mechanic==='sequence'&&o.preview>0)o.preview=Math.max(0,o.preview-dt);
  if(o.mechanic==='balance'){
    const left=keys.has('arrowleft')||keys.has('a')||o.control<0,right=keys.has('arrowright')||keys.has('d')||o.control>0;
    o.velocity+=(right-left)*dt*(o.assist?.72:1.02);o.velocity*=Math.pow(.28,dt);o.position=clamp(o.position+o.velocity*dt,0,1);
    o.targetCenter=.5+Math.sin(o.elapsed*.82+o.seed*.01)*.17;
    if(Math.abs(o.position-o.targetCenter)<=o.targetWidth/2)o.insideTime+=dt;
    if(o.elapsed>=o.duration)finishActiveSchool(Math.round(o.insideTime/o.duration*100));
  }
}
function activeTimingHit(){
  const o=game.overlay;if(o?.type!=='activeGame'||o.phase!=='active'||o.mechanic!=='timing')return;
  const distance=Math.abs(o.position-o.targetCenter),accuracy=Math.round(clamp(110-distance*190,0,100));
  o.scoreParts.push(accuracy);o.flash=.25;audio.tone(accuracy>=70?900:240,.1,accuracy>=70?'sine':'sawtooth',.03);
  if(o.scoreParts.length>=o.total){finishActiveSchool(Math.round(o.scoreParts.reduce((a,b)=>a+b,0)/o.scoreParts.length));return;}
  o.round++;o.elapsed=.1;o.targetCenter=activeTimingTarget(o);o.targetWidth=o.assist?.28:Math.max(.11,.18-o.round*.012);
}
function activeSequenceInput(index){
  const o=game.overlay;if(o?.type!=='activeGame'||o.phase!=='active'||o.mechanic!=='sequence'||o.preview>0)return;
  const actual=ACTIVE_SYMBOLS[index],expected=o.sequence[o.input.length];o.input.push(actual);
  if(actual!==expected){o.mistakes++;audio.bad();}else audio.good();
  if(o.input.length>=o.sequence.length)finishActiveSchool(Math.max(0,100-o.mistakes*(o.assist?18:25)));
}
function activeDecisionAnswer(index){
  const o=game.overlay;if(o?.type!=='activeGame'||o.phase!=='active'||o.mechanic!=='decision')return;
  const question=o.questions[o.round];if(!question)return;
  const correct=index===question.correct;o.scoreParts.push(correct?100:25);if(correct)o.correct++;o.selected=index;o.feedback=correct?'Strong choice.':'Review the evidence and try the next scenario.';correct?audio.good():audio.bad();o.phase='feedback';
}
function activeNextDecision(){
  const o=game.overlay;if(o?.type!=='activeGame'||o.mechanic!=='decision'||o.phase!=='feedback')return;
  if(o.round>=o.total-1){finishActiveSchool(Math.round(o.scoreParts.reduce((a,b)=>a+b,0)/o.scoreParts.length));return;}
  o.round++;o.selected=null;o.feedback='';o.phase='active';
}
function activeBalanceControl(value){const o=game.overlay;if(o?.type==='activeGame'&&o.mechanic==='balance')o.control=value;}
function activeRelationshipReward(clubId){
  const clique={athletics:'Skybound Athletics',arts:'Velvet Bloom Arts',tech:'Byte Brigade',council:'Crest Council'}[clubId];
  const peers=NPCS.filter(npc=>npc.clique===clique);for(const peer of peers)game.player.relationships[peer.id]=clamp((game.player.relationships[peer.id]||0)+1,-10,20);
}
function finishActiveSchool(score){
  const o=game.overlay;if(o?.type!=='activeGame'||o.phase==='result')return;
  ensureActiveSchoolState();score=Math.round(clamp(score,0,100));const grade=score>=90?'S':score>=75?'A':score>=58?'B':score>=40?'C':'D';
  const masteryGain=o.practice?(score>=75?1:0):score>=90?4:score>=75?3:score>=55?2:1;
  if(o.isClub){
    game.player.clubActivityMastery[o.id]=(game.player.clubActivityMastery[o.id]||0)+masteryGain;
    if(!o.practice){const xp=6+masteryGain*5+(o.competition?12:0);awardClubXP(xp,`${o.title}: Grade ${grade}`);game.player.clubPrestige+=Math.max(1,Math.round(score/18));progressMission('club',1);if(score>=75)activeRelationshipReward(game.player.club);}
    if(o.competition&&score>=70&&!game.player.seasonalCompetitionWins.includes(activeSeasonalKey())){game.player.seasonalCompetitionWins.push(activeSeasonalKey());game.player.clubWins++;game.player.score+=statusScore(24);}
  }else{
    game.player.subjectMastery[o.id]=(game.player.subjectMastery[o.id]||0)+masteryGain;
    if(!o.practice){const stat=o.config.stat||'intellect';applyEffects({score:Math.round(score/8),[stat]:score>=65?1:0,stress:score<40?2:-1},`${o.config.name} active lesson: Grade ${grade}`);game.player.teacherTrust+=score>=75?1:0;}
  }
  game.player.activityBest[o.id]=Math.max(game.player.activityBest[o.id]||0,score);
  game.player.activityHistory.push({id:o.id,title:o.title,score,grade,year:game.year,month:game.month,day:game.day,practice:o.practice,competition:o.competition});
  if(game.player.activityHistory.length>120)game.player.activityHistory=game.player.activityHistory.slice(-120);
  o.phase='result';o.score=score;o.grade=grade;o.masteryGain=masteryGain;o.resultColor=score>=75?COLORS.gold:score>=50?COLORS.sky:COLORS.rose;saveSilently();audio.good();
}
function activeExitResult(){
  const o=game.overlay;if(o?.type!=='activeGame')return;const shouldAdvance=!o.practice&&(o.classroom||o.competition);game.overlay=null;if(shouldAdvance)advanceTime(o.classroom?12:10);
}
function drawActivityLab(o){
  ensureActiveSchoolState();overlayBase(o.title);
  addButton(92,92,180,32,'ACADEMICS',()=>o.page='academics',true,o.page==='academics',COLORS.blue);
  addButton(282,92,180,32,clubConfig().name.toUpperCase(),()=>o.page='club',true,o.page==='club',clubConfig().color);
  addButton(664,92,202,32,game.player.activityAssist?'ASSIST: ON':'ASSIST: OFF',activeToggleAssist,true,game.player.activityAssist,COLORS.mint);
  if(o.page==='academics'){
    Object.values(ACTIVE_SUBJECTS).forEach((subject,index)=>{
      const col=index%3,row=Math.floor(index/3),x=82+col*270,y=140+row*94,best=game.player.activityBest[subject.id]||0,mastery=game.player.subjectMastery[subject.id]||0;
      panel(x,y,248,82,COLORS.deep,subject.color,2);text(`${subject.icon}  ${subject.name}`,x+12,y+24,15,subject.color,true);wrapped(subject.summary,x+12,y+44,224,11,COLORS.cream,2);text(`Best ${best}% • Mastery ${mastery}`,x+12,y+74,10,COLORS.gold,true);addButton(x+166,y+52,68,22,'PLAY',()=>startActiveSchoolActivity(subject.id,{practice:true}),true,false,subject.color);
    });
  }else{
    activeClubCatalog().forEach((activity,index)=>{
      const col=index%2,row=Math.floor(index/2),x=92+col*390,y=145+row*120,best=game.player.activityBest[activity.id]||0,mastery=game.player.clubActivityMastery[activity.id]||0;
      panel(x,y,360,104,COLORS.deep,activity.color,3);text(activity.name,x+16,y+28,17,activity.color,true);text(activity.mechanic.toUpperCase(),x+260,y+27,11,COLORS.gold,true);wrapped(activity.summary,x+16,y+53,320,12,COLORS.cream,2);text(`Best ${best}% • Mastery ${mastery}`,x+16,y+91,11,COLORS.paper,true);addButton(x+260,y+73,82,23,'PRACTICE',()=>startActiveSchoolActivity(activity.id,{practice:true}),true,false,activity.color);
    });
    const seasonal=activeSeasonalName();panel(92,393,750,52,COLORS.deep,COLORS.gold,3);text(`SEASONAL • ${seasonal}`,108,418,16,COLORS.gold,true);text(game.player.seasonalCompetitionWins.includes(activeSeasonalKey())?'WON':'Available during club or free time',108,438,11,COLORS.cream,true);addButton(650,404,174,30,game.player.seasonalCompetitionWins.includes(activeSeasonalKey())?'COMPLETE':'ENTER EVENT',()=>startActiveSchoolActivity(activeClubCatalog()[(game.month-1)%4].id,{competition:true}),!game.player.seasonalCompetitionWins.includes(activeSeasonalKey()),false,clubConfig().color);
  }
  addButton(365,466,230,32,'CLOSE',()=>game.overlay=null);
}
function drawActiveGame(o){
  overlayBase(o.title);const color=o.config.color||COLORS.sky;
  centered(`${o.config.name} • ${o.mechanic.toUpperCase()}${o.practice?' • PRACTICE':''}${o.competition?' • SEASONAL EVENT':''}`,98,15,color,`bold 15px ${UI_FONT}`);
  if(o.phase==='intro'){
    panel(120,135,720,245,COLORS.deep,color,4);centeredAt(o.config.icon||'★',215,228,64,color,'bold 64px Trebuchet MS');text('HOW IT WORKS',300,177,17,COLORS.gold,true);wrapped(o.config.summary,300,208,480,16,COLORS.paper,4);wrapped(o.assist?'Timing assist is active: wider targets, longer previews and gentler balance controls.':'Standard challenge settings are active. You can enable assists without reducing campaign access.',300,288,480,13,COLORS.cream,4);addButton(205,414,250,42,o.assist?'ASSIST ON':'ASSIST OFF',activeToggleAssist,true,o.assist,COLORS.mint);addButton(505,414,250,42,'START ACTIVITY',activeBegin,true,false,color);return;
  }
  if(o.phase==='result'){
    panel(145,135,670,265,COLORS.deep,o.resultColor,4);centered(`GRADE ${o.grade}`,190,42,o.resultColor,'bold 42px Trebuchet MS');centered(`${o.score}% performance`,238,22,COLORS.paper,'bold 22px Trebuchet MS');centered(`Mastery +${o.masteryGain} • Best ${game.player.activityBest[o.id]}%`,276,15,COLORS.gold,`bold 15px ${UI_FONT}`);wrapped(o.practice?'Practice improves mastery without affecting the campaign clock or ranking.':'The result has been applied to grades, relationships, club progress and reputation where relevant.',230,322,500,15,COLORS.cream,4);addButton(330,430,300,42,'RETURN TO SCHOOL',activeExitResult);return;
  }
  panel(100,130,760,270,COLORS.deep,color,4);
  text(`ROUND ${Math.min(o.round+1,o.total)}/${o.total}`,130,166,17,color,true);
  if(o.mechanic==='timing'){
    const x=155,y=235,w=650,h=46,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;const labels=o.config.timingLabels||o.config.labels||['READY','FOCUS','ACT','FINISH'];text(labels[o.round]||'CUE',130,197,14,COLORS.gold,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(229,184,75,.36)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.strokeStyle=COLORS.gold;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);ctx.fillStyle=o.flash?COLORS.white:color;ctx.fillRect(marker-5,y-16,10,h+32);o.scoreParts.forEach((score,index)=>text(`${index+1}: ${score}%`,205+index*145,326,14,score>=70?COLORS.mint:COLORS.paper,true));addButton(330,426,300,44,'HIT • E / SPACE',activeTimingHit,true,false,color);
  }else if(o.mechanic==='sequence'){
    const labels=o.config.sequenceLabels||o.config.labels||ACTIVE_SYMBOLS;text(o.preview>0?'MEMORIZE THE ORDER':o.assist?`NEXT: ${o.sequence[o.input.length]||'DONE'}`:'REPEAT THE ORDER',130,197,15,COLORS.gold,true);for(let i=0;i<4;i++){const x=185+i*150;panel(x,225,110,72,COLORS.ink,color,2);centeredAt(o.preview>0?o.sequence[i]:(o.input[i]||'•'),x+55,270,30,o.preview>0?color:COLORS.paper,'bold 30px Trebuchet MS');text(labels[i]||ACTIVE_SYMBOLS[i],x+18,318,11,COLORS.cream,true);addButton(x,345,110,34,`${i+1} • ${ACTIVE_SYMBOLS[i]}`,()=>activeSequenceInput(i),o.preview<=0,false,color);}
  }else if(o.mechanic==='balance'){
    const x=170,y=230,w=620,h=54,targetX=x+o.targetCenter*w,targetW=o.targetWidth*w,marker=x+o.position*w;text(o.config.balanceLabel||'BALANCE ZONE',130,195,15,COLORS.gold,true);ctx.fillStyle='#10182a';ctx.fillRect(x,y,w,h);ctx.fillStyle='rgba(131,185,139,.3)';ctx.fillRect(targetX-targetW/2,y,targetW,h);ctx.strokeStyle=COLORS.mint;ctx.lineWidth=3;ctx.strokeRect(targetX-targetW/2+.5,y+.5,targetW-1,h-1);ctx.fillStyle=color;ctx.fillRect(marker-7,y-18,14,h+36);const remaining=Math.max(0,o.duration-o.elapsed);centered(`${remaining.toFixed(1)}s • ${Math.round(o.insideTime/Math.max(.01,o.elapsed)*100)||0}% stable`,330,16,COLORS.paper,`bold 16px ${UI_FONT}`);addButton(215,420,220,44,'← HOLD LEFT',()=>{},true,false,color,{holdKey:'arrowleft'});addButton(525,420,220,44,'HOLD RIGHT →',()=>{},true,false,color,{holdKey:'arrowright'});
  }else if(o.mechanic==='decision'){
    const question=o.questions[o.round]||{prompt:'Choose the strongest response.',choices:['Option A','Option B','Option C'],correct:0};wrapped(question.prompt,160,205,640,20,COLORS.paper,3);question.choices.forEach((choice,index)=>addButton(175,265+index*48,610,38,`${index+1}  ${choice}`,()=>activeDecisionAnswer(index),true,o.selected===index,color));
  }
  if(o.phase==='feedback'){panel(165,410,630,60,COLORS.ink,o.selected===o.questions[o.round]?.correct?COLORS.mint:COLORS.rose,2);wrapped(o.feedback,182,433,440,13,COLORS.paper,2);addButton(635,422,140,32,o.round>=o.total-1?'RESULT':'NEXT',activeNextDecision,true,false,color);}
}

const activeOriginalTriggerClass=triggerClass;
triggerClass=function(slot,late=false){
  activeOriginalTriggerClass(slot,late);ensureActiveSchoolState();if(!game.dialogue||!slot)return;
  const subjectId=ACTIVE_CLASS_SLOT_MAP[slot.id];
  if(subjectId&&!game.dayFlags.activeLessons.includes(`${game.year}-${game.month}-${game.day}-${slot.id}`)){
    const key=`${game.year}-${game.month}-${game.day}-${slot.id}`;
    game.dialogue.choices=[{text:`Active ${ACTIVE_SUBJECTS[subjectId].name} challenge`,action:()=>{game.dayFlags.activeLessons.push(key);startActiveSchoolActivity(subjectId,{classroom:true});}},...game.dialogue.choices].slice(0,4);
  }else if(slot.id==='club'){
    const activity=activeClubCatalog()[(game.day+game.month)%4];
    game.dialogue.choices=[{text:`Play ${activity.name}`,action:()=>startActiveSchoolActivity(activity.id,{classroom:true})},...game.dialogue.choices].slice(0,4);
  }
};
const activeOriginalUpdate=update;
update=function(dt){if(game.overlay?.type==='activeGame'){updateActiveSchool(dt);return;}activeOriginalUpdate(dt);};
const activeOriginalDrawOverlay=drawOverlay;
drawOverlay=function(){const o=game.overlay;if(o?.type==='activityLab')drawActivityLab(o);else if(o?.type==='activeGame')drawActiveGame(o);else activeOriginalDrawOverlay();};

function drawTitle(){
  ctx.drawImage(images.keyart,0,0,W,H);const shade=ctx.createLinearGradient(0,0,W,0);shade.addColorStop(0,'rgba(8,12,24,.76)');shade.addColorStop(.58,'rgba(8,12,24,.48)');shade.addColorStop(1,'rgba(8,12,24,.64)');ctx.fillStyle=shade;ctx.fillRect(0,0,W,H);
  panel(54,34,852,112,'rgba(20,22,39,.96)',COLORS.gold,5);centered('SAKURA CREST',78,36,COLORS.paper,'bold 38px Trebuchet MS');centered('SOCIAL SUMMIT',115,22,COLORS.pink,'bold 22px Trebuchet MS');centered('Four school years • Forty-eight rankings • One unforgettable prom',137,13,COLORS.cream,`bold 13px ${UI_FONT}`);
  panel(64,174,470,304,'rgba(20,22,39,.92)',COLORS.sky,3);text('BUILD A LIFE, NOT JUST A RANK',88,211,19,COLORS.gold,true);wrapped('Attend class, master active lessons, lead a club, build friendships and shape a living campus across four complete school years.',88,246,410,16,COLORS.paper,5);const badges=[['9','SUBJECTS'],['16','CLUB ACTIVITIES'],['48','CHAPTERS'],['4','ELECTIONS']];badges.forEach((item,index)=>{const x=88+(index%2)*205,y=330+Math.floor(index/2)*62;panel(x,y,184,48,COLORS.deep,index%2?COLORS.pink:COLORS.sky,2);text(item[0],x+12,y+31,24,COLORS.gold,true);text(item[1],x+55,y+28,11,COLORS.cream,true);});text('v1.3 • ACTIVE SCHOOL + VISUAL POLISH',88,458,11,COLORS.mint,true);
  panel(566,174,330,304,'rgba(20,22,39,.94)',COLORS.gold,3);text('START YOUR SCHOOL LIFE',594,207,15,COLORS.gold,true);addButton(594,226,274,46,'NEW GAME',()=>{audio.startMusic();resetGame();game.mode='creator';creator.classList.remove('hidden');});addButton(594,282,274,46,'CONTINUE',()=>{audio.startMusic();if(!loadGame())notify('No save found yet.',COLORS.red);},!!localStorage.getItem(SAVE_KEY));addButton(594,338,274,42,'HOW TO PLAY',()=>game.overlay={type:'help',title:'How to Play'});addButton(594,390,274,42,'ACCESSIBILITY & CONTROLS',openAccessibility);centeredAt('WASD / Arrows • E interact • G activities',731,454,11,COLORS.cream,`bold 11px ${UI_FONT}`);
}
function drawHudPanel(){
  ensureActiveSchoolState();const gradient=ctx.createLinearGradient(PANEL_X,0,W,H);gradient.addColorStop(0,'rgba(25,28,48,.98)');gradient.addColorStop(1,'rgba(11,17,31,.98)');ctx.fillStyle=gradient;ctx.fillRect(PANEL_X,0,PANEL_W,H);ctx.fillStyle=COLORS.gold;ctx.fillRect(PANEL_X,0,4,H);
  text(`YEAR ${game.year} • MONTH ${game.month}`,738,21,13,COLORS.gold,true);wrapped(campaignMonth().title,738,39,202,10,COLORS.sky,2);text(`DAY ${game.day}/20 • ${statusConfig().badge}`,738,66,10,COLORS.paper,true);
  panel(736,77,208,58,COLORS.deep,COLORS.sky,2);text(formatTime(game.time),748,111,26,COLORS.white,true);const slot=currentSlot(),next=nextSlot();wrapped(slot?.title||'School day complete',820,95,112,11,COLORS.sky,2);if(next)text(`Next ${formatTime(next.start)}`,820,124,9,COLORS.cream,true);
  const rank=getPlayerRank(game.player.gender);panel(736,145,208,64,COLORS.deep,COLORS.gold,2);text(`${game.player.gender==='boy'?'BOYS':'GIRLS'} RANK`,748,166,11,COLORS.cream,true);text(`#${rank.position}`,748,198,28,COLORS.gold,true);text(`${rank.score} pts`,818,194,14,COLORS.paper,true);
  drawBar(742,224,194,12,game.player.energy,100,COLORS.mint,'ENERGY');drawBar(742,248,194,12,game.player.stress,100,COLORS.rose,'STRESS');
  text('TODAY',738,281,13,COLORS.sky,true);game.missions.forEach((mission,index)=>{const y=292+index*34;ctx.fillStyle=mission.done?'rgba(77,139,104,.28)':'rgba(255,255,255,.04)';ctx.fillRect(736,y,208,29);text(mission.done?'✓':'•',744,y+19,13,mission.done?COLORS.mint:COLORS.gold,true);wrapped(mission.title,762,y+12,145,10,COLORS.paper,1);text(`${mission.progress}/${mission.goal}`,910,y+20,9,COLORS.cream,true);});
  const unread=unreadMessageCount();const rows=[['RANKS',()=>game.overlay={type:'rankings',title:'Live Social Rankings'},'SCHEDULE',()=>game.overlay={type:'schedule',title:'Class Schedule'}],['CLUB',()=>game.overlay={type:'club',title:clubConfig().name},'ACTIVITIES',()=>openActivityLab('academics')],['CAMPUS',openLivingCampusOverlay,unread?`PHONE ${unread}`:'FRIENDS',()=>unread?openPhone():game.overlay={type:'relationships',title:'Friendships'}],['SAVE',saveGame,audio.enabled?'SOUND ON':'SOUND OFF',()=>audio.toggle()]];rows.forEach((row,index)=>{const y=399+index*28;addButton(736,y,98,24,row[0],row[1],true,false,index===1?clubConfig().color:COLORS.blue);addButton(846,y,98,24,row[2],row[3],true,false,index===1?COLORS.mint:unread&&index===2?COLORS.rose:COLORS.blue);});
  const brief=dailyBrief();text(`${brief.weather} • ${game.campus?.lastCrowd||'Campus active'}`,738,526,9,COLORS.cream,true);
}
function drawMobileControls(){
  const coarse=Boolean(window.matchMedia?.('(pointer: coarse)')?.matches||(typeof navigator!=='undefined'&&navigator.maxTouchPoints>0));if(!game.showControls||!coarse)return;ctx.globalAlpha=.72;[['↑',72,410,'arrowup'],['←',30,452,'arrowleft'],['↓',72,452,'arrowdown'],['→',114,452,'arrowright']].forEach(([lab,x,y,key])=>addButton(x,y,38,38,lab,()=>{},true,false,COLORS.navy,{holdKey:key,world:true}));addButton(625,445,64,64,'E',interact,true,false,COLORS.rose,{world:true});ctx.globalAlpha=1;
}
window.addEventListener('keydown',event=>{
  const k=event.key.toLowerCase();
  if(game.overlay?.type==='activeGame'){
    const o=game.overlay;if(k==='h')activeToggleAssist();
    if(o.phase==='intro'&&(k===' '||k==='e'||k==='enter'))activeBegin();
    else if(o.phase==='result'&&(k===' '||k==='e'||k==='enter'||k==='escape'))activeExitResult();
    else if(o.mechanic==='timing'&&o.phase==='active'&&(k===' '||k==='e'||k==='enter'))activeTimingHit();
    else if(o.mechanic==='sequence'&&o.phase==='active'&&['1','2','3','4'].includes(k))activeSequenceInput(Number(k)-1);
    else if(o.mechanic==='decision'&&o.phase==='active'&&['1','2','3'].includes(k))activeDecisionAnswer(Number(k)-1);
    else if(o.mechanic==='decision'&&o.phase==='feedback'&&(k===' '||k==='e'||k==='enter'))activeNextDecision();
    else if(o.mechanic==='balance'&&k==='arrowleft')activeBalanceControl(-1);
    else if(o.mechanic==='balance'&&k==='arrowright')activeBalanceControl(1);
    return;
  }
  if(game.overlay?.type==='activityLab'&&k==='escape'){game.overlay=null;return;}
  if(game.mode==='play'&&!game.dialogue&&!game.overlay&&k==='g'){event.preventDefault();openActivityLab('academics');}
});
window.addEventListener('keyup',event=>{if(game.overlay?.type==='activeGame'&&game.overlay.mechanic==='balance'&&(event.key==='ArrowLeft'||event.key==='ArrowRight'))activeBalanceControl(0);});
ensureActiveSchoolState();
