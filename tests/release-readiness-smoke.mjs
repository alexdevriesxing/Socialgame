import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const listeners={};
class Element{
  constructor(id=''){this.id=id;this.value='Akira';this.textContent='';this.innerHTML='';this.dataset={};this.style={};this.attributes={};this.children=[];this.classList={_set:new Set(),add:(...values)=>values.forEach(value=>this.classList._set.add(value)),remove:(...values)=>values.forEach(value=>this.classList._set.delete(value)),contains:value=>this.classList._set.has(value)};}
  addEventListener(type,fn){(listeners[`${this.id}:${type}`]??=[]).push(fn);} setAttribute(name,value){this.attributes[name]=String(value);} removeAttribute(name){delete this.attributes[name];}
  append(...nodes){this.children.push(...nodes);} appendChild(node){this.children.push(node);return node;}
}
const ctx=new Proxy({imageSmoothingEnabled:true,textAlign:'left',textBaseline:'alphabetic',measureText:value=>({width:String(value).length*8}),createLinearGradient:()=>({addColorStop(){}})}, {get:(target,key)=>key in target?target[key]:(()=>{}),set:(target,key,value)=>(target[key]=value,true)});
const canvas=new Element('game');canvas.width=960;canvas.height=540;canvas.getContext=()=>ctx;canvas.getBoundingClientRect=()=>({left:0,top:0,width:960,height:540});
const elements={game:canvas,creator:new Element('creator'),nameInput:new Element('nameInput'),confirmName:new Element('confirmName'),loading:new Element('loading'),'orientation-hint':new Element('orientation-hint')};elements.creator.classList.add('hidden');
const documentElement=new Element('html'),body=new Element('body');
globalThis.document={documentElement,body,getElementById:id=>elements[id]||null,createElement:tag=>new Element(tag)};
globalThis.window=globalThis;window.addEventListener=(type,fn)=>{(listeners[`window:${type}`]??=[]).push(fn);};window.dispatchEvent=()=>true;window.matchMedia=()=>({matches:false});
globalThis.CustomEvent=class{constructor(type,options={}){this.type=type;this.detail=options.detail;}};
globalThis.location={protocol:'file:',reload(){}};
Object.defineProperty(globalThis,'navigator',{value:{maxTouchPoints:0,storage:{persist:async()=>true}},configurable:true});
globalThis.localStorage={_data:{},getItem(key){return this._data[key]??null;},setItem(key,value){this._data[key]=String(value);},removeItem(key){delete this._data[key];},clear(){this._data={};}};
globalThis.requestAnimationFrame=()=>0;globalThis.performance={now:()=>1000};globalThis.setInterval=()=>1;globalThis.clearInterval=()=>{};
globalThis.AudioContext=class{constructor(){this.currentTime=0;this.state='running';this.destination={};}createOscillator(){return{type:'',frequency:{value:0},connect(){},start(){},stop(){}};}createGain(){return{gain:{value:0,setValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){}};}resume(){}};window.webkitAudioContext=window.AudioContext;
globalThis.Image=class{set src(value){this._src=value;queueMicrotask(()=>this.onload?.());}};

