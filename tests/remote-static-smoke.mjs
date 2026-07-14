import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const listeners={};
class Element{
  constructor(id){this.id=id;this.classList={_s:new Set(),add(v){this._s.add(v)},remove(v){this._s.delete(v)},contains(v){return this._s.has(v)}};this.value='Akira';this.textContent='';}
  addEventListener(type,fn){(listeners[`${this.id}:${type}`]??=[]).push(fn)}
}
const ctx=new Proxy({imageSmoothingEnabled:true,textAlign:'left',textBaseline:'alphabetic',measureText(t){return{width:String(t).length*8}},createLinearGradient(){return{addColorStop(){}}}}, {get(o,p){if(p in o)return o[p];return()=>{}},set(o,p,v){o[p]=v;return true}});
const canvas=new Element('game');canvas.width=960;canvas.height=540;canvas.getContext=()=>ctx;canvas.getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});
const elements={game:canvas,creator:new Element('creator'),nameInput:new Element('nameInput'),confirmName:new Element('confirmName'),loading:new Element('loading'),orientationHint:new Element('orientation-hint')};elements.creator.classList.add('hidden');
globalThis.document={getElementById:id=>elements[id]};globalThis.window=globalThis;window.addEventListener=(t,f)=>{(listeners[`window:${t}`]??=[]).push(f)};window.matchMedia=()=>({matches:false});
window.AudioContext=class{constructor(){this.currentTime=0;this.state='running';this.destination={}}createOscillator(){return{type:'',frequency:{value:0},connect(){},start(){},stop(){}}}createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}}}resume(){}};
globalThis.navigator={maxTouchPoints:0};
globalThis.localStorage={_d:{},getItem(k){return this._d[k]??null},setItem(k,v){this._d[k]=v},removeItem(k){delete this._d[k]}};
globalThis.requestAnimationFrame=()=>0;globalThis.performance={now:()=>1000};globalThis.setInterval=()=>1;globalThis.clearInterval=()=>{};
globalThis.Image=class{set src(v){this._src=v;queueMicrotask(()=>this.onload?.())}};

const index=await readFile('index.html','utf8');
const scripts=[...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match=>match[1]);
if(scripts.length<16)throw new Error(`Expected 16 production scripts; found ${scripts.length}.`);
for(const script of scripts)vm.runInThisContext(await readFile(script,'utf8'),{filename:script});
await new Promise(resolve=>setTimeout(resolve,25));
if(!elements.loading.classList.contains('hidden'))throw new Error('Static game did not complete initialization.');
const checks=[
  [CAMPAIGN_MONTHS.length,48,'campaign chapters'],[Object.values(RELATIONSHIP_ROUTES).flat().length,30,'friendship chapters'],
  [PHONE_MESSAGES.length,20,'phone conversations'],[RIVALRY_SCENES.length,20,'rivalry chapters'],[MONTHLY_SHOWCASES.length,12,'showcases'],
  [CAMPUS_ACTIVITIES.length,8,'campus activities'],[ACHIEVEMENTS.length,40,'achievements'],[FRIENDSHIP_MOMENTS.length,10,'illustrated moments'],
  [CAMPUS_INCIDENTS.length,24,'campus incidents'],[GRADUATION_LEGACIES.length,12,'graduation legacies'],[LEADERSHIP_ELECTIONS.length,4,'elections']
];
for(const [actual,expected,label] of checks)if(actual!==expected)throw new Error(`Expected ${expected} ${label}; got ${actual}.`);
ensureV10State();ensureActiveSchoolState();
game.player.gender='boy';game.player.routeScenes=['ren-1','ren-2','ren-3'];game.player.relationships.ren=15;
const ren=game.npcs.find(n=>n.id==='ren');if(!nextFriendshipMoment(ren))throw new Error('Illustrated friendship moment did not unlock.');
game.time=855;game.dayFlags.activity=false;const activity=CAMPUS_ACTIVITIES.find(a=>a.mechanic==='focus');startCampusMastery(activity);
for(let i=0;i<4;i++){game.overlay.position=game.overlay.targetCenter;campusMasteryAction();}
if(game.overlay.phase!=='result'||game.player.campusBest[activity.id]<90)throw new Error('Campus mastery minigame did not record an S-level result.');
const legacy=determineGraduationLegacy(false);if(!legacy?.name)throw new Error('Graduation legacy calculation failed.');
const art=createArtSources();if(!art.memory_atlas||!art.character_atlas)throw new Error('v0.8 scalable art sources are incomplete.');
game.overlay=null;game.year=1;game.month=9;game.day=17;game.player.electionHistory=[];game.player.leadershipWins=0;
if(!electionDue()||!startElection()||game.overlay.type!=='election')throw new Error('Election flow did not start.');
chooseCampaignPlatform('community');for(let i=0;i<3;i++){electionAnswer(game.overlay.cfg.questions[game.overlay.questionIndex].correct);nextElectionQuestion();}
if(game.player.electionHistory.length!==1||game.player.campaignBest<=0)throw new Error('Election result was not recorded.');
game.overlay=null;openLeadershipJournal();if(game.overlay?.type!=='leadership')throw new Error('Leadership journal did not open.');game.overlay=null;