const index=await readFile('index.html','utf8');
const scripts=[...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(match=>match[1]);
for(const script of scripts)vm.runInThisContext(await readFile(script,'utf8'),{filename:script});
await new Promise(resolve=>setTimeout(resolve,30));

if(CURRENT_SAVE_VERSION!==10)throw new Error(`Expected save version 10, received ${CURRENT_SAVE_VERSION}.`);
if(window.SAKURA_RELEASE?.version!=='1.7.0')throw new Error(`Expected release 1.7.0, received ${window.SAKURA_RELEASE?.version}.`);
const readiness=validateReleaseReadiness();if(!readiness.valid)throw new Error(`Release validator failed: ${JSON.stringify(readiness)}`);
if(readiness.knownCriticalIssues!==0||readiness.knownHighIssues!==0)throw new Error('Release validator reports unresolved critical or high issues.');

class MemoryStorage{
  constructor(){this.data={};}getItem(key){return this.data[key]??null;}setItem(key,value){this.data[key]=String(value);}removeItem(key){delete this.data[key];}clear(){this.data={};}
}
const cleanSnapshot=normalizeSaveSnapshot(gameSnapshot());
const migrated=migrateSave({version:9,data:cleanSnapshot});if(migrated.version!==10||!migrated.data.releaseStats)throw new Error('v9 to v10 migration failed.');
for(let version=1;version<=9;version++){const result=migrateSave({version,data:{player:{},year:1,month:1,day:1,time:470}});if(result.version!==10)throw new Error(`Save v${version} did not migrate to v10.`);}
const repaired=normalizeSaveSnapshot({year:999,month:-4,day:91,time:Infinity,player:{energy:-40,stress:500,stats:{charisma:900},relationships:{aiko:999}}});
if(repaired.year!==5||repaired.month!==1||repaired.day!==20||repaired.time!==470||repaired.player.energy!==0||repaired.player.stress!==100||repaired.player.stats.charisma!==20||repaired.player.relationships.aiko!==20)throw new Error(`Save repair bounds failed: ${JSON.stringify(repaired)}`);

const storage=new MemoryStorage();
writeSave(storage,{...cleanSnapshot,day:3});writeSave(storage,{...cleanSnapshot,day:4});
storage.setItem(SAVE_KEY,'{"broken"');const recovered=readSave(storage);const recoveryReport=getSaveRecoveryReport();
if(recovered?.day!==3||!recoveryReport.recovered||recoveryReport.source!==SAVE_BACKUP_KEY||!storage.getItem(SAVE_CORRUPT_KEY))throw new Error(`Corrupted-main recovery failed: ${JSON.stringify({day:recovered?.day,recoveryReport})}`);
writeSave(storage,{...cleanSnapshot,day:5});writeSave(storage,{...cleanSnapshot,day:6});const tampered=JSON.parse(storage.getItem(SAVE_KEY));tampered.data.day=17;storage.setItem(SAVE_KEY,JSON.stringify(tampered));const checksumRecovery=readSave(storage);
if(checksumRecovery?.day!==5||!getSaveRecoveryReport().recovered)throw new Error('Checksum tampering did not recover the previous valid save.');
writeSave(storage,{...cleanSnapshot,day:7});const pending=storage.getItem(SAVE_KEY);storage.setItem(SAVE_TEMP_KEY,pending);storage.setItem(SAVE_KEY,'not-json');storage.removeItem(SAVE_BACKUP_KEY);const interrupted=readSave(storage);
if(interrupted?.day!==7||getSaveRecoveryReport().source!==SAVE_TEMP_KEY)throw new Error('Interrupted-write recovery failed.');
deleteSave(storage);if([SAVE_KEY,SAVE_BACKUP_KEY,SAVE_TEMP_KEY,SAVE_CORRUPT_KEY].some(key=>storage.getItem(key)!==null))throw new Error('Delete-save did not clear recovery files.');

function committedProfile(gender,club,status){
  game.player=defaultPlayer();game.player.gender=gender;game.player.club=club;game.player.socialStatus=status;game.year=1;game.month=1;game.day=1;game.mode='play';game.finished=false;initializeSocialStatus();
  game.player.worldScenes=[];game.player.worldTopics=[];game.player.collectibles=[];game.player.giftHistory=[];game.player.wallet=1200;game.player.releaseStats={};
  const ranks=[];
  for(let chapter=1;chapter<=48;chapter++){
    game.year=Math.floor((chapter-1)/12)+1;game.month=((chapter-1)%12)+1;game.day=20;
    game.player.score+=statusScore(92+(chapter%4)*6);
    for(const stat of Object.keys(game.player.stats))game.player.stats[stat]=Math.min(20,game.player.stats[stat]+(chapter%2===0?1:0));
    for(const npc of NPCS)game.player.relationships[npc.id]=Math.min(20,(game.player.relationships[npc.id]||0)+(chapter%3===0?1:0));
    game.player.clubPrestige+=11;game.player.clubXP+=15;if(chapter>=8)game.player.clubRankIndex=1;if(chapter>=18)game.player.clubRankIndex=2;if(chapter>=30)game.player.clubRankIndex=3;if(chapter%4===0)game.player.clubWins++;
    game.player.eventPrestige+=5;if(chapter%3===0)game.player.showcaseWins++;game.player.teacherTrust=Math.min(12,game.player.teacherTrust+(chapter%4===0?1:0));
    for(const npc of NPCS)game.player.rivalRespect[npc.id]=(game.player.rivalRespect[npc.id]||0)+(chapter%4===0?1:0);
    game.player.campusActivityLog.push({chapter});if(chapter%2===0)game.player.achievements.push(`qa-${chapter}`);if(chapter%5===0)game.player.incidentHistory.push(`incident-${chapter}`);if(chapter%6===0)game.player.examScores.push({score:76+chapter%17});game.player.weekendOutings.push({chapter});
    if(game.month===9){game.player.electionHistory.push({score:74});if(game.year<=3)game.player.leadershipWins++;}
    game.player.stress=status==='outsider'?30:status==='ordinary'?22:16;game.player.demerits=status==='outsider'?2:status==='ordinary'?1:0;game.player.tardies=status==='outsider'?2:1;game.player.absences=0;
    ranks.push(getPlayerRank(gender).position);game.player.score=Math.round(game.player.score*RELEASE_BALANCE.scoreRetention[status]);
  }
  return{gender,club,status,first:ranks[0],final:ranks.at(-1),best:Math.min(...ranks),worst:Math.max(...ranks),score:socialScore(),ranks};
}
const profiles=[];
for(const gender of ['boy','girl'])for(const club of Object.keys(CLUBS))for(const status of Object.keys(SOCIAL_STATUS_LEVELS))profiles.push(committedProfile(gender,club,status));
for(const profile of profiles){if(!Number.isFinite(profile.score)||profile.score<0||profile.score>RELEASE_BALANCE.socialScoreCeiling)throw new Error(`Non-finite profile score: ${JSON.stringify(profile)}`);if(profile.final>2)throw new Error(`Committed campaign cannot reach the final top two: ${JSON.stringify(profile)}`);if(profile.final>profile.first)throw new Error(`Committed campaign regressed from its opening rank: ${JSON.stringify(profile)}`);if(profile.ranks.length!==48)throw new Error('Campaign simulation did not cover all 48 months.');}
const passive=(()=>{game.player=defaultPlayer();game.player.gender='boy';game.player.socialStatus='established';game.year=4;game.month=12;game.day=20;initializeSocialStatus();return getPlayerRank('boy').position;})();
if(passive<=2)throw new Error(`Passive play reached an elite ending without contribution (rank ${passive}).`);

for(const gender of ['boy','girl']){
  game.player=defaultPlayer();game.player.gender=gender;game.player.monthlyScores=Array.from({length:48},(_,index)=>({year:Math.floor(index/12)+1,month:index%12+1,rank:1,score:900}));game.player.demerits=0;game.player.relationships=Object.fromEntries(NPCS.map(npc=>[npc.id,15]));game.year=5;game.month=1;game.mode='play';ensureV10State();finishProm();if(!/crowned Prom/.test(game.promResult||''))throw new Error(`${gender} crown ending is unreachable.`);
  game.player=defaultPlayer();game.player.gender=gender;game.player.monthlyScores=Array.from({length:48},(_,index)=>({year:Math.floor(index/12)+1,month:index%12+1,rank:5,score:250}));game.player.demerits=12;game.year=5;game.month=1;game.mode='play';ensureV10State();finishProm();if(/crowned Prom/.test(game.promResult||'')||!/do not take the crown/.test(game.promResult||''))throw new Error(`${gender} non-crown ending is unreachable.`);
}

for(let iteration=0;iteration<50000;iteration++){game.year=iteration%4+1;game.month=iteration%12+1;game.day=iteration%20+1;const playerScore=releaseSocialScore(game.player,game);const rivalScore=releaseNpcScore(NPCS[iteration%NPCS.length],game,game.player);if(!Number.isFinite(playerScore)||!Number.isFinite(rivalScore))throw new Error(`Long-session score became non-finite at iteration ${iteration}.`);}

console.log(`Release readiness passed: ${profiles.length} complete 48-month profiles, both ranking ladders, all clubs and difficulties, both ending families, save v1-v10 migration, corruption recovery and 50,000 long-session score checks.`);