const routineValidation=validateCampusRoutines();
if(!routineValidation.valid)throw new Error(`Living Campus routines invalid: ${routineValidation.errors.join(', ')}`);
if(routineValidation.studentPeriods!==110||routineValidation.teacherPeriods!==44)throw new Error(`Unexpected routine coverage: ${JSON.stringify(routineValidation)}`);
game.mode='play';game.dialogue=null;game.overlay=null;game.paused=false;game.time=510;game.dailyBrief={id:`${game.year}-${game.month}-${game.day}`,weather:'Clear',notice:'QA notice'};
relocateNPCs('math');
for(const actor of [...game.npcs,...game.teachers]){
  if(!actor.campus?.room||!ROOMS[actor.campus.room])throw new Error(`${actor.id} has no valid living-campus destination.`);
  if(!Number.isFinite(actor.x)||!Number.isFinite(actor.y))throw new Error(`${actor.id} has invalid coordinates.`);
}
for(let step=0;step<180;step++)updateCampusSimulation(.25);
for(const actor of [...game.npcs,...game.teachers])if(!Number.isFinite(actor.x)||!Number.isFinite(actor.y))throw new Error(`${actor.id} movement became non-finite.`);
game.dailyBrief={id:`${game.year}-${game.month}-${game.day}`,weather:'Heavy Rain',notice:'Courtyard closed'};
game.time=620;game.dayFlags.incident=false;campusApplyRoutines({key:'break',slotId:'break',transition:false,slot:SCHEDULE.find(slot=>slot.id==='break')},{instant:true});
if(campusRoomOpen('courtyard'))throw new Error('Rain closure did not close the courtyard.');
if(game.npcs.some(npc=>npc.campus?.room==='courtyard'))throw new Error('A student remained routed to the closed courtyard.');
openLivingCampusOverlay();if(game.overlay?.type!=='livingCampus')throw new Error('Campus Pulse overlay did not open.');game.overlay=null;

const activeValidation=validateActiveSchoolContent();
if(!activeValidation.valid)throw new Error(`Active School content invalid: ${activeValidation.issues.join(', ')}`);
if(activeValidation.subjects!==9||activeValidation.clubActivities!==16||activeValidation.seasonalEvents!==16)throw new Error(`Unexpected Active School coverage: ${JSON.stringify(activeValidation)}`);
const visualValidation=validateActiveVisualLayout();if(!visualValidation.valid)throw new Error(`Visual layout invalid: ${visualValidation.issues.join(', ')}`);

// Decision activity: complete a perfect mathematics practice session.
game.overlay=null;game.time=620;startActiveSchoolActivity('math',{practice:true});activeBegin();
for(let round=0;round<4;round++){const question=game.overlay.questions[game.overlay.round];activeDecisionAnswer(question.correct);activeNextDecision();}
if(game.overlay.phase!=='result'||game.player.activityBest.math!==100||game.player.subjectMastery.math<1)throw new Error('Mathematics decision activity did not persist a perfect result.');

// Sequence activity: replay the authored order exactly.
game.overlay=null;startActiveSchoolActivity('literature',{practice:true});activeBegin();game.overlay.preview=0;
for(const symbol of [...game.overlay.sequence])activeSequenceInput(ACTIVE_SYMBOLS.indexOf(symbol));
if(game.overlay.phase!=='result'||game.player.activityBest.literature!==100)throw new Error('Literature sequence activity failed.');

// Timing activity: place every hit at the target center.
game.overlay=null;startActiveSchoolActivity('science',{practice:true});activeBegin();
for(let round=0;round<4;round++){game.overlay.position=game.overlay.targetCenter;activeTimingHit();}
if(game.overlay.phase!=='result'||game.player.activityBest.science!==100)throw new Error('Science timing activity failed.');

// Balance activity and assist persistence.
game.overlay=null;startActiveSchoolActivity('art',{practice:true});const widthBefore=game.overlay.targetWidth;activeToggleAssist();
if(game.overlay.targetWidth===widthBefore||game.overlay.assist!==game.player.activityAssist)throw new Error('Activity assist did not update the active challenge.');
activeBegin();finishActiveSchool(100);if(game.overlay.phase!=='result'||game.player.activityBest.art!==100)throw new Error('Art balance activity failed.');

// Seasonal club competition updates club progress and seasonal history.
game.overlay=null;game.player.club='council';game.time=745;const seasonalKey=activeSeasonalKey();startActiveSchoolActivity('council-debate',{competition:true});activeBegin();
for(let round=0;round<4;round++){game.overlay.position=game.overlay.targetCenter;activeTimingHit();}
if(game.overlay.phase!=='result'||!game.player.seasonalCompetitionWins.includes(seasonalKey)||game.player.clubWins<1)throw new Error('Seasonal club competition result was not recorded.');

if(window.SAKURA_RELEASE?.version!=='1.3.0')throw new Error(`Unexpected release marker ${window.SAKURA_RELEASE?.version}.`);
console.log(`Remote runtime smoke passed for ${scripts.length} scripts, ${checks.map(c=>c[1]).join('/')} authored systems, ${routineValidation.studentPeriods+routineValidation.teacherPeriods} living-campus routines, ${activeValidation.subjects} subjects, ${activeValidation.clubActivities} club activities and save version ${CURRENT_SAVE_VERSION}.`);